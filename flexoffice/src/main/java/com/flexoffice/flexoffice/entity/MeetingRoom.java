package com.flexoffice.flexoffice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="meeting_rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class MeetingRoom {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    private String roomName;
    private int capacity;
    private Boolean hasProjector;
    private Boolean isActive;


}
