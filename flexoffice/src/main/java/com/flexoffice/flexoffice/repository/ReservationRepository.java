package com.flexoffice.flexoffice.repository;

import com.flexoffice.flexoffice.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    // Overlap logic for Desks
    @Query("SELECT COUNT(r) > 0 FROM Reservation r WHERE r.reservedDesk.id = :deskId AND r.startTime < :endTime AND r.endTime > :startTime")
    boolean isDeskOverlapping(@Param("deskId") Long deskId, @Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

    // Overlap logic for Meeting Rooms
    @Query("SELECT COUNT(r) > 0 FROM Reservation r WHERE r.reservedMeetingRoom.id = :roomId AND r.startTime < :endTime AND r.endTime > :startTime")
    boolean isRoomOverlapping(@Param("roomId") Long roomId, @Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);
}
