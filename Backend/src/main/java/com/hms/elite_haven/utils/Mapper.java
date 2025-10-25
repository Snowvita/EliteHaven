package com.hms.elite_haven.utils;

import java.util.stream.Collectors;

import com.hms.elite_haven.dao.entity.UserEntity;
import com.hms.elite_haven.dto.UserDetailsDto;

public class Mapper {

    // Map UserEntity to UserDetailsDto
    public static UserDetailsDto toDto(UserEntity user) {
        UserDetailsDto dto = new UserDetailsDto();
        dto.setUserId(user.getUserId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());

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
}
