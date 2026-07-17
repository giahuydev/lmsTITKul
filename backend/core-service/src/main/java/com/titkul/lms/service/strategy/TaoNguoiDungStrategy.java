package com.titkul.lms.service.strategy;

import com.titkul.lms.dto.CreateUserDto;
import com.titkul.lms.entity.VaiTro;
import com.titkul.lms.entity.NguoiDung;

public interface TaoNguoiDungStrategy {
    boolean supports(String roleStr);
    NguoiDung createUser(CreateUserDto dto, String defaultPasswordHash);
}
