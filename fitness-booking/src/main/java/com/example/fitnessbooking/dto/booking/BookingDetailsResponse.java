package com.example.fitnessbooking.dto.booking;

import java.time.LocalDateTime;

public record BookingDetailsResponse(

        Long bookingId,

        String memberName,

        String memberEmail,

        String className,

        String trainerName,

        String specialization,

        LocalDateTime bookingDate,

        String status

) {
}