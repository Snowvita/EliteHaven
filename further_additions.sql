
CREATE TABLE amenities (
    amenity_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    amenity_name VARCHAR(100) NOT NULL,
    description VARCHAR(255)
);
CREATE TABLE room_amenities (
    room_id BIGINT NOT NULL,
    amenity_id BIGINT NOT NULL,
    PRIMARY KEY (room_id, amenity_id),
    FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE,
    FOREIGN KEY (amenity_id) REFERENCES amenities(amenity_id) ON DELETE CASCADE
);
CREATE TABLE discounts (
    discount_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255),
    percentage DECIMAL(5,2) CHECK (percentage BETWEEN 0 AND 100),
    valid_from DATE NOT NULL,
    valid_to DATE NOT NULL
);
CREATE TABLE booking_discounts (
    booking_id BIGINT NOT NULL,
    discount_id BIGINT NOT NULL,
    PRIMARY KEY (booking_id, discount_id),
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
    FOREIGN KEY (discount_id) REFERENCES discounts(discount_id) ON DELETE CASCADE
);
