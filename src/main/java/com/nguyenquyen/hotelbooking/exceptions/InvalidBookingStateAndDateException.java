package com.nguyenquyen.hotelbooking.exceptions;

public class InvalidBookingStateAndDateException extends RuntimeException {
    public InvalidBookingStateAndDateException(String message) {
        super(message);
    }
}
