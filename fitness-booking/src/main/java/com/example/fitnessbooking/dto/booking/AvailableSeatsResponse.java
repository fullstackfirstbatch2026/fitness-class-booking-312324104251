package com.example.fitnessbooking.dto.booking;

public record AvailableSeatsResponse(

        Long classId,

        String className,

        Integer capacity,

        Integer availableSeats

) {
}