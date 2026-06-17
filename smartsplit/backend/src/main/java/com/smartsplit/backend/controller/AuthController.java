package com.smartsplit.backend.controller;

import com.smartsplit.backend.entity.User;
import com.smartsplit.backend.repository.UserRepository;
import com.smartsplit.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth") // For Everybody
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // 1. (Register)
    @PostMapping("/register")
    public String register(@RequestBody User user) {
        // Encoding the password ("1234") to ("$2a$10$...")
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return "User registered successfully!";
    }

    // 2. (Login)
    @PostMapping("/login")
    public Map<String, String> login(@RequestBody User loginRequest) {
        // Search for user with the help of the email
        Optional<User> dbUser = userRepository.findByEmail(loginRequest.getEmail());

        // Is the User existing? Is the password matching?
        if (dbUser.isPresent() && passwordEncoder.matches(loginRequest.getPassword(), dbUser.get().getPassword())) {

            // if successfully go to jwtUtil and generate a Token
            String token = jwtUtil.generateToken(dbUser.get().getEmail());

            // Sen Token, UserId and Name to Frontend
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("userId", dbUser.get().getId().toString());
            response.put("name", dbUser.get().getName());
            return response;

        } else {
            throw new RuntimeException("Invalid email or password!");
        }
    }
}