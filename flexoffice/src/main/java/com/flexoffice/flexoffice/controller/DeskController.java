package com.flexoffice.flexoffice.controller;

import com.flexoffice.flexoffice.entity.Desk;
import com.flexoffice.flexoffice.service.DeskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/desks")
@RequiredArgsConstructor
public class DeskController {
    private final DeskService deskService;

    @PostMapping
    public ResponseEntity<Desk> createDesk(@RequestBody Desk desk) {
        Desk createdDesk = deskService.createDesk(desk);
        return ResponseEntity.ok(deskService.createDesk(desk));
    }

    @GetMapping("/active")
    public ResponseEntity<List<Desk>> getAllDesks() {
        return ResponseEntity.ok(deskService.getActiveDesks());
    }
}
