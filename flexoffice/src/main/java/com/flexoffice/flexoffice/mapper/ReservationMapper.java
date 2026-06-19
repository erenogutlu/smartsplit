package com.flexoffice.flexoffice.mapper;

import com.flexoffice.flexoffice.dto.ReservationResponseDto;
import com.flexoffice.flexoffice.entity.Reservation;
import org.springframework.stereotype.Component;

@Component
public class ReservationMapper {
    public ReservationResponseDto reservationToReservationDto(Reservation reservation) {
        if (reservation == null) {
            return null;
        }
        ReservationResponseDto reservationDto = new ReservationResponseDto();
        reservationDto.setId(reservation.getId());
        reservationDto.setStartTime(reservation.getStartTime());
        reservationDto.setEndTime(reservation.getEndTime());

        if(reservation.getReservedUser() != null) {
            reservationDto.setUserFullName(reservation.getReservedUser().getFirstName() + " " + reservation.getReservedUser().getLastName());
        }

        if(reservation.getReservedDesk() != null) {
            reservationDto.setDeskCode(reservation.getReservedDesk().getDeskCode());
        }
        if(reservation.getReservedMeetingRoom() != null) {
            reservationDto.setMeetingRoomName(reservation.getReservedMeetingRoom().getRoomName());
        }
        return reservationDto;
    }
}
