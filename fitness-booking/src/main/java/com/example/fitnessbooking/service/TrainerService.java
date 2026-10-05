package com.example.fitnessbooking.service;

import com.example.fitnessbooking.dto.trainer.TrainerRequest;
import com.example.fitnessbooking.dto.trainer.TrainerResponse;
import com.example.fitnessbooking.entity.Trainer;
import com.example.fitnessbooking.exception.ResourceNotFoundException;
import com.example.fitnessbooking.repository.TrainerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TrainerService {

    private final TrainerRepository trainerRepository;

    // Constructor injection
    public TrainerService(TrainerRepository trainerRepository) {
        this.trainerRepository = trainerRepository;
    }

    // CREATE TRAINER
    public TrainerResponse createTrainer(TrainerRequest request) {

        if (trainerRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException(
                    "Email already registered"
            );
        }

        if (trainerRepository.existsByPhone(request.phone())) {
            throw new IllegalArgumentException(
                    "Phone number already registered"
            );
        }

        Trainer trainer = new Trainer();

        trainer.setName(request.name());
        trainer.setEmail(request.email());
        trainer.setPhone(request.phone());
        trainer.setSpecialization(request.specialization());
        trainer.setExperienceYears(request.experienceYears());
        trainer.setStatus("ACTIVE");

        Trainer savedTrainer =
                trainerRepository.save(trainer);

        return toResponse(savedTrainer);
    }

    // GET ALL TRAINERS
    @Transactional(readOnly = true)
    public List<TrainerResponse> getAllTrainers() {

        return trainerRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // GET TRAINER BY ID
    @Transactional(readOnly = true)
    public TrainerResponse getTrainerById(Long id) {

        Trainer trainer =
                trainerRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Trainer not found with id: " + id
                                )
                        );

        return toResponse(trainer);
    }

    // UPDATE TRAINER
    public TrainerResponse updateTrainer(
            Long id,
            TrainerRequest request
    ) {

        Trainer trainer =
                trainerRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Trainer not found with id: " + id
                                )
                        );

        trainer.setName(request.name());
        trainer.setEmail(request.email());
        trainer.setPhone(request.phone());
        trainer.setSpecialization(request.specialization());
        trainer.setExperienceYears(request.experienceYears());

        return toResponse(trainer);
    }

    // DELETE TRAINER
    public void deleteTrainer(Long id) {

        Trainer trainer =
                trainerRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Trainer not found with id: " + id
                                )
                        );

        trainerRepository.delete(trainer);
    }

    // ENTITY -> RESPONSE DTO
    private TrainerResponse toResponse(Trainer trainer) {

        return new TrainerResponse(
                trainer.getId(),
                trainer.getName(),
                trainer.getEmail(),
                trainer.getPhone(),
                trainer.getSpecialization(),
                trainer.getExperienceYears(),
                trainer.getStatus(),
                trainer.getCreatedAt(),
                trainer.getUpdatedAt()
        );
    }
}