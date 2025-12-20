package com.nguyenquyen.hotelbooking.services.impl;

import com.nguyenquyen.hotelbooking.dtos.NotificationDTO;
import com.nguyenquyen.hotelbooking.entities.Notification;
import com.nguyenquyen.hotelbooking.enums.NotificationType;
import com.nguyenquyen.hotelbooking.repositories.NotificationRepository;
import com.nguyenquyen.hotelbooking.services.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final JavaMailSender javaMailSender;
    private final NotificationRepository notificationRepository;

    @Override
    public void sendEmail(NotificationDTO notificationDTO) throws IOException {

        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();

        simpleMailMessage.setTo(notificationDTO.getRecipient());
        simpleMailMessage.setSubject(notificationDTO.getSubject());
        simpleMailMessage.setText(notificationDTO.getBody());
        log.info("Sending email ...");
        javaMailSender.send(simpleMailMessage);

        //SAVE TO DATABSE
        Notification notificationToSave = Notification.builder()
                .recipient(notificationDTO.getRecipient())
                .subject(notificationDTO.getSubject())
                .body(notificationDTO.getBody())
                .bookingReference(notificationDTO.getBookingReference())
                .type(NotificationType.EMAIL)
                .build();

        notificationRepository.save(notificationToSave);
    }

    @Override
    public void sendSMS(NotificationDTO notificationDTO) throws IOException {

    }

    @Override
    public void sendWhatsapp(NotificationDTO notificationDTO) throws IOException {

    }
}
