package com.example.fitnessbooking.dto.booking;

import jakarta.validation.constraints.NotNull;

public record BookingRequest(

        @NotNull(message = "Member ID is required")
        Long memberId,

        @NotNull(message = "Class ID is required")
        Long classId

) {
}