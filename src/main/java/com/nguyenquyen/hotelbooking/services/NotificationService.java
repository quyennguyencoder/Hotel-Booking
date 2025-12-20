package com.nguyenquyen.hotelbooking.services;

import com.nguyenquyen.hotelbooking.dtos.NotificationDTO;

import java.io.IOException;

public interface NotificationService {
    void sendEmail(NotificationDTO notificationDTO) throws IOException;
    void sendSMS(NotificationDTO notificationDTO) throws IOException;
    void sendWhatsapp(NotificationDTO notificationDTO) throws IOException;
}
