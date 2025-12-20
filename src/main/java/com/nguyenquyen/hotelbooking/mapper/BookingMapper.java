package com.nguyenquyen.hotelbooking.mapper;

import com.nguyenquyen.hotelbooking.dtos.BookingDTO;
import com.nguyenquyen.hotelbooking.entities.Booking;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface BookingMapper {
    BookingDTO bookingToBookingDTO(Booking booking);
    List<BookingDTO> bookingListToBookingDTOList(List<Booking> bookings);
}
