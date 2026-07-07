package com.titkul.lms.service;

import com.titkul.lms.dto.HocLieuInternalDTO;
import com.titkul.lms.entity.HocLieu;
import com.titkul.lms.entity.LoaiHocLieu;
import com.titkul.lms.entity.NguonGocHocLieu;
import com.titkul.lms.entity.TeacherProfile;
import com.titkul.lms.repository.HocLieuRepository;
import com.titkul.lms.repository.TeacherProfileRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HocLieuService {

    private final HocLieuRepository hocLieuRepository;
    private final TeacherProfileRepository teacherProfileRepository;

    // Upsert theo h5pContentId, tránh tạo trùng khi GV sửa lại bài.
    public HocLieu createOrUpdateFromH5p(HocLieuInternalDTO dto) {
        if (dto.getH5pContentId() == null || dto.getH5pContentId().isBlank()) {
            throw new IllegalArgumentException("h5pContentId không được để trống!");
        }

        HocLieu hocLieu = hocLieuRepository.findByH5pContentId(dto.getH5pContentId())
                .orElseGet(HocLieu::new);

        hocLieu.setH5pContentId(dto.getH5pContentId());
        hocLieu.setTitle(dto.getTieuDe());
        hocLieu.setType(LoaiHocLieu.valueOf(dto.getLoaiHocLieu()));
        hocLieu.setOrigin(NguonGocHocLieu.valueOf(dto.getNguonGoc()));

        if (dto.getGiaoVienId() != null) {
            TeacherProfile teacher = teacherProfileRepository.findByUserId(dto.getGiaoVienId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Không tìm thấy Giáo viên với User ID: " + dto.getGiaoVienId()));
            hocLieu.setTeacher(teacher);
        }

        return hocLieuRepository.save(hocLieu);
    }

    public List<HocLieu> listAll() {
        return hocLieuRepository.findAll();
    }

    public List<HocLieu> listByTeacherUserId(Long userId) {
        return hocLieuRepository.findByTeacher_User_Id(userId);
    }

    public HocLieu getById(Long id) {
        return hocLieuRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy học liệu với ID: " + id));
    }

    // Chỉ chủ sở hữu hoặc Admin mới được xóa.
    public void delete(Long id, String requesterUsername, boolean requesterIsAdmin) {
        HocLieu hocLieu = getById(id);
        boolean isOwner = hocLieu.getTeacher() != null
                && hocLieu.getTeacher().getUser() != null
                && hocLieu.getTeacher().getUser().getUsername().equals(requesterUsername);
        if (!requesterIsAdmin && !isOwner) {
            throw new IllegalArgumentException("Bạn không có quyền xóa học liệu này.");
        }
        hocLieuRepository.delete(hocLieu);
    }
}
