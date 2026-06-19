package com.flexoffice.flexoffice.controller;

import com.flexoffice.flexoffice.dto.UserDto;
import com.flexoffice.flexoffice.entity.User;
import com.flexoffice.flexoffice.mapper.UserMapper;
import com.flexoffice.flexoffice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final UserMapper userMapper;

    @PostMapping
    public ResponseEntity<UserDto> createUser(@RequestBody UserDto userDto) {
        User userToSave = userMapper.userDtoToUser(userDto);
        User savedUser = userService.createUser(userToSave);

        return ResponseEntity.ok(userMapper.userToUserDto(savedUser));
    }

    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> userDtos = userService.getAllUsers()
                .stream().map(userMapper::userToUserDto).collect(Collectors.toList());
        return ResponseEntity.ok(userDtos);
    }
}
