package com.example.fitnessbooking.repository;

import com.example.fitnessbooking.entity.ClassBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ClassBookingRepository extends JpaRepository<ClassBooking, Long> {

    List<ClassBooking> findByMemberId(Long memberId);

    List<ClassBooking> findByFitnessClassId(Long classId);

    boolean existsByMemberIdAndFitnessClassId(
            Long memberId,
            Long fitnessClassId
    );

    Optional<ClassBooking> findByMemberIdAndFitnessClassId(
            Long memberId,
            Long fitnessClassId
    );

    @Modifying
    @Query(value = "CALL book_class(:memberId, :classId)", nativeQuery = true)
    void bookClass(
            @Param("memberId") Long memberId,
            @Param("classId") Long classId
    );
}