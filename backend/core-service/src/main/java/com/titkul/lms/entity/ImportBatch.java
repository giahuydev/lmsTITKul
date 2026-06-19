package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "lo_import")
@Data
public class ImportBatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lo_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoi_thuc_hien_id")
    private User executedBy;

    @Column(name = "loai_import")
    private String importType;

    @Column(name = "ten_file")
    private String fileName;

    @Column(name = "trang_thai")
    private String status;

    @Column(name = "so_thanh_cong")
    private Integer successCount;

    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.JSON)
    @Column(name = "chi_tiet_loi")
    private String errorDetails;

    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.JSON)
    @Column(name = "tom_tat_ket_qua")
    private String summary;
}
