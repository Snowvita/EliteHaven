package com.hms.elite_haven.utils;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import lombok.experimental.UtilityClass;

@UtilityClass
public class BcryptUtil {

    private static final PasswordEncoder BCrypt = new BCryptPasswordEncoder(10);

    public String hashPassword(String plainPassword) {
        return BCrypt.encode(plainPassword);
    }

    public boolean verifyPassword(String plainPassword, String hashedPassword) {
        return BCrypt.matches(plainPassword, hashedPassword);
    }
}
