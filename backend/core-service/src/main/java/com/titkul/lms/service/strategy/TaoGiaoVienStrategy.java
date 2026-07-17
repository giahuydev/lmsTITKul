package com.titkul.lms.service.strategy;

import com.titkul.lms.dto.TaoNguoiDungRequest;
import com.titkul.lms.entity.VaiTro;
import com.titkul.lms.entity.HoSoGiaoVien;
import com.titkul.lms.entity.NguoiDung;
import com.titkul.lms.entity.TrangThaiNguoiDung;
import com.titkul.lms.repository.HoSoGiaoVienRepository;
import com.titkul.lms.repository.NguoiDungRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class TaoGiaoVienStrategy implements TaoNguoiDungStrategy {

    private final NguoiDungRepository userRepository;
    private final HoSoGiaoVienRepository teacherProfileRepository;

    @Override
    public boolean supports(String roleStr) {
        return "GIAO_VIEN".equals(roleStr);
    }

    @Override
    @Transactional
    public NguoiDung createUser(TaoNguoiDungRequest dto, String defaultPasswordHash) {
        if (dto.getPhone() == null || dto.getPhone().isBlank()) {
            throw new IllegalArgumentException("Số điện thoại là bắt buộc để tạo tài khoản Giáo viên.");
        }

        String username = "GV" + dto.getPhone();
        if (userRepository.existsByTenDangNhap(username)) {
            throw new RuntimeException("Đã tồn tại tài khoản Giáo viên với số điện thoại này.");
        }

        NguoiDung user = new NguoiDung();
        user.setTenDangNhap(username);
        user.setMatKhauHash(defaultPasswordHash);
        user.setTrangThai(TrangThaiNguoiDung.ACTIVE);
        user.setBatBuocDoiMk(true);
        user.setVaiTro(VaiTro.GIAO_VIEN);
        user.setSoDienThoai(dto.getPhone());

        user = userRepository.save(user);

        HoSoGiaoVien tp = new HoSoGiaoVien();
        tp.setNguoiDung(user);
        tp.setHoTen(dto.getFullName());
        tp.setBoMon(dto.getDepartment());
        tp.setNgaySinh(dto.getDateOfBirth());
        teacherProfileRepository.save(tp);

        return user;
    }
}
