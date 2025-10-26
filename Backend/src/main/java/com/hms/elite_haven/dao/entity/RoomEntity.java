package com.hms.elite_haven.dao.entity;

import com.hms.elite_haven.utils.RoomType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_id")
    private Long roomId;

    @ManyToOne
    @JoinColumn(name = "hotel_id")
    private HotelEntity hotel;

    @NotBlank
    @Size(max = 20)
    @Column(name = "room_number")
    private String roomNumber;

    @NotBlank
    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private RoomType type;

    @Positive
    @Column(name = "price_per_night")
    private Double pricePerNight;

    // @NotNull
    // @Enumerated(EnumType.STRING)
    // @Column(name = "status")
    // private RoomStatus status = RoomStatus.AVAILABLE;
    
    @Column(name = "is_deleted")
    private Integer isDeleted = 0;

}
