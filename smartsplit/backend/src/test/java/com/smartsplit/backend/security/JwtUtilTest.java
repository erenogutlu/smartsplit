package com.smartsplit.backend.security;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class JwtUtilTest {
    @Test
    public void testGenerateToken() {
        JwtUtil jwtUtil = new JwtUtil();
        String testEmail = "senior@developer.com";

        String token = jwtUtil.generateToken(testEmail);

        assertNotNull(token, "Error: cannot be null");
        assertTrue(token.startsWith("eyJ"), "Error: The Token should start with a valid JWT form.");
        System.out.println("Token: " + token);
    }
}
