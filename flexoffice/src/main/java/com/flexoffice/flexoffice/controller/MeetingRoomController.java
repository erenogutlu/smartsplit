package com.flexoffice.flexoffice.controller;

import com.flexoffice.flexoffice.entity.MeetingRoom;
import com.flexoffice.flexoffice.service.MeetingRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class MeetingRoomController {
    private final MeetingRoomService meetingRoomService;

    @PostMapping
    public ResponseEntity<MeetingRoom> createMeetingRoom(@RequestBody MeetingRoom meetingRoom) {
        MeetingRoom createdRoom = meetingRoomService.createMeetingRoom(meetingRoom);
        return ResponseEntity.ok(createdRoom);
    }

    @GetMapping("/active")
    public ResponseEntity<List<MeetingRoom>> getAllMeetingRooms() {
        return ResponseEntity.ok(meetingRoomService.getActiveMeetingRooms());
    }
}
