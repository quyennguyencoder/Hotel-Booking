package com.nguyenquyen.hotelbooking.mapper;

import com.nguyenquyen.hotelbooking.dtos.RoomDTO;
import com.nguyenquyen.hotelbooking.entities.Room;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RoomMapper {
    Room roomDTOToRoom(RoomDTO roomDTO);

    List<RoomDTO> roomListToRoomDTOList(List<Room> rooms);

    RoomDTO roomToRoomDTO(Room room);
}
