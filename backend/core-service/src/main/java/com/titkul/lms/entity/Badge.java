package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "huy_hieu")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Badge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "huy_hieu_id", columnDefinition = "INT UNSIGNED")
    private Integer id;

    @Column(name = "ten_huy_hieu", nullable = false, length = 100, unique = true)
    private String name;

    @Column(name = "mo_ta", columnDefinition = "TEXT")
    private String description;

    @Column(name = "icon_url", length = 500)
    private String iconUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "loai", nullable = false)
    private BadgeType type;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "dieu_kien")
    private String conditions;

    public enum BadgeType {
        THU_CONG, TU_DONG
    }
}
