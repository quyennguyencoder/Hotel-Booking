package com.nguyenquyen.hotelbooking;

import com.nguyenquyen.hotelbooking.dtos.NotificationDTO;

import com.nguyenquyen.hotelbooking.services.NotificationService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

import java.io.IOException;

@SpringBootApplication
@EnableAsync
@RequiredArgsConstructor
public class HotelBookingApplication {
    private final NotificationService notificationService;

    public static void main(String[] args) {
        SpringApplication.run(HotelBookingApplication.class, args);
    }

//    @PostConstruct
//    public void sendDummyEmail() throws IOException {
//        NotificationDTO notification = NotificationDTO.builder()
//                .recipient("quyennguyencoder@gmail.com")
//                .subject("Test Email")
//                .body("This is a test email from Hotel Booking Application.")
//                .build();
//        notificationService.sendEmail(notification);
//    }

}
