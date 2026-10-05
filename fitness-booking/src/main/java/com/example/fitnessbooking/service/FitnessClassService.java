package com.example.fitnessbooking.service;

import com.example.fitnessbooking.dto.fitnessclass.FitnessClassRequest;
import com.example.fitnessbooking.dto.fitnessclass.FitnessClassResponse;
import com.example.fitnessbooking.entity.FitnessClass;
import com.example.fitnessbooking.entity.Trainer;
import com.example.fitnessbooking.exception.ResourceNotFoundException;
import com.example.fitnessbooking.repository.FitnessClassRepository;
import com.example.fitnessbooking.repository.TrainerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class FitnessClassService {

    private final FitnessClassRepository fitnessClassRepository;
    private final TrainerRepository trainerRepository;

    // Constructor injection
    public FitnessClassService(
            FitnessClassRepository fitnessClassRepository,
            TrainerRepository trainerRepository
    ) {
        this.fitnessClassRepository = fitnessClassRepository;
        this.trainerRepository = trainerRepository;
    }

    // CREATE CLASS
    public FitnessClassResponse createClass(
            FitnessClassRequest request
    ) {

        Trainer trainer = trainerRepository.findById(
                request.trainerId()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Trainer not found with id: "
                                + request.trainerId()
                )
        );

        // Only active trainers can conduct classes
        if (!trainer.getStatus().equals("ACTIVE")) {
            throw new IllegalArgumentException(
                    "Cannot assign an inactive trainer"
            );
        }

        // Validate class timing
        if (!request.endTime().isAfter(request.startTime())) {
            throw new IllegalArgumentException(
                    "End time must be after start time"
            );
        }

        // Create FitnessClass without Lombok builder
        FitnessClass fitnessClass = new FitnessClass();

        fitnessClass.setClassName(request.className());
        fitnessClass.setDescription(request.description());
        fitnessClass.setTrainer(trainer);
        fitnessClass.setScheduleDate(request.scheduleDate());
        fitnessClass.setStartTime(request.startTime());
        fitnessClass.setEndTime(request.endTime());
        fitnessClass.setCapacity(request.capacity());
        fitnessClass.setAvailableSeats(request.capacity());
        fitnessClass.setStatus("OPEN");

        FitnessClass savedClass =
                fitnessClassRepository.save(fitnessClass);

        return toResponse(savedClass);
    }

    // GET ALL CLASSES
    @Transactional(readOnly = true)
    public List<FitnessClassResponse> getAllClasses() {

        return fitnessClassRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // GET CLASS BY ID
    @Transactional(readOnly = true)
    public FitnessClassResponse getClassById(Long id) {

        FitnessClass fitnessClass =
                fitnessClassRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Class not found with id: " + id
                                )
                        );

        return toResponse(fitnessClass);
    }

    // UPDATE CLASS
    public FitnessClassResponse updateClass(
            Long id,
            FitnessClassRequest request
    ) {

        FitnessClass fitnessClass =
                fitnessClassRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Class not found with id: " + id
                                )
                        );

        Trainer trainer = trainerRepository.findById(
                request.trainerId()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Trainer not found with id: "
                                + request.trainerId()
                )
        );

        // Trainer must be active
        if (!trainer.getStatus().equals("ACTIVE")) {
            throw new IllegalArgumentException(
                    "Cannot assign an inactive trainer"
            );
        }

        // Validate class timing
        if (!request.endTime().isAfter(request.startTime())) {
            throw new IllegalArgumentException(
                    "End time must be after start time"
            );
        }

        // Update basic information
        fitnessClass.setClassName(request.className());
        fitnessClass.setDescription(request.description());
        fitnessClass.setTrainer(trainer);
        fitnessClass.setScheduleDate(request.scheduleDate());
        fitnessClass.setStartTime(request.startTime());
        fitnessClass.setEndTime(request.endTime());

        /*
         * Calculate already booked seats.
         *
         * Example:
         * Capacity = 10
         * Available seats = 7
         *
         * Booked seats = 10 - 7 = 3
         */
        int bookedSeats =
                fitnessClass.getCapacity()
                        - fitnessClass.getAvailableSeats();

        /*
         * New capacity cannot be smaller than
         * the number of people already booked.
         */
        if (request.capacity() < bookedSeats) {
            throw new IllegalArgumentException(
                    "New capacity cannot be less than current bookings"
            );
        }

        fitnessClass.setCapacity(request.capacity());

        /*
         * Recalculate available seats.
         *
         * Example:
         * New capacity = 15
         * Booked seats = 3
         * Available seats = 12
         */
        fitnessClass.setAvailableSeats(
                request.capacity() - bookedSeats
        );

        return toResponse(fitnessClass);
    }

    // DELETE CLASS
    public void deleteClass(Long id) {

        FitnessClass fitnessClass =
                fitnessClassRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Class not found with id: " + id
                                )
                        );

        fitnessClassRepository.delete(fitnessClass);
    }

    // GET CLASSES BY STATUS
    @Transactional(readOnly = true)
    public List<FitnessClassResponse> getClassesByStatus(
            String status
    ) {

        return fitnessClassRepository.findByStatus(status)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // ENTITY -> RESPONSE DTO
    private FitnessClassResponse toResponse(
            FitnessClass fitnessClass
    ) {

        Trainer trainer = fitnessClass.getTrainer();

        return new FitnessClassResponse(
                fitnessClass.getId(),
                fitnessClass.getClassName(),
                fitnessClass.getDescription(),
                trainer.getId(),
                trainer.getName(),
                fitnessClass.getScheduleDate(),
                fitnessClass.getStartTime(),
                fitnessClass.getEndTime(),
                fitnessClass.getCapacity(),
                fitnessClass.getAvailableSeats(),
                fitnessClass.getStatus()
        );
    }
}