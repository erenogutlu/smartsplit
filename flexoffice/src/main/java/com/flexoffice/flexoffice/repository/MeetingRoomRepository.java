package com.flexoffice.flexoffice.repository;

import com.flexoffice.flexoffice.entity.MeetingRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MeetingRoomRepository extends JpaRepository<MeetingRoom, Long> {
    List<MeetingRoom> findByIsActiveTrue();
}
