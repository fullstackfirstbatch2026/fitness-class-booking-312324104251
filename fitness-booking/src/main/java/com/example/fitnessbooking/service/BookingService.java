package com.example.fitnessbooking.service;

import com.example.fitnessbooking.dto.booking.BookingRequest;
import com.example.fitnessbooking.dto.booking.BookingResponse;
import com.example.fitnessbooking.entity.ClassBooking;
import com.example.fitnessbooking.exception.ResourceNotFoundException;
import com.example.fitnessbooking.repository.ClassBookingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookingService {

    private final ClassBookingRepository bookingRepository;

    public BookingService(ClassBookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    @Transactional
    public BookingResponse createBooking(BookingRequest request) {

        bookingRepository.bookClass(
                request.memberId(),
                request.classId()
        );

        ClassBooking booking = bookingRepository
                .findByMemberIdAndFitnessClassId(
                        request.memberId(),
                        request.classId()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Booking was not created"
                        )
                );

        return mapToResponse(booking);
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public BookingResponse getBookingById(Long id) {

        ClassBooking booking = bookingRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Booking not found with id: " + id
                        )
                );

        return mapToResponse(booking);
    }

    @Transactional
    public BookingResponse cancelBooking(Long id) {

        ClassBooking booking = bookingRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Booking not found with id: " + id
                        )
                );

        booking.setStatus("CANCELLED");

        return mapToResponse(bookingRepository.save(booking));
    }

    private BookingResponse mapToResponse(ClassBooking booking) {

        return new BookingResponse(
                booking.getId(),
                booking.getMember().getId(),
                booking.getFitnessClass().getId(),
                booking.getStatus(),
                booking.getBookingDate()
        );
    }
}