package com.hms.elite_haven.dao.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "hotels")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HotelEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hotel_id")
    private Long hotelId;

    @NotBlank
    @Size(max = 100)
    @Column(name = "hotel_name")
    private String hotelName;

    @NotBlank
    @Size(max = 100)
    @Column(name = "location")
    private String location;

    @Size(max = 20)
    @Column(name = "contact_number")
    private String contactNumber;

    @Size(max = 255)
    @Column(name = "description")
    private String description;

    @Size(max = 500)
    @Column(name = "photo_url")
    private String photoUrl;  // New field for hotel photo

    @Column(name = "is_deleted")
    private Integer isDeleted = 0;
}
