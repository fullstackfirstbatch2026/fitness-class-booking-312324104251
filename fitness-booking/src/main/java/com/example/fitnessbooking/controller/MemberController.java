package com.example.fitnessbooking.controller;

import com.example.fitnessbooking.dto.member.MemberRequest;
import com.example.fitnessbooking.dto.member.MemberResponse;
import com.example.fitnessbooking.service.MemberService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
public class MemberController {

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    // CREATE MEMBER
    @PostMapping
    public ResponseEntity<MemberResponse> createMember(
            @Valid @RequestBody MemberRequest request
    ) {

        MemberResponse response =
                memberService.createMember(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // GET ALL MEMBERS
    @GetMapping
    public ResponseEntity<List<MemberResponse>> getAllMembers() {

        return ResponseEntity.ok(
                memberService.getAllMembers()
        );
    }

    // GET MEMBER BY ID
    @GetMapping("/{id}")
    public ResponseEntity<MemberResponse> getMemberById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                memberService.getMemberById(id)
        );
    }

    // UPDATE MEMBER
    @PutMapping("/{id}")
    public ResponseEntity<MemberResponse> updateMember(
            @PathVariable Long id,
            @Valid @RequestBody MemberRequest request
    ) {

        return ResponseEntity.ok(
                memberService.updateMember(id, request)
        );
    }

    // DELETE MEMBER
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMember(
            @PathVariable Long id
    ) {

        memberService.deleteMember(id);

        return ResponseEntity.noContent().build();
    }
}