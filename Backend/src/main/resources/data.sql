-- Elite Haven Database Initialization Script
--change another
-- Add unique constraint to prevent duplicate role assignments
-- 1️⃣ Roles
INSERT IGNORE INTO roles (role_id, role_name) VALUES
(1,'CUSTOMER'),
(2,'STAFF'),
(3,'ADMIN');

-- 2️⃣ Users
INSERT IGNORE INTO users (user_id, full_name, email, password, phone, is_deleted) VALUES
(1,'Alice','admin@elitehaven.com','$2y$10$b6MPkEALn0qOnCSlRSA74.QILY8C3X0KFTqS.o.Au3kx8xxvh8hCW',9999999999,0),
(2,'Bob','bob.staff@elitehaven.com','$2y$10$PrafioRQ21LC6AxsiWk1p.QuU7DyjqmVCo10TKcnsD1NBRMk.eONa',8888888888,0),
(3,'Carol','carol.staff@elitehaven.com','$2y$10$PrafioRQ21LC6AxsiWk1p.QuU7DyjqmVCo10TKcnsD1NBRMk.eONa',7777777777,0),
(4,'Dave','dave.staff@elitehaven.com','$2y$10$PrafioRQ21LC6AxsiWk1p.QuU7DyjqmVCo10TKcnsD1NBRMk.eONa',6666666666,0),
(5,'Eve','eve.staff@elitehaven.com','$2y$10$PrafioRQ21LC6AxsiWk1p.QuU7DyjqmVCo10TKcnsD1NBRMk.eONa',5555555555,0),
(6,'Frank','frank.staff@elitehaven.com','$2y$10$PrafioRQ21LC6AxsiWk1p.QuU7DyjqmVCo10TKcnsD1NBRMk.eONa',4444444444,0),
(7,'Grace','grace@mail.com','$2y$10$vkw2vyCYdfN31lRT7V0Bs.dXkE442NZ9U1gP/uVj6cdxvOvsZBMKu',3333333333,0),
(8,'Hannah','hannah@mail.com','$2y$10$vkw2vyCYdfN31lRT7V0Bs.dXkE442NZ9U1gP/uVj6cdxvOvsZBMKu',2222222222,0),
(9,'Ian','ian@mail.com','$2y$10$vkw2vyCYdfN31lRT7V0Bs.dXkE442NZ9U1gP/uVj6cdxvOvsZBMKu',1111111111,0),
(10,'Jack','jack@mail.com','$2y$10$vkw2vyCYdfN31lRT7V0Bs.dXkE442NZ9U1gP/uVj6cdxvOvsZBMKu',1231231234,0),
(11,'Kara','kara@mail.com','$2y$10$vkw2vyCYdfN31lRT7V0Bs.dXkE442NZ9U1gP/uVj6cdxvOvsZBMKu',2342342345,0),
(12,'Leo','leo@mail.com','$2y$10$vkw2vyCYdfN31lRT7V0Bs.dXkE442NZ9U1gP/uVj6cdxvOvsZBMKu',3453453456,0),
(13,'Mona','mona@mail.com','$2y$10$vkw2vyCYdfN31lRT7V0Bs.dXkE442NZ9U1gP/uVj6cdxvOvsZBMKu',4564564567,0),
(14,'Nina','nina@mail.com','$2y$10$vkw2vyCYdfN31lRT7V0Bs.dXkE442NZ9U1gP/uVj6cdxvOvsZBMKu',5675675678,0),
(15,'Owen','owen@mail.com','$2y$10$vkw2vyCYdfN31lRT7V0Bs.dXkE442NZ9U1gP/uVj6cdxvOvsZBMKu',6786786789,0),
(16,'Paula','paula@mail.com','$2y$10$vkw2vyCYdfN31lRT7V0Bs.dXkE442NZ9U1gP/uVj6cdxvOvsZBMKu',7897897890,0),
(17,'Quinn','quinn@mail.com','$2y$10$vkw2vyCYdfN31lRT7V0Bs.dXkE442NZ9U1gP/uVj6cdxvOvsZBMKu',8908908901,0),
(18,'Rita','rita@mail.com','$2y$10$vkw2vyCYdfN31lRT7V0Bs.dXkE442NZ9U1gP/uVj6cdxvOvsZBMKu',9019019012,0),
(19,'Steve','steve@mail.com','$2y$10$vkw2vyCYdfN31lRT7V0Bs.dXkE442NZ9U1gP/uVj6cdxvOvsZBMKu',1120120123,0),
(20,'Tina','tina@mail.com','$2y$10$vkw2vyCYdfN31lRT7V0Bs.dXkE442NZ9U1gP/uVj6cdxvOvsZBMKu',1010101010,0),
(21,'Uma','uma@mail.com','$2y$10$vkw2vyCYdfN31lRT7V0Bs.dXkE442NZ9U1gP/uVj6cdxvOvsZBMKu',1111111122,0);

-- 3️⃣ User Roles
INSERT IGNORE INTO user_roles (user_id, role_id) VALUES
(1,3),
(2,2),(3,2),(4,2),(5,2),(6,2),
(7,1),(8,1),(9,1),(10,1),(11,1),(12,1),(13,1),(14,1),(15,1),
(16,1),(17,1),(18,1),(19,1),(20,1),(21,1);

-- 4️⃣ Hotels
INSERT IGNORE INTO hotels (hotel_id, hotel_name, location, contact_number, description,photo_url, is_deleted) VALUES
(1,'Elite Grand','New York','1234567890','Luxury hotel in NY','https://plus.unsplash.com/premium_photo-1661963123153-5471a95b7042?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8THV4dXJ5JTIwaG90ZWwlMjBpbiUyME5ZfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=800',0),
(2,'Ocean View','Miami','2345678901','Beachside resort','https://media.istockphoto.com/id/1298306226/photo/young-woman-riding-bicycle-on-wooden-pier-in-the-maldives.webp?a=1&b=1&s=612x612&w=0&k=20&c=0zXKNXaNYmSxQATuT3hPrZaabkuskSxKcsCuwhic2YA=',0),
(3,'Mountain Inn','Denver','3456789012','Cozy mountain stay','https://images.unsplash.com/photo-1739907549777-6ff7cd3921fb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fENvenklMjBtb3VudGFpbiUyMHN0YXklMjBob3RlbCUyMGluJTIwRGVudmVyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=800',0),
(4,'City Lights','Chicago','4567890123','Downtown hotel with city view','https://media.istockphoto.com/id/1300068435/photo/chicago-river-tourboat-cruise-downtown-chicago-skyscrapers.webp?a=1&b=1&s=612x612&w=0&k=20&c=-1GEIH98HlVuzkuA0PE5EgvRWkJGpvI6ktkqvhs08NQ=',0),
(5,'Royal Palace','Los Angeles','5678901234','Premium suite experience','https://images.unsplash.com/photo-1733761002935-244f889465b9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bHV4dXJ5JTIwc3RheSUyMHJveWFsJTIwaG90ZWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=800',0);

-- 5️⃣ Staff
INSERT IGNORE INTO staff (staff_id, user_id, hotel_id, full_name, role, contact_number, email, hired_date, is_deleted) VALUES
(1,2,1,'Bob','Receptionist',8888888888,'bob.staff@elitehaven.com','2025-01-01 09:00:00',0),
(2,3,2,'Carol','Manager',7777777777,'carol.staff@elitehaven.com','2025-01-02 09:00:00',0),
(3,4,3,'Dave','Housekeeping',6666666666,'dave.staff@elitehaven.com','2025-01-03 09:00:00',0),
(4,5,4,'Eve','Receptionist',5555555555,'eve.staff@elitehaven.com','2025-01-04 09:00:00',0),
(5,6,5,'Frank','Receptionist',4444444444,'frank.staff@elitehaven.com','2025-01-05 09:00:00',0);

-- 6️⃣ Rooms
INSERT IGNORE INTO rooms (room_id, hotel_id, room_number, type, price_per_night, is_deleted) VALUES
(1,1,'101','SINGLE',1000.0,0),
(2,1,'102','DOUBLE',1500.0,0),
(3,1,'103','SUITE',2500.0,0),
(4,2,'201','SINGLE',1200.0,0),
(5,2,'202','DOUBLE',1800.0,0),
(6,2,'203','SUITE',3000.0,0),
(7,3,'301','SINGLE',1100.0,0),
(8,3,'302','DOUBLE',1600.0,0),
(9,3,'303','SUITE',2800.0,0),
(10,4,'401','SINGLE',1300.0,0),
(11,4,'402','DOUBLE',1900.0,0),
(12,4,'403','SUITE',3100.0,0),
(13,5,'501','SINGLE',1400.0,0),
(14,5,'502','DOUBLE',2000.0,0),
(15,5,'503','SUITE',3500.0,0);

-- 7️⃣ Room Services
INSERT IGNORE INTO room_services (service_id, service_name) VALUES
(1,'Breakfast'),
(2,'Laundry'),
(3,'Spa'),
(4,'Gym'),
(5,'Airport Pickup');

-- 8️⃣ Bookings
INSERT IGNORE INTO bookings (booking_id, user_id, room_id, booked_by_staff_id, check_in_date, check_out_date, number_of_guests, total_price, status, created_at) VALUES
(1, 7, 1, 1, '2025-11-01', '2025-11-05', 2, 2000.00, 'CONFIRMED', '2025-10-26 10:00:00'),
(2, 8, 2, 1, '2025-11-02', '2025-11-06', 1, 1500.00, 'CONFIRMED', '2025-10-26 10:05:00'),
(3, 9, 3, 2, '2025-11-03', '2025-11-07', 2, 2400.00, 'CANCELLED', '2025-10-26 10:10:00'),
(4, 10, 4, 3, '2025-11-04', '2025-11-08', 4, 3200.00, 'CONFIRMED', '2025-10-26 10:15:00'),
(5, 11, 5, 3, '2025-11-05', '2025-11-09', 1, 1600.00, 'CANCELLED', '2025-10-26 10:20:00'),
(6, 12, 6, 4, '2025-11-06', '2025-11-10', 2, 2000.00, 'CONFIRMED', '2025-10-26 10:25:00'),
(7, 13, 7, 4, '2025-11-07', '2025-11-11', 2, 2000.00, 'CONFIRMED', '2025-10-26 10:30:00'),
(8, 14, 8, 5, '2025-11-08', '2025-11-12', 1, 1600.00, 'CANCELLED', '2025-10-26 10:35:00'),
(9, 15, 9, 5, '2025-11-09', '2025-11-13', 2, 2000.00, 'CONFIRMED', '2025-10-26 10:40:00'),
(10, 16, 10, 1, '2025-11-10', '2025-11-14', 1, 2000.00, 'CONFIRMED', '2025-10-26 10:45:00');

-- 9️⃣ Booking Services
INSERT IGNORE INTO booking_services (booking_id, service_id) VALUES
(1,1),(1,2),
(2,1),(2,5),
(3,3),
(4,2),(4,4),
(5,1),(5,3),
(6,4),
(7,2),(7,5),
(8,1),(8,3),
(9,1),(9,2),(9,5),
(10,4);

-- 10️⃣ Payments
INSERT IGNORE INTO payments (payment_id, booking_id, amount, payment_method, payment_status, payment_date, transaction_id, is_refunded, refund_amount, refund_date, is_deleted) VALUES
(1, 1, 400.0, 'CREDIT_CARD', 'SUCCESS', '2025-10-25 11:00:00', 'TXN001', FALSE, 0.0, NULL, 0),
(2, 2, 450.0, 'UPI', 'PENDING', '2025-10-25 11:05:00', 'TXN002', FALSE, 0.0, NULL, 0),
(3, 3, 500.0, 'CASH', 'FAILED', '2025-10-25 11:10:00', 'TXN003', FALSE, 0.0, NULL, 0),
(4, 4, 600.0, 'CREDIT_CARD', 'SUCCESS', '2025-10-25 11:15:00', 'TXN004', FALSE, 0.0, NULL, 0),
(5, 5, 700.0, 'UPI', 'SUCCESS', '2025-10-25 11:20:00', 'TXN005', FALSE, 0.0, NULL, 0),
(6, 6, 480.0, 'CASH', 'PENDING', '2025-10-25 11:25:00', 'TXN006', FALSE, 0.0, NULL, 0),
(7, 7, 530.0, 'CREDIT_CARD', 'SUCCESS', '2025-10-25 11:30:00', 'TXN007', FALSE, 0.0, NULL, 0),
(8, 8, 450.0, 'UPI', 'FAILED', '2025-10-25 11:35:00', 'TXN008', FALSE, 0.0, NULL, 0),
(9, 9, 600.0, 'CASH', 'SUCCESS', '2025-10-25 11:40:00', 'TXN009', FALSE, 0.0, NULL, 0),
(10, 10, 650.0, 'CREDIT_CARD', 'SUCCESS', '2025-10-25 11:45:00', 'TXN010', FALSE, 0.0, NULL, 0);


-- 11️⃣ Reviews
INSERT IGNORE INTO reviews (review_id, user_id, hotel_id, rating, comment, created_at) VALUES
(1,7,1,5,'Excellent stay!','2025-10-25 12:00:00'),
(2,8,1,4,'Good service','2025-10-25 12:05:00'),
(3,9,2,5,'Amazing beach view!','2025-10-25 12:10:00'),
(4,10,3,3,'Room was small','2025-10-25 12:15:00'),
(5,11,4,4,'Very convenient location','2025-10-25 12:20:00'),
(6,12,5,5,'Luxurious suites','2025-10-25 12:25:00'),
(7,13,2,4,'Good amenities','2025-10-25 12:30:00'),
(8,14,3,5,'Loved the mountain view','2025-10-25 12:35:00'),
(9,15,4,2,'Too noisy','2025-10-25 12:40:00'),
(10,16,5,5,'Perfect experience','2025-10-25 12:45:00');

-- 12️⃣ Room Photos
INSERT IGNORE INTO room_photos (photo_id, photo_url, room_id, is_primary) VALUES
(1,'https://images.unsplash.com/photo-1623936409487-e4596071e7c8?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=800',1,1),
(2,'https://images.unsplash.com/photo-1630999295881-e00725e1de45?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=800',2,1),
(3,'https://images.unsplash.com/photo-1737517302831-e7b8a8eaa97c?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=800',3,1),
(4,'https://plus.unsplash.com/premium_photo-1683649964208-d76100727c59?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=800',4,1),
(5,'https://images.unsplash.com/photo-1648383228240-6ed939727ad6?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=800',5,1),
(6,'https://plus.unsplash.com/premium_photo-1661875135365-16aab794632f?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=800',6,1),
(7,'https://plus.unsplash.com/premium_photo-1681822718579-314dd234fb6d?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=800',7,1),
(8,'https://media.istockphoto.com/id/153755872/photo/front-view-of-double-bed-in-bedroom.webp?a=1&b=1&s=612x612&w=0&k=20&c=LGcFDTHN_WdtdRdxGVx6lzxskk_5oc6SIn3LRq0JxWo=',8,1),
(9,'https://plus.unsplash.com/premium_photo-1661963239507-7bdf41a5e66b?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=800',9,1),
(10,'https://images.unsplash.com/photo-1698945298325-8902550a45dd?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=800',10,1),
(11,'https://media.istockphoto.com/id/2100499873/photo/vintage-style-hotel-room-with-vintage-furniture.webp?a=1&b=1&s=612x612&w=0&k=20&c=ybNjXVblOOjFdOnpIh_3Nfx6jOIdGD-gEPiMsqs_9eo=',11,1),
(12,'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=800',12,1),
(13,'https://images.unsplash.com/photo-1672122816795-49ff5cbc75e8?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=800',13,1),
(14,'https://media.istockphoto.com/id/160050713/photo/vintage-style-hotel-room-with-vintage-furniture.webp?a=1&b=1&s=612x612&w=0&k=20&c=2fLtg1OzJgJyZjB4mJOSQlIRXGq7muPrl4nUBsnnJXU=',14,1),
(15,'https://plus.unsplash.com/premium_photo-1661962688308-2b00b88b9765?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=800',15,1);

