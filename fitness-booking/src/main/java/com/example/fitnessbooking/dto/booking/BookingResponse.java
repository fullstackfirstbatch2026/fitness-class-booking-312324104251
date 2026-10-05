package com.example.fitnessbooking.dto.booking;

import java.time.LocalDateTime;

public record BookingResponse(

        Long id,

        Long memberId,

        Long classId,

        String status,

        LocalDateTime bookingDate

) {
}