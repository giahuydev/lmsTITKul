package com.titkul.lms.service.strategy;

import com.titkul.lms.dto.CreateUserDto;
import com.titkul.lms.entity.Role;
import com.titkul.lms.entity.User;

public interface UserCreationStrategy {
    boolean supports(String roleStr);
    User createUser(CreateUserDto dto, String defaultPasswordHash);
}
