package com.flexoffice.flexoffice.service;

import com.flexoffice.flexoffice.entity.MeetingRoom;
import com.flexoffice.flexoffice.repository.MeetingRoomRepository;
import com.flexoffice.flexoffice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MeetingRoomService {
    private final MeetingRoomRepository meetingRoomRepository;

    public MeetingRoom createMeetingRoom(MeetingRoom meetingRoom) {
        return meetingRoomRepository.save(meetingRoom);
    }

    public List<MeetingRoom> getActiveMeetingRooms() {
        return meetingRoomRepository.findByIsActiveTrue();
    }
}
