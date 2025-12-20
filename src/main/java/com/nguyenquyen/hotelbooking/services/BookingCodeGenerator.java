package com.nguyenquyen.hotelbooking.services;

import com.nguyenquyen.hotelbooking.entities.BookingReference;
import com.nguyenquyen.hotelbooking.repositories.BookingReferenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
@RequiredArgsConstructor
public class BookingCodeGenerator {

    private final BookingReferenceRepository bookingReferenceRepository;


    public String generateBookingReference() {
        String bookingReference;

        do{
            bookingReference = generateRandomAlphanumericCode(10);

        }while (isBookingReferenceExists(bookingReference));
        saveBookingReference(bookingReference);
        return bookingReference;
    }
    private String generateRandomAlphanumericCode(int length) {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random random = new Random();
        StringBuilder code = new StringBuilder();

        for (int i = 0; i < length; i++) {
            int index = random.nextInt(characters.length());
            code.append(characters.charAt(index));
        }

        return code.toString();
    }
    private boolean isBookingReferenceExists(String referenceNo) {
        return bookingReferenceRepository.findByReferenceNo(referenceNo).isPresent();
    }
    private void saveBookingReference(String referenceNo) {
        BookingReference bookingReference = BookingReference.builder()
                .referenceNo(referenceNo)
                .build();
        bookingReferenceRepository.save(bookingReference);
    }
}
