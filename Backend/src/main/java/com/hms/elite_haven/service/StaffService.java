package com.hms.elite_haven.service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.hms.elite_haven.dao.HotelDao;
import com.hms.elite_haven.dao.RoleDao;
import com.hms.elite_haven.dao.StaffDao;
import com.hms.elite_haven.dao.UserDao;
import com.hms.elite_haven.dao.entity.RoleEntity;
import com.hms.elite_haven.dao.entity.StaffEntity;
import com.hms.elite_haven.dao.entity.UserEntity;
import com.hms.elite_haven.dto.StaffDto;

@Service
public class StaffService {

    @Autowired
    private StaffDao staffDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private RoleDao roleDao;

    @Autowired
    private HotelDao hotelDao;

    @Autowired
    private PasswordEncoder passwordEncoder; // Spring Security password encoder

    // Create a new staff (Admin only)
    public StaffEntity createStaff(StaffDto staffDto) {
        // 1. Fetch STAFF role from Role table
        RoleEntity staffRole = roleDao.findByRoleName("STAFF")
                .orElseThrow(() -> new RuntimeException("STAFF role not found"));

        // 2. Create UserEntity
        UserEntity user = new UserEntity();
        user.setFullName(staffDto.getFullName());
        user.setEmail(staffDto.getEmail());
        user.setPassword(passwordEncoder.encode(staffDto.getPassword()));
        user.setPhoneNumber(staffDto.getPhone());
        user.setRoles(Set.of(staffRole)); // Assign STAFF role

        userDao.save(user);


        // 3. Create StaffEntity
        StaffEntity staff = new StaffEntity();
        staff.setUser(user);
        staff.setFullName(staffDto.getFullName());
        staff.setEmail(staffDto.getEmail());
        staff.setContactNumber(staffDto.getPhone());
        staff.setHotel(hotelDao.findById(staffDto.getHotelId())
                .orElseThrow(() -> new RuntimeException("Hotel not found with ID: " + staffDto.getHotelId())));
        staff.setRole(staffDto.getRole());
        staff.setHiredDate(staffDto.getHiredDate() != null ? staffDto.getHiredDate() : new Timestamp(System.currentTimeMillis()));
        
        return staffDao.save(staff);
    }

    // Get all staff
    public List<StaffEntity> getAllStaff() {
        return staffDao.findAll();
    }

    // Get staff by ID
    public StaffEntity getStaffById(Long staffId) {
        return staffDao.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found with ID: " + staffId));
    }

// Update staff details
    public StaffEntity updateStaff(Long staffId, StaffDto staffDto) {
        StaffEntity existing = getStaffById(staffId);

        if (staffDto.getFullName() != null) {
            existing.setFullName(staffDto.getFullName());
            existing.getUser().setFullName(staffDto.getFullName()); // Update user too
        }
        
        if (staffDto.getEmail() != null) {
            existing.setEmail(staffDto.getEmail());
            existing.getUser().setEmail(staffDto.getEmail());
        }
        
        if (staffDto.getPhone() != null) {
            existing.setContactNumber(staffDto.getPhone());      // Updates staff table
            existing.getUser().setPhoneNumber(staffDto.getPhone());    // ADD THIS - Updates user table
        }
        
        if (staffDto.getRole() != null) {
            existing.setRole(staffDto.getRole());
        }
        
        if (staffDto.getHiredDate() != null) {
            existing.setHiredDate(staffDto.getHiredDate());
        }
        
        // Update hotel if provided
        if (staffDto.getHotelId() != null && staffDto.getHotelId() > 0) {
            existing.setHotel(hotelDao.findById(staffDto.getHotelId())
                    .orElseThrow(() -> new RuntimeException("Hotel not found with ID: " + staffDto.getHotelId())));
        }
        
        // Only update password if provided and not empty
        if (staffDto.getPassword() != null && !staffDto.getPassword().trim().isEmpty()) {
            existing.getUser().setPassword(passwordEncoder.encode(staffDto.getPassword()));
        }

        // Save user first
        userDao.save(existing.getUser());
        
        // Then save staff
        return staffDao.save(existing);
    }

    // Soft delete staff
    public StaffEntity deleteStaff(Long staffId) {
        StaffEntity staff = getStaffById(staffId);

        // Mark staff as deleted
        staff.setIsDeleted(1);

        // Also mark associated user as deleted
        if (staff.getUser() != null) {
            staff.getUser().setIsDeleted(1);
        }

        return staffDao.save(staff);
    }


    // Get staff by hotel
    public List<StaffEntity> getStaffByHotel(Long hotelId) {
        return staffDao.findByHotel_HotelId(hotelId);
    }
}
