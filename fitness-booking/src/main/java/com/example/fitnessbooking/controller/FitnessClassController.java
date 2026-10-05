package com.example.fitnessbooking.controller;

import com.example.fitnessbooking.dto.fitnessclass.FitnessClassRequest;
import com.example.fitnessbooking.dto.fitnessclass.FitnessClassResponse;
import com.example.fitnessbooking.service.FitnessClassService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
public class FitnessClassController {

    private final FitnessClassService fitnessClassService;

    public FitnessClassController(
            FitnessClassService fitnessClassService
    ) {
        this.fitnessClassService = fitnessClassService;
    }

    // CREATE CLASS
    @PostMapping
    public ResponseEntity<FitnessClassResponse> createClass(
            @Valid @RequestBody FitnessClassRequest request
    ) {

        FitnessClassResponse response =
                fitnessClassService.createClass(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // GET ALL CLASSES
    @GetMapping
    public ResponseEntity<List<FitnessClassResponse>> getAllClasses(
            @RequestParam(required = false) String status
    ) {

        if (status != null && !status.isBlank()) {
            return ResponseEntity.ok(
                    fitnessClassService.getClassesByStatus(status)
            );
        }

        return ResponseEntity.ok(
                fitnessClassService.getAllClasses()
        );
    }

    // GET CLASS BY ID
    @GetMapping("/{id}")
    public ResponseEntity<FitnessClassResponse> getClassById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                fitnessClassService.getClassById(id)
        );
    }

    // UPDATE CLASS
    @PutMapping("/{id}")
    public ResponseEntity<FitnessClassResponse> updateClass(
            @PathVariable Long id,
            @Valid @RequestBody FitnessClassRequest request
    ) {

        return ResponseEntity.ok(
                fitnessClassService.updateClass(id, request)
        );
    }

    // DELETE CLASS
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClass(
            @PathVariable Long id
    ) {

        fitnessClassService.deleteClass(id);

        return ResponseEntity.noContent().build();
    }
}