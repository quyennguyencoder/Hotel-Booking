package com.nguyenquyen.hotelbooking.services.impl;

import com.nguyenquyen.hotelbooking.dtos.BookingDTO;
import com.nguyenquyen.hotelbooking.dtos.NotificationDTO;
import com.nguyenquyen.hotelbooking.dtos.Response;
import com.nguyenquyen.hotelbooking.dtos.UserDTO;
import com.nguyenquyen.hotelbooking.entities.Booking;
import com.nguyenquyen.hotelbooking.entities.Room;
import com.nguyenquyen.hotelbooking.entities.User;
import com.nguyenquyen.hotelbooking.enums.BookingStatus;
import com.nguyenquyen.hotelbooking.enums.PaymentStatus;
import com.nguyenquyen.hotelbooking.exceptions.InvalidBookingStateAndDateException;
import com.nguyenquyen.hotelbooking.exceptions.NotFoundException;
import com.nguyenquyen.hotelbooking.mapper.BookingMapper;
import com.nguyenquyen.hotelbooking.repositories.BookingReferenceRepository;
import com.nguyenquyen.hotelbooking.repositories.BookingRepository;
import com.nguyenquyen.hotelbooking.repositories.RoomRepository;
import com.nguyenquyen.hotelbooking.repositories.UserRepository;
import com.nguyenquyen.hotelbooking.services.BookingCodeGenerator;
import com.nguyenquyen.hotelbooking.services.BookingService;
import com.nguyenquyen.hotelbooking.services.NotificationService;
import com.nguyenquyen.hotelbooking.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService{
    private final BookingRepository bookingRepository;

    private final NotificationService notificationService;
    private final BookingCodeGenerator bookingCodeGenerator;
    private final BookingMapper bookingMapper;
    private final UserService userService;
    private final RoomRepository roomRepository;


    @Override
    public Response getAllBookings() {
        List<Booking> bookingList = bookingRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
        List<BookingDTO> bookingDTOList = bookingMapper.bookingListToBookingDTOList(bookingList);
        for(BookingDTO bookingDTO : bookingDTOList){
             bookingDTO.setUser(null);
             bookingDTO.setRoom(null);
        }
        return Response.builder()
                .status(200)
                .message("Bookings retrieved successfully!")
                .bookings(bookingDTOList)
                .build();
    }

    @Override
    public Response createBooking(BookingDTO bookingDTO) throws IOException {
        User currentUser = userService.getCurrentLoggedInUser();

        Room room = roomRepository.findById(bookingDTO.getRoomId())
                .orElseThrow(() -> new NotFoundException("Room not found"));

        if(bookingDTO.getCheckInDate().isBefore(LocalDate.now()) ||
                bookingDTO.getCheckOutDate().isBefore(LocalDate.now())){
            throw new InvalidBookingStateAndDateException("Check-in and check-out dates must be in the future");
        }
        if(bookingDTO.getCheckOutDate().isBefore(bookingDTO.getCheckInDate()) ||
                bookingDTO.getCheckOutDate().isEqual(bookingDTO.getCheckInDate())){
            throw new InvalidBookingStateAndDateException("Check-out date must be after check-in date");
        }

        boolean isAvailable = bookingRepository.isRoomAvailable(room.getId(), bookingDTO.getCheckInDate(), bookingDTO.getCheckOutDate());
        if(!isAvailable){
            throw new InvalidBookingStateAndDateException("Room is not available for the selected dates");
        }
        BigDecimal totalPrice = calculateTotalPrice(room, bookingDTO);
        String bookingReference = bookingCodeGenerator.generateBookingReference();
        Booking bookingToSave = Booking.builder()
                .user(currentUser)
                .room(room)
                .checkInDate(bookingDTO.getCheckInDate())
                .checkOutDate(bookingDTO.getCheckOutDate())
                .totalPrice(totalPrice)
                .bookingReference(bookingReference)
                .bookingStatus(BookingStatus.BOOKED)
                .paymentStatus(PaymentStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();
        bookingRepository.save(bookingToSave);
        String paymentLink = "http://localhost:3000/payment/" + bookingReference + "/" + totalPrice;
        NotificationDTO notificationDTO = NotificationDTO.builder()
                .recipient(currentUser.getEmail())
                .subject("Booking Confirmation - Reference No: " + bookingReference)
                .body("Dear " + currentUser.getFirstName() + currentUser.getLastName() + ",\n\n" +
                        "Thank you for your booking! Your booking reference number is " + bookingReference + ".\n" +
                        "Total Price: $" + totalPrice + "\n" +
                        "Please proceed to payment using the following link: " + paymentLink
                )
                .bookingReference(bookingReference)
                .build();
        notificationService.sendEmail(notificationDTO);
        return Response.builder()
                .status(201)
                .message("Booking created successfully! Please check your email for payment details.")
                .booking(bookingDTO)
                .build();

    }

    @Override
    public Response findBookingByReferenceNo(String bookingReference) {
        Booking booking = bookingRepository.findByBookingReference(bookingReference)
                .orElseThrow(() -> new NotFoundException("Booking not found with reference number: " + bookingReference));
        BookingDTO bookingDTO = bookingMapper.bookingToBookingDTO(booking);
        return Response.builder()
                .status(200)
                .message("Booking retrieved successfully!")
                .booking(bookingDTO)
                .build();
    }

    @Override
    public Response updateBooking(BookingDTO bookingDTO) {
        if(bookingDTO.getId() == null){
            throw new NotFoundException("Booking ID is required for update");
        }
        Booking existingBooking = bookingRepository.findById(bookingDTO.getId())
                .orElseThrow(() -> new NotFoundException("Booking not found with ID: " + bookingDTO.getId()));
        if(bookingDTO.getBookingStatus() != null){
            existingBooking.setBookingStatus(bookingDTO.getBookingStatus());
        }
        if(bookingDTO.getPaymentStatus() != null){
            existingBooking.setPaymentStatus(bookingDTO.getPaymentStatus());
        }
        bookingRepository.save(existingBooking);
        BookingDTO updatedBookingDTO = bookingMapper.bookingToBookingDTO(existingBooking);
        return Response.builder()
                .status(200)
                .message("Booking updated successfully!")
                .booking(updatedBookingDTO)
                .build();
    }

    private BigDecimal calculateTotalPrice(Room room, BookingDTO bookingDTO) {
        BigDecimal pricePerNight = room.getPricePerNight();
        long numberOfNights = ChronoUnit.DAYS.between(bookingDTO.getCheckInDate(), bookingDTO.getCheckOutDate());
        return pricePerNight.multiply(BigDecimal.valueOf(numberOfNights));
    }

}