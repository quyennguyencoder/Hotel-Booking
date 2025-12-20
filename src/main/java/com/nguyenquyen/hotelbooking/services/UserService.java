package com.nguyenquyen.hotelbooking.services;

import com.nguyenquyen.hotelbooking.dtos.LoginRequest;
import com.nguyenquyen.hotelbooking.dtos.RegistrationRequest;
import com.nguyenquyen.hotelbooking.dtos.Response;
import com.nguyenquyen.hotelbooking.dtos.UserDTO;
import com.nguyenquyen.hotelbooking.entities.User;

public interface UserService {
    Response registerUser(RegistrationRequest registrationRequest);
    Response loginUser(LoginRequest loginRequest);
    Response getAllUsers();
    Response getOwnAccountDetails();
    User getCurrentLoggedInUser();
    Response updateOwnAccount(UserDTO userDTO);
    Response deleteOwnAccount();
    Response getMyBookingHistory();
}
