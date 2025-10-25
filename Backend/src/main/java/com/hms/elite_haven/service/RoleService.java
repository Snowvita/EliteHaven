package com.hms.elite_haven.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hms.elite_haven.dao.RoleDao;
import com.hms.elite_haven.dao.entity.RoleEntity;

@Service
public class RoleService {

    @Autowired
    private RoleDao roleDao;

    // Create new role
    public RoleEntity createRole(RoleEntity role) {
        Optional<RoleEntity> existingRole = roleDao.findByRoleName(role.getRoleName());
        if (existingRole.isPresent()) {
            throw new RuntimeException("Role already exists: " + role.getRoleName());
        }
        return roleDao.save(role);
    }

    // Get all roles
    public List<RoleEntity> getAllRoles() {
        return roleDao.findAll();
    }

    // Get role by ID
    public RoleEntity getRoleById(Long id) {
        return roleDao.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found with ID: " + id));
    }

    // Get role by name
    public RoleEntity getRoleByName(String roleName) {
        return roleDao.findByRoleName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
    }

    // Update role name
    public RoleEntity updateRole(RoleEntity roleDetails) {
        return roleDao.save(roleDetails);
    }

    // Delete role
    public void deleteRole(Long id) {
        RoleEntity role = getRoleById(id);
        roleDao.delete(role);
    }
}
