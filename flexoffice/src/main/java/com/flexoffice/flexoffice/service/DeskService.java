package com.flexoffice.flexoffice.service;

import com.flexoffice.flexoffice.entity.Desk;
import com.flexoffice.flexoffice.repository.DeskRepository;
import com.flexoffice.flexoffice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DeskService {
    private final DeskRepository deskRepository;

    public Desk createDesk(Desk desk) {
        return deskRepository.save(desk);
    }

    public List<Desk> getActiveDesks() {
        return deskRepository.findByIsActiveTrue();
    }

}
