package com.hms.elite_haven.dao.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "room_services")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomServiceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "service_id")
    private Long serviceId;

    @NotBlank
    @Size(max = 100)
    @Column(name = "service_name")
    private String serviceName;

    @ManyToMany
    @JoinTable(
        name = "booking_services",
        joinColumns = @JoinColumn(name = "service_id"),
        inverseJoinColumns = @JoinColumn(name = "booking_id")
    )
    private List<BookingEntity> bookings;
}
