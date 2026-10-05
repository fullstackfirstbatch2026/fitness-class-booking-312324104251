package com.example.fitnessbooking.repository;

import com.example.fitnessbooking.entity.FitnessClass;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface FitnessClassRepository
        extends JpaRepository<FitnessClass, Long> {

    List<FitnessClass> findByStatus(String status);

    List<FitnessClass> findByTrainerId(Long trainerId);

    List<FitnessClass> findByScheduleDate(LocalDate scheduleDate);
}