package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "mon_hoc")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mon_hoc_id", columnDefinition = "TINYINT UNSIGNED")
    private Integer id;

    @Column(name = "ten_mon", nullable = false, length = 100, unique = true)
    private String name;

    @Column(name = "ma_mon", length = 20)
    private String code;

    @Column(name = "mo_ta", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false)
    private Status status = Status.ACTIVE;

    public enum Status {
        ACTIVE, AN
    }
}
