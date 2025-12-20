package com.nguyenquyen.hotelbooking.payments.stripe;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping("/pay")
    public ResponseEntity<String> initPayment(@RequestBody PaymentRequest paymentRequest) throws IOException {
        return ResponseEntity.ok(paymentService.createPaymentIntent(paymentRequest));
    }

    @PutMapping("/update")
    public void updatePaymentStatus(@RequestBody PaymentRequest paymentRequest) throws IOException {
        paymentService.updatePaymentBooking(paymentRequest);
    }

}