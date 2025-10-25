package com.hms.elite_haven.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hms.elite_haven.dao.entity.StaffEntity;
import com.hms.elite_haven.dto.StaffDto;
import com.hms.elite_haven.service.StaffService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1")
public class StaffController {

    @Autowired
    private StaffService staffService;

    // Create a new staff (Admin only)
    @PostMapping("/create_staff")
    public ResponseEntity<StaffEntity> createStaff(@RequestBody @Valid StaffDto staffDto) {
        StaffEntity createdStaff = staffService.createStaff(staffDto);
        return ResponseEntity.ok(createdStaff);
    }

    // Get all staff
    @GetMapping("/all_staffs")
    public ResponseEntity<List<StaffEntity>> getAllStaff() {
        List<StaffEntity> staffList = staffService.getAllStaff();
        return ResponseEntity.ok(staffList);
    }

    // Get staff by ID
    @GetMapping("/staff/{staffId}")
    public ResponseEntity<StaffEntity> getStaffById(@PathVariable Long staffId) {
        StaffEntity staff = staffService.getStaffById(staffId);
        return ResponseEntity.ok(staff);
    }

    // Update staff details
    @PutMapping("/update_staff/{staffId}")
    public ResponseEntity<StaffEntity> updateStaff(
            @PathVariable Long staffId,
            @RequestBody @Valid StaffDto staffDto) {
        StaffEntity updatedStaff = staffService.updateStaff(staffId, staffDto);
        return ResponseEntity.ok(updatedStaff);
    }

    // Soft delete staff
    @DeleteMapping("/delete_staff/{staffId}")
    public ResponseEntity<String> deleteStaff(@PathVariable Long staffId) {
        staffService.deleteStaff(staffId);
        return ResponseEntity.ok("Staff deleted successfully");
    }

    // Get staff by hotel
    @GetMapping("/hotel_staff/{hotelId}")
    public ResponseEntity<List<StaffEntity>> getStaffByHotel(@PathVariable Long hotelId) {
        List<StaffEntity> staffList = staffService.getStaffByHotel(hotelId);
        return ResponseEntity.ok(staffList);
    }
}
