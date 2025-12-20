package com.nguyenquyen.hotelbooking.services.impl;

import com.nguyenquyen.hotelbooking.dtos.*;
import com.nguyenquyen.hotelbooking.entities.Booking;
import com.nguyenquyen.hotelbooking.entities.User;
import com.nguyenquyen.hotelbooking.enums.UserRole;
import com.nguyenquyen.hotelbooking.exceptions.InvalidCredentialException;
import com.nguyenquyen.hotelbooking.exceptions.NotFoundException;
import com.nguyenquyen.hotelbooking.mapper.BookingMapper;
import com.nguyenquyen.hotelbooking.mapper.UserMapper;
import com.nguyenquyen.hotelbooking.repositories.BookingRepository;
import com.nguyenquyen.hotelbooking.repositories.UserRepository;
import com.nguyenquyen.hotelbooking.secucrity.JwtUtils;
import com.nguyenquyen.hotelbooking.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final UserMapper userMapper;
    private final BookingMapper bookingMapper;
    private final BookingRepository bookingRepository;


    @Override
    public Response registerUser(RegistrationRequest registrationRequest) {
        UserRole role = UserRole.CUSTOMER;
        if (registrationRequest.getRole() != null) {
            role = registrationRequest.getRole();
        }
        User userToSave = User.builder()
                .firstName(registrationRequest.getFirstName())
                .lastName(registrationRequest.getLastName())
                .email(registrationRequest.getEmail())
                .phoneNumber(registrationRequest.getPhoneNumber())
                .password(passwordEncoder.encode(registrationRequest.getPassword()))
                .role(role)
                .isActive(true)
                .build();
        userRepository.save(userToSave);
        return Response.builder()
                .status(200)
                .message("User registered successfully!")
                .build();
    }

    @Override
    public Response loginUser(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new NotFoundException("User not found with email: " + loginRequest.getEmail()));
        if(!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new InvalidCredentialException("Invalid password");
        }
        String token = jwtUtils.generateToken(user.getEmail());
        return Response.builder()
                .status(200)
                .message("Login successful")
                .role(user.getRole())
                .token(token)
                .isActive(user.getIsActive())
                .expirationTime("6 months")
                .build();
    }

    @Override
    public Response getAllUsers() {
        List<User> users = userRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
        List<UserDTO> userDTOList = userMapper.userListToUserDTOList(users);
        return Response.builder()
                .status(200)
                .message("Fetched all users successfully")
                .users(userDTOList)
                .build();
    }
    @Override
    public Response getOwnAccountDetails() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found with email: " + email));
        UserDTO userDTO = userMapper.userToUserDTO(user);
        return Response.builder()
                .status(200)
                .message("Fetched user details successfully")
                .user(userDTO)
                .build();
    }

    @Override
    public User getCurrentLoggedInUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found with email: " + email));
    }

    @Override
    public Response updateOwnAccount(UserDTO userDTO) {
        User existingUser = getCurrentLoggedInUser();
        if(userDTO.getEmail()!=null ) {
            existingUser.setEmail(userDTO.getEmail());
        }
        if(userDTO.getFirstName()!=null ) {
            existingUser.setFirstName(userDTO.getFirstName());
        }
        if(userDTO.getLastName()!=null ) {
            existingUser.setLastName(userDTO.getLastName());
        }
        if(userDTO.getPhoneNumber()!=null ) {
            existingUser.setPhoneNumber(userDTO.getPhoneNumber());
        }
        if(userDTO.getPassword()!=null && !userDTO.getPassword().isEmpty() ) {
            existingUser.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }
        userRepository.save(existingUser);
        return Response.builder()
                .status(200)
                .message("User account updated successfully")
                .build();
    }

    @Override
    public Response deleteOwnAccount() {
        User currentUser = getCurrentLoggedInUser();
        userRepository.delete(currentUser);
        return Response.builder()
                .status(200)
                .message("User account deleted successfully")
                .build();
    }

    @Override
    public Response getMyBookingHistory() {
        User currentUser = getCurrentLoggedInUser();
        List<Booking> bookings = bookingRepository.findByUserId(currentUser.getId());
        List<BookingDTO> bookingDTOList = bookingMapper.bookingListToBookingDTOList(bookings);
        return Response.builder()
                .status(200)
                .message("Fetched booking history successfully")
                .bookings(bookingDTOList)
                .build();
    }
}













