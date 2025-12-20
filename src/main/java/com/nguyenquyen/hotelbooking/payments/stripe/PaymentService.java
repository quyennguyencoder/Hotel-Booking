package com.nguyenquyen.hotelbooking.payments.stripe;
import com.nguyenquyen.hotelbooking.dtos.NotificationDTO;
import com.nguyenquyen.hotelbooking.dtos.Response;
import com.nguyenquyen.hotelbooking.entities.Booking;
import com.nguyenquyen.hotelbooking.entities.PaymentEntity;
import com.nguyenquyen.hotelbooking.enums.NotificationType;
import com.nguyenquyen.hotelbooking.enums.PaymentGateway;
import com.nguyenquyen.hotelbooking.enums.PaymentStatus;
import com.nguyenquyen.hotelbooking.exceptions.NotFoundException;
import com.nguyenquyen.hotelbooking.repositories.BookingRepository;
import com.nguyenquyen.hotelbooking.repositories.PaymentRepository;
import com.nguyenquyen.hotelbooking.services.BookingService;
import com.nguyenquyen.hotelbooking.services.NotificationService;
import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final NotificationService notificationService;

    @Value("${stripe.api.secret.key}")
    private String secretKey;

    /*
     this method will return a unique transaction which will be used to confirm the payment on the client
     */
    public String createPaymentIntent(PaymentRequest paymentRequest) {
        Stripe.apiKey = secretKey;
        String bookingReference = paymentRequest.getBookingReference();
        Booking booking = bookingRepository.findByBookingReference(bookingReference)
                .orElseThrow(() -> new NotFoundException("Booking not found with reference: " + bookingReference));
        if (booking.getPaymentStatus() == PaymentStatus.COMPLETED){
            throw new IllegalStateException("Payment has already been completed for this booking.");
        }
        if(booking.getTotalPrice().compareTo(paymentRequest.getAmount()) != 0){
            throw new IllegalArgumentException("Payment amount does not match booking total amount.");
        }

        try{
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(paymentRequest.getAmount().multiply(BigDecimal.valueOf(100)).longValue()) // amount in cents
                    .setCurrency("usd")
                    .putMetadata("bookingReference", bookingReference)
                    .build();
            PaymentIntent intent = PaymentIntent.create(params);
            return intent.getClientSecret();

        }catch (Exception e){
            throw new RuntimeException("Payment request could not be created");
        }
    }

    public void updatePaymentBooking(PaymentRequest paymentRequest) throws IOException {
        String bookingReference = paymentRequest.getBookingReference();
        Booking booking = bookingRepository.findByBookingReference(bookingReference)
                .orElseThrow(() -> new NotFoundException("Booking not found with reference: " + bookingReference));

        PaymentEntity payment = PaymentEntity.builder()
                .paymentGateway(PaymentGateway.STRIPE)
                .amount(paymentRequest.getAmount())
                .transactionId(paymentRequest.getTransactionId())
                .paymentStatus(paymentRequest.isSuccess()? PaymentStatus.COMPLETED : PaymentStatus.FAILED)
                .paymentDate(LocalDateTime.now())
                .bookingReference(bookingReference)
                .user(booking.getUser())
                .build();
        if(!paymentRequest.isSuccess()){
            payment.setFailureReason(paymentRequest.getFailureReason());
        }
        paymentRepository.save(payment);

        NotificationDTO notificationDTO = NotificationDTO.builder()
                .recipient(booking.getUser().getEmail())
                .type(NotificationType.EMAIL)
                .bookingReference(bookingReference)
                .build();

        if(paymentRequest.isSuccess()){
            booking.setPaymentStatus(PaymentStatus.COMPLETED);
            bookingRepository.save(booking);
            notificationDTO.setSubject("Payment Successful" );
            notificationDTO.setBody("Payment Successful for Booking " + bookingReference);
            notificationService.sendEmail(notificationDTO);
        }else{
            booking.setPaymentStatus(PaymentStatus.FAILED);
            bookingRepository.save(booking);
            notificationDTO.setSubject("Payment Failed" );
            notificationDTO.setBody("Payment Failed for Booking " + bookingReference + ". Reason: " + paymentRequest.getFailureReason());
            notificationService.sendEmail(notificationDTO);
        }
    }
}
