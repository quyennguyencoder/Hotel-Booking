package com.nguyenquyen.hotelbooking.mapper;

import com.nguyenquyen.hotelbooking.dtos.UserDTO;
import com.nguyenquyen.hotelbooking.entities.User;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDTO userToUserDTO(User user);
    List<UserDTO> userListToUserDTOList(List<User> users);


}

















