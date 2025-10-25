package com.hms.elite_haven.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hms.elite_haven.dao.StaffDao;
import com.hms.elite_haven.dao.UserDao;

@Service
public class AddStaffService {

    @Autowired
    private StaffDao staffDao;
    private UserDao userDao;
}
