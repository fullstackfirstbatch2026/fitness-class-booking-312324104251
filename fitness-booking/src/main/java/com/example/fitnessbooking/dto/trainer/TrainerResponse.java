package com.example.fitnessbooking.dto.trainer;

import java.time.LocalDateTime;

public record TrainerResponse(

        Long id,

        String name,

        String email,

        String phone,

        String specialization,

        Integer experienceYears,

        String status,

        LocalDateTime createdAt,

        LocalDateTime updatedAt

) {
}