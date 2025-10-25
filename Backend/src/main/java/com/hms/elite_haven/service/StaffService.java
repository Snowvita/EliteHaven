package com.hms.elite_haven.service;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
        user.setPhone(staffDto.getPhone());
        user.setRoles(List.of(staffRole)); // Assign STAFF role

        userDao.save(user);


        // 3. Create StaffEntity
        StaffEntity staff = new StaffEntity();
        staff.setUser(user);
        staff.setFullName(staffDto.getFullName());
        staff.setEmail(staffDto.getEmail());
        staff.setContactNumber(staffDto.getPhone());
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

        if (staffDto.getFullName() != null) existing.setFullName(staffDto.getFullName());
        if (staffDto.getEmail() != null) {
            existing.setEmail(staffDto.getEmail());
            existing.getUser().setEmail(staffDto.getEmail()); // update UserEntity email too
            userDao.save(existing.getUser());
        }
        if (staffDto.getPhone() != null) existing.setContactNumber(staffDto.getPhone());
        if (staffDto.getRole() != null) existing.setRole(staffDto.getRole());
        if (staffDto.getHiredDate() != null) existing.setHiredDate(staffDto.getHiredDate());

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
