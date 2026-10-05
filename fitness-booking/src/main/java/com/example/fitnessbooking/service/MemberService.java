package com.example.fitnessbooking.service;

import com.example.fitnessbooking.dto.member.MemberRequest;
import com.example.fitnessbooking.dto.member.MemberResponse;
import com.example.fitnessbooking.entity.Member;
import com.example.fitnessbooking.exception.ResourceNotFoundException;
import com.example.fitnessbooking.repository.MemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class MemberService {

    private final MemberRepository memberRepository;

    // Constructor injection
    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    // CREATE MEMBER
    public MemberResponse createMember(MemberRequest request) {

        if (memberRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException(
                    "Email already registered"
            );
        }

        if (memberRepository.existsByPhone(request.phone())) {
            throw new IllegalArgumentException(
                    "Phone number already registered"
            );
        }

        Member member = new Member();

        member.setName(request.name());
        member.setEmail(request.email());
        member.setPhone(request.phone());
        member.setMembershipType(request.membershipType());
        member.setJoinDate(LocalDate.now());
        member.setStatus("ACTIVE");

        Member savedMember = memberRepository.save(member);

        return toResponse(savedMember);
    }

    // GET ALL MEMBERS
    @Transactional(readOnly = true)
    public List<MemberResponse> getAllMembers() {

        return memberRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // GET MEMBER BY ID
    @Transactional(readOnly = true)
    public MemberResponse getMemberById(Long id) {

        Member member = memberRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Member not found with id: " + id
                        )
                );

        return toResponse(member);
    }

    // UPDATE MEMBER
    public MemberResponse updateMember(
            Long id,
            MemberRequest request
    ) {

        Member member = memberRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Member not found with id: " + id
                        )
                );

        member.setName(request.name());
        member.setEmail(request.email());
        member.setPhone(request.phone());
        member.setMembershipType(request.membershipType());

        return toResponse(member);
    }

    // DELETE MEMBER
    public void deleteMember(Long id) {

        Member member = memberRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Member not found with id: " + id
                        )
                );

        memberRepository.delete(member);
    }

    // ENTITY -> RESPONSE DTO
    private MemberResponse toResponse(Member member) {

        return new MemberResponse(
                member.getId(),
                member.getName(),
                member.getEmail(),
                member.getPhone(),
                member.getMembershipType(),
                member.getJoinDate(),
                member.getStatus(),
                member.getCreatedAt(),
                member.getUpdatedAt()
        );
    }
}