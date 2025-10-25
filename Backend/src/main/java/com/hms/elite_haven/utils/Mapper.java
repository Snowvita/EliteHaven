package com.hms.elite_haven.utils;

import java.util.stream.Collectors;

import com.hms.elite_haven.dao.entity.StaffEntity;
import com.hms.elite_haven.dao.entity.UserEntity;
import com.hms.elite_haven.dto.StaffResponseDto;
import com.hms.elite_haven.dto.UserDetailsDto;

public class Mapper {

    // Map UserEntity to UserDetailsDto
    public static UserDetailsDto toDto(UserEntity user) {
        UserDetailsDto dto = new UserDetailsDto();
        dto.setUserId(user.getUserId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhone());

        if (user.getRoles() != null && !user.getRoles().isEmpty()) {
            // Concatenate multiple roles as comma-separated string
            dto.setRole(user.getRoles()
                            .stream()
                            .map(role -> role.getRoleName())
                            .collect(Collectors.joining(", ")));
        }

        return dto;
    }

    // Map DTO to UserEntity (optional, for registration/update)
    public static UserEntity toEntity(UserDetailsDto dto, UserEntity existingUser) {
        if (existingUser == null) existingUser = new UserEntity();
        existingUser.setFullName(dto.getFullName());
        existingUser.setEmail(dto.getEmail());
        // password, phone, roles need to be set separately
        return existingUser;
    }

        // Map UserEntity to UserDetailsDto
    public static StaffResponseDto toStaffResponseDto(StaffEntity staff) {
        StaffResponseDto dto = new StaffResponseDto();
        dto.setEmail(staff.getEmail());
        dto.setFullName(staff.getFullName());
        dto.setHiredDate(staff.getHiredDate());
        dto.setHotelEntity(staff.getHotel());
        dto.setPhone(staff.getContactNumber());
        dto.setRole(staff.getRole());
        dto.setUser(toDto(staff.getUser()));

        return dto;
    }


}
