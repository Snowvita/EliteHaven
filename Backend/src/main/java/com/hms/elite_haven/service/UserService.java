package com.hms.elite_haven.service;

import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.hms.elite_haven.dao.UserDao;
import com.hms.elite_haven.dao.entity.RoleEntity;
import com.hms.elite_haven.dao.entity.UserEntity;
import com.hms.elite_haven.dto.ChangePasswordDto;
import com.hms.elite_haven.dto.RegisterDto;
import com.hms.elite_haven.dto.UserDetailsDto;
import com.hms.elite_haven.utils.Mapper;

@Service
public class UserService {

    @Autowired
    private UserDao userDao;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Register a new user
    public UserDetailsDto registerUser(RegisterDto dto, List<RoleEntity> roles) {
        UserEntity user = new UserEntity();
        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setPhone(dto.getPhone());
        user.setRoles(roles);
        user.setIsDeleted(0);
        userDao.save(user);

        return Mapper.toDto(user);
    }

    // Get all users
    public List<UserDetailsDto> getAllUsers() {
        return userDao.findAll().stream()
                .map(Mapper::toDto)
                .collect(Collectors.toList());
    }

    // Get all Active users
    public List<UserDetailsDto> getAllActiveUsers() {
        return userDao.findAll().stream()
                .filter(user -> user.getIsDeleted() == 0)
                .map(Mapper::toDto)
                .collect(Collectors.toList());
    }

    // Get user by ID
    public UserDetailsDto getUserById(Long userId) {
        UserEntity user = userDao.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        if (user.getIsDeleted() == 1) throw new RuntimeException("User is deleted");
        return Mapper.toDto(user);
    }

    public UserDetailsDto getUserByEmail(String email) {
        UserEntity user = userDao.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with Email: " + email));
        if (user.getIsDeleted() == 1) throw new RuntimeException("User is deleted");
        return Mapper.toDto(user);
    }

    // Update user details
    public UserDetailsDto updateUser(UserDetailsDto dto) {
        UserEntity user = userDao.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + dto.getUserId()));
        if (user.getIsDeleted() == 1) throw new RuntimeException("Cannot update deleted user");

        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        // Roles and password should be updated separately if needed
        userDao.save(user);

        return Mapper.toDto(user);
    }

    // Change user password
    public void changePassword(Long userId, ChangePasswordDto dto) {
        UserEntity user = userDao.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        if (user.getIsDeleted() == 1) throw new RuntimeException("User is deleted");

        // Verify old password
        if (!passwordEncoder.matches(dto.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        // Verify new password matches confirm
        if (!dto.getNewPassword().equals(dto.getConfirmNewPassword())) {
            throw new RuntimeException("New password and confirmation do not match");
        }

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userDao.save(user);
    }

    // Soft delete user
    public void deleteUser(Long userId) {
        UserEntity user = userDao.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        user.setIsDeleted(1);
        userDao.save(user);
    }
}
