package com.example.fitnessbooking.dto.fitnessclass;

import java.time.LocalDate;
import java.time.LocalTime;

public record FitnessClassResponse(

        Long id,

        String className,

        String description,

        Long trainerId,

        String trainerName,

        LocalDate scheduleDate,

        LocalTime startTime,

        LocalTime endTime,

        Integer capacity,

        Integer availableSeats,

        String status

) {
}