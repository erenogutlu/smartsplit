package com.flexoffice.flexoffice.service;

import com.flexoffice.flexoffice.entity.MeetingRoom;
import com.flexoffice.flexoffice.entity.Reservation;
import com.flexoffice.flexoffice.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {
    private final ReservationRepository reservationRepository;

    public Reservation createDeskReservation(Reservation reservation) {
        boolean isOverlap = reservationRepository.isDeskOverlapping(
                reservation.getReservedDesk().getId(),
                reservation.getStartTime(),
                reservation.getEndTime()
        );

        if (isOverlap) {
            throw new RuntimeException("The Desk is already reserved");
        }
        return reservationRepository.save(reservation);
    }

    public Reservation createMeetingRoomReservation(Reservation reservation) {
        boolean isOverLap = reservationRepository.isRoomOverlapping(
                reservation.getReservedMeetingRoom().getId(),
                reservation.getStartTime(),
                reservation.getEndTime()
        );

        if (isOverLap) {
            throw new RuntimeException("The Meeting Room is already reserved");
        }
        return reservationRepository.save(reservation);
    }

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }
}
