package com.hms.elite_haven.controller;

import com.hms.elite_haven.service.JwtService;
import com.hms.elite_haven.service.UserDetailsImpl;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import com.hms.elite_haven.dto.LoginDto;
import com.hms.elite_haven.dto.UserDetailsDto;
import com.hms.elite_haven.service.UserService;

@RestController
@RequestMapping("api/v1/auth")
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody @Valid LoginDto loginDto) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword())
        );

        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();

        // Generate token
        String token = jwtService.generateToken(userDetails.getUsername());

        // Convert authorities to set of role names
        var roles = userDetails.getAuthorities().stream()
                .map(a -> a.getAuthority())
                .collect(Collectors.toSet());

        // Create UserDTO
        UserDetailsDto userDTO = userService.getUserByEmail(loginDto.getEmail());

        // Prepare response
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("userDetails", userDTO);

        return response;
    }
}
