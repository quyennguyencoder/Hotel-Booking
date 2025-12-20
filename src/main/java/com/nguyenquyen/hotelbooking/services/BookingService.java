package com.nguyenquyen.hotelbooking.services;

import com.nguyenquyen.hotelbooking.dtos.BookingDTO;
import com.nguyenquyen.hotelbooking.dtos.Response;

import java.io.IOException;

public interface BookingService {

    Response getAllBookings();
    Response createBooking(BookingDTO bookingDTO) throws IOException;
    Response findBookingByReferenceNo(String  bookingReference);
    Response updateBooking(BookingDTO bookingDTO);
}
