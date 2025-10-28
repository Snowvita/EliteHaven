package com.hms.elite_haven.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hms.elite_haven.dao.entity.RoleEntity;
import com.hms.elite_haven.service.RoleService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1")
public class RoleController {

    @Autowired
    private RoleService roleService;

    // Create new role
    @PostMapping("/create_role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RoleEntity> createRole(@RequestBody @Valid RoleEntity role) {
        RoleEntity createdRole = roleService.createRole(role);
        return ResponseEntity.ok(createdRole);
    }

    // Get all roles
    @GetMapping("/roles")
    public ResponseEntity<List<RoleEntity>> getAllRoles() {
        List<RoleEntity> roles = roleService.getAllRoles();
        return ResponseEntity.ok(roles);
    }

    // Get role by ID
    @GetMapping("/role/{id}")
    public ResponseEntity<RoleEntity> getRoleById(@PathVariable Long id) {
        RoleEntity role = roleService.getRoleById(id);
        return ResponseEntity.ok(role);
    }

    // Get role by name
    @GetMapping("/role_name/{roleName}")
    public ResponseEntity<RoleEntity> getRoleByName(@PathVariable String roleName) {
        RoleEntity role = roleService.getRoleByName(roleName);
        return ResponseEntity.ok(role);
    }

    // Update role
    @PutMapping("/update_role")
    public ResponseEntity<RoleEntity> updateRole(@RequestBody @Valid RoleEntity roleDetails) {
        RoleEntity updatedRole = roleService.updateRole(roleDetails);
        return ResponseEntity.ok(updatedRole);
    }

    // Delete role
    @DeleteMapping("/delete_role/{id}")
    public ResponseEntity<String> deleteRole(@PathVariable Long id) {
        roleService.deleteRole(id);
        return ResponseEntity.ok("Role deleted successfully");
    }
}
