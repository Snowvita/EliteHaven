# EliteHaven – Secure and Automated Hotel Management System

![Maven](https://img.shields.io/badge/Maven-3.9.6-blue)
![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen)
![Angular](https://img.shields.io/badge/Angular-17-red)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)
![Docker](https://img.shields.io/badge/Docker-Yes-blue)
![AWS](https://img.shields.io/badge/AWS-EC2-orange)

**Author:** Snowvita Boominathan

**Tech Stack:** Angular | Spring Boot | MySQL | Docker | Jenkins | Terraform | AWS EC2

---

## Project Overview

EliteHaven is a **full-stack hotel management system** designed to streamline hotel operations and bookings.  
It supports multiple user roles: **Customer, Staff, and Admin**.

**Key Features:**

**For Customers:**

- Register and login securely
- Search available hotels and rooms
- Book rooms online with mandatory advance payment
- View and manage bookings
- Cancel bookings before a certain time
- Submit reviews after staying

**For Staff:**

- Manage customer bookings
- Add/update/remove room details
- Handle walk-in customer bookings
- Assigned to specific hotels

**For Admin:**

- Manage users (customers and staff)
- Manage hotels and rooms
- Oversee all bookings and payments

**General Features:**

- Role-based access control
- Secure password hashing using BCrypt
- Multi-hotel support with location-based search
- Smooth delete (soft delete) using `is_deleted` flags
- Payment handling with status tracking
- Room services for additional facilities (food, laundry, etc.)

---

<!--
## Database Design

The system includes the following tables:

| Table Name       | Purpose                                      |
| ---------------- | -------------------------------------------- |
| users            | Stores all users (customer, staff, admin)    |
| roles            | Defines roles (ADMIN, STAFF, CUSTOMER)       |
| user_roles       | Many-to-many mapping between users and roles |
| hotels           | Hotel details (name, location, contact)      |
| rooms            | Room details (type, price, status)           |
| bookings         | Booking information (check-in/out, status)   |
| payments         | Payment tracking (amount, method, status)    |
| room_services    | Additional services offered                  |
| booking_services | Many-to-many mapping for booking + services  |
| reviews          | User reviews for rooms/hotels                |
| staff            | Staff details (added by admin)               |

--- -->
