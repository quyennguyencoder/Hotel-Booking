package com.nguyenquyen.hotelbooking.services;

import com.nguyenquyen.hotelbooking.dtos.Response;
import com.nguyenquyen.hotelbooking.dtos.RoomDTO;
import com.nguyenquyen.hotelbooking.enums.RoomType;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

public interface RoomService {
    Response addRoom(RoomDTO roomDTO, MultipartFile imageFile) throws IOException;
    Response updateRoom(RoomDTO roomDTO, MultipartFile imageFile) throws IOException;
    Response getAllRooms();
    Response getRoomById(Long id);
    Response deleteRoom(Long id);
    Response getAvailableRooms(LocalDate checkInDate, LocalDate checkOutDate, RoomType roomType);
    List<RoomType> getAllRoomTypes();
    Response searchRoom(String input);
}
