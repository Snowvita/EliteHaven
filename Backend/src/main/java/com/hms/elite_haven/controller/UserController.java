package com.hms.elite_haven.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hms.elite_haven.dto.ChangePasswordDto;
import com.hms.elite_haven.dto.RegisterDto;
import com.hms.elite_haven.dto.UserDetailsDto;
import com.hms.elite_haven.service.UserService;

@RestController
@RequestMapping("/api/v1")
public class UserController {

    @Autowired
    private UserService userService;

    // Register (Public - Customer Registration)
    @PostMapping("/register_user")
    public ResponseEntity<UserDetailsDto> registerUser(@RequestBody RegisterDto dto) {
        UserDetailsDto registered = userService.registerUser(dto);
        return ResponseEntity.ok(registered);
    }

    // Get all users (Admin)
    @GetMapping("/all_users")
    public ResponseEntity<List<UserDetailsDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // Get all active users (Admin)
    @GetMapping("/active_users")
    public ResponseEntity<List<UserDetailsDto>> getAllActiveUsers() {
        return ResponseEntity.ok(userService.getAllActiveUsers());
    }

    // Get user by ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<UserDetailsDto> getUserById(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    // Get user by Email
    @GetMapping("/user/email")
    public ResponseEntity<UserDetailsDto> getUserByEmail(@RequestParam String email) {
        return ResponseEntity.ok(userService.getUserByEmail(email));
    }

    // Update user details
    @PutMapping("/update_user")
    public ResponseEntity<UserDetailsDto> updateUser(@RequestBody UserDetailsDto dto) {
        return ResponseEntity.ok(userService.updateUser(dto));
    }

    // Change password
    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordDto dto) {
        userService.changePassword(dto);
        return ResponseEntity.ok("Password changed successfully");
    }

    // Soft delete user (Admin)
    @DeleteMapping("/delete_user/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok("User deleted successfully");
    }
}
