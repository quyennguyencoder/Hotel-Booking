package com.nguyenquyen.hotelbooking.services.impl;

import com.nguyenquyen.hotelbooking.dtos.Response;
import com.nguyenquyen.hotelbooking.dtos.RoomDTO;
import com.nguyenquyen.hotelbooking.entities.Room;
import com.nguyenquyen.hotelbooking.enums.RoomType;
import com.nguyenquyen.hotelbooking.exceptions.InvalidBookingStateAndDateException;
import com.nguyenquyen.hotelbooking.exceptions.NotFoundException;
import com.nguyenquyen.hotelbooking.mapper.RoomMapper;
import com.nguyenquyen.hotelbooking.repositories.RoomRepository;
import com.nguyenquyen.hotelbooking.services.RoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {
    private final RoomRepository roomRepository;
    private final RoomMapper roomMapper;

    @Value("${upload-directory}")
    private String UPLOAD_DIRECTORY;
    @Value("${base-url}")
    private String BASE_URL;


    @Override
    public Response addRoom(RoomDTO roomDTO, MultipartFile imageFile) throws IOException {
        Room roomToSave = roomMapper.roomDTOToRoom(roomDTO);
        if(imageFile!=null){
            String imagePath = saveImage(imageFile);
            roomToSave.setImageUrl(imagePath);
        }
        roomRepository.save(roomToSave);
        return Response.builder()
                .status(200)
                .message("Room added successfully!")

                .build();
    }

    @Override
    public Response updateRoom(RoomDTO roomDTO, MultipartFile imageFile) throws IOException {
        Room existingRoom = roomRepository.findById(roomDTO.getId())
                .orElseThrow(() -> new NotFoundException("Room not found"));
        if(imageFile!=null){
            String imagePath = saveImage(imageFile);
            existingRoom.setImageUrl(imagePath);
        }
        if(roomDTO.getRoomNumber()!=null){
            existingRoom.setRoomNumber(roomDTO.getRoomNumber());
        }
        if(roomDTO.getPricePerNight()!=null){
            existingRoom.setPricePerNight(roomDTO.getPricePerNight());
        }
        if(roomDTO.getCapacity()!=null){
            existingRoom.setCapacity(roomDTO.getCapacity());
        }
        if(roomDTO.getType()!=null){
            existingRoom.setType(roomDTO.getType());
        }
        if(roomDTO.getDescription()!=null) {
            existingRoom.setDescription(roomDTO.getDescription());
        }
        roomRepository.save(existingRoom);
        return Response.builder()
                .status(200)
                .message("Room updated successfully!")
                .build();
    }

    @Override
    public Response getAllRooms() {
        List<Room> rooms = roomRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
        List<RoomDTO> roomDTOList = roomMapper.roomListToRoomDTOList(rooms);
        return Response.builder()
                .status(200)
                .message("Fetched all rooms successfully")
                .rooms(roomDTOList)
                .build();
    }

    @Override
    public Response getRoomById(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Room not found"));
        RoomDTO roomDTO = roomMapper.roomToRoomDTO(room);
        return Response.builder()
                .status(200)
                .message("Fetched room details successfully")
                .room(roomDTO)
                .build();
    }

    @Override
    public Response deleteRoom(Long id) {
        if(!roomRepository.existsById(id)){
            throw new NotFoundException("Room not found");
        }
        roomRepository.deleteById(id);
        return Response.builder()
                .status(200)
                .message("Room deleted successfully")
                .build();
    }

    @Override
    public Response getAvailableRooms(LocalDate checkInDate, LocalDate checkOutDate, RoomType roomType) {
        if(checkInDate.isBefore(LocalDate.now()) || checkOutDate.isBefore(LocalDate.now())){
            throw new InvalidBookingStateAndDateException("Check-in and check-out dates must be in the future");
        }
        if(checkOutDate.isBefore(checkInDate) || checkOutDate.isEqual(checkInDate)){
            throw new InvalidBookingStateAndDateException("Check-out date must be after check-in date");
        }
        List<Room> availableRooms = roomRepository.findAvailableRooms(checkInDate, checkOutDate, roomType);
        List<RoomDTO> roomDTOList = roomMapper.roomListToRoomDTOList(availableRooms);
        return Response.builder()
                .status(200)
                .message("Fetched available rooms successfully")
                .rooms(roomDTOList)
                .build();
    }

    @Override
    public List<RoomType> getAllRoomTypes() {
        return Arrays.asList(RoomType.values());
    }

    @Override
    public Response searchRoom(String input) {
        List<Room> rooms = roomRepository.searchRooms(input);
        List<RoomDTO> roomDTOList = roomMapper.roomListToRoomDTOList(rooms);
        return Response.builder()
                .status(200)
                .message("Search completed successfully")
                .rooms(roomDTOList)
                .build();
    }


    private String saveImage(MultipartFile imageFile) throws IOException {
        if (imageFile == null || imageFile.getContentType() == null || !imageFile.getContentType().startsWith("image/")) {
            throw new IllegalArgumentException("Invalid image file type");
        }

        String originalFilename = imageFile.getOriginalFilename();
        if (originalFilename == null || originalFilename.isEmpty()) {
            throw new IllegalArgumentException("File name cannot be empty");
        }

        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf('.'));
        String uniqueFileName = UUID.randomUUID() + fileExtension;

        Path uploadDir = Paths.get(UPLOAD_DIRECTORY);
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        Path imagePath = uploadDir.resolve(uniqueFileName);
        Files.copy(imageFile.getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);

        return BASE_URL + "/" + UPLOAD_DIRECTORY + "/" + uniqueFileName;
    }
}