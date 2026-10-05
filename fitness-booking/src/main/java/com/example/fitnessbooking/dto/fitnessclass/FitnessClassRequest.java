package com.example.fitnessbooking.dto.fitnessclass;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

public record FitnessClassRequest(

        @NotBlank(message = "Class name is required")
        String className,

        String description,

        @NotNull(message = "Trainer ID is required")
        Long trainerId,

        @NotNull(message = "Schedule date is required")
        @FutureOrPresent(message = "Schedule date cannot be in the past")
        LocalDate scheduleDate,

        @NotNull(message = "Start time is required")
        LocalTime startTime,

        @NotNull(message = "End time is required")
        LocalTime endTime,

        @NotNull(message = "Capacity is required")
        @Min(value = 1, message = "Capacity must be at least 1")
        Integer capacity

) {
}