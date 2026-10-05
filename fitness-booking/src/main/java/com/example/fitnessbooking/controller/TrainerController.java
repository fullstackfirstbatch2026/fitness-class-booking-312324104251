package com.example.fitnessbooking.controller;

import com.example.fitnessbooking.dto.trainer.TrainerRequest;
import com.example.fitnessbooking.dto.trainer.TrainerResponse;
import com.example.fitnessbooking.service.TrainerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trainers")
public class TrainerController {

    private final TrainerService trainerService;

    public TrainerController(TrainerService trainerService) {
        this.trainerService = trainerService;
    }

    // CREATE TRAINER
    @PostMapping
    public ResponseEntity<TrainerResponse> createTrainer(
            @Valid @RequestBody TrainerRequest request
    ) {

        TrainerResponse response =
                trainerService.createTrainer(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // GET ALL TRAINERS
    @GetMapping
    public ResponseEntity<List<TrainerResponse>> getAllTrainers() {

        return ResponseEntity.ok(
                trainerService.getAllTrainers()
        );
    }

    // GET TRAINER BY ID
    @GetMapping("/{id}")
    public ResponseEntity<TrainerResponse> getTrainerById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                trainerService.getTrainerById(id)
        );
    }

    // UPDATE TRAINER
    @PutMapping("/{id}")
    public ResponseEntity<TrainerResponse> updateTrainer(
            @PathVariable Long id,
            @Valid @RequestBody TrainerRequest request
    ) {

        return ResponseEntity.ok(
                trainerService.updateTrainer(id, request)
        );
    }

    // DELETE TRAINER
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrainer(
            @PathVariable Long id
    ) {

        trainerService.deleteTrainer(id);

        return ResponseEntity.noContent().build();
    }
}