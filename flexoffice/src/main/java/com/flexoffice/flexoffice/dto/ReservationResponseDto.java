package com.flexoffice.flexoffice.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ReservationResponseDto {
    private Long id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private String userFullName;
    private String deskCode;
    private String meetingRoomName;
}
