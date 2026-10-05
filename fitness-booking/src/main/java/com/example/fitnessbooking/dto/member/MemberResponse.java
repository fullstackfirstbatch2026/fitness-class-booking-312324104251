package com.example.fitnessbooking.dto.member;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record MemberResponse(

        Long id,

        String name,

        String email,

        String phone,

        String membershipType,

        LocalDate joinDate,

        String status,

        LocalDateTime createdAt,

        LocalDateTime updatedAt

) {
}