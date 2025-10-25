package com.hms.elite_haven.dao.entity;

import java.sql.Timestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "staff")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StaffEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "staff_id")
    private Long staffId;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @ManyToOne
    @JoinColumn(name = "hotel_id")
    private HotelEntity hotel;

    @NotBlank
    @Size(max = 100)
    @Column(name = "full_name")
    private String fullName;

    @NotBlank
    @Size(max = 50)
    @Column(name = "role")
    private String role;

    @Column(name = "contact_number", nullable = false, unique = true)
    @NotNull(message = "Phone number is required")
    @Min(value = 1000000000L, message = "Phone number must be at least 6000000000")
    @Max(value = 9999999999L, message = "Phone number must be at most 9999999999")
    private Long contactNumber;

    @Email
    @Size(max = 100)
    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "hired_date")
    private Timestamp hiredDate = new Timestamp(System.currentTimeMillis());

    @Column(name = "is_deleted")
    private Integer isDeleted = 0;

}
