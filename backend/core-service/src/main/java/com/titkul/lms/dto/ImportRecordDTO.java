package com.titkul.lms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImportRecordDTO {
    private int rowNumber;
    private String studentCode;
    private String studentName;
    private String errorMsg;
}
