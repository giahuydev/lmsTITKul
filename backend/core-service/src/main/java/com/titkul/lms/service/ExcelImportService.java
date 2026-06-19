package com.titkul.lms.service;

import com.titkul.lms.dto.ParsedStudentExcelRow;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

@Service
public class ExcelImportService {

    public List<ParsedStudentExcelRow> parseStudentImportFile(MultipartFile file) {
        List<ParsedStudentExcelRow> rows = new ArrayList<>();
        
        try (InputStream is = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(is)) {
            
            Sheet sheet = workbook.getSheetAt(0);
            
            // Start from row 1 (skip header at row 0)
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;
                
                ParsedStudentExcelRow parsed = new ParsedStudentExcelRow();
                parsed.setRowNumber(i + 1); // 1-based index for user
                
                try {
                    parsed.setClassName(getCellValue(row.getCell(0)));
                    parsed.setStudentCode(getCellValue(row.getCell(1)));
                    parsed.setStudentName(getCellValue(row.getCell(2)));
                    parsed.setStudentDob(getDateValue(row.getCell(3)));
                    parsed.setParentName(getCellValue(row.getCell(4)));
                    parsed.setParentPhone(getCellValue(row.getCell(5)));
                    parsed.setParentEmail(getCellValue(row.getCell(6)));
                    
                    validateRow(parsed);
                } catch (Exception e) {
                    parsed.setValid(false);
                    parsed.setErrorMsg("Lỗi đọc dữ liệu: " + e.getMessage());
                }
                
                rows.add(parsed);
            }
            
        } catch (Exception e) {
            throw new RuntimeException("Lỗi xử lý file Excel: " + e.getMessage(), e);
        }
        
        return rows;
    }
    
    private void validateRow(ParsedStudentExcelRow row) {
        StringBuilder errors = new StringBuilder();
        
        if (row.getClassName() == null || row.getClassName().trim().isEmpty()) {
            errors.append("Thiếu Lớp Học; ");
        }
        if (row.getStudentCode() == null || row.getStudentCode().trim().isEmpty()) {
            errors.append("Thiếu Mã Học Sinh; ");
        }
        if (row.getStudentName() == null || row.getStudentName().trim().isEmpty()) {
            errors.append("Thiếu Họ Tên Học Sinh; ");
        }
        if (row.getParentName() == null || row.getParentName().trim().isEmpty()) {
            errors.append("Thiếu Họ Tên Phụ Huynh; ");
        }
        if (row.getParentPhone() == null || row.getParentPhone().trim().isEmpty()) {
            errors.append("Thiếu SĐT Phụ Huynh; ");
        } else if (!row.getParentPhone().matches("\\d{9,12}")) {
            errors.append("SĐT Phụ Huynh không hợp lệ; ");
        }
        
        if (errors.length() > 0) {
            row.setValid(false);
            row.setErrorMsg(errors.toString());
        }
    }

    private String getCellValue(Cell cell) {
        if (cell == null) return null;
        DataFormatter formatter = new DataFormatter();
        String val = formatter.formatCellValue(cell).trim();
        return val.isEmpty() ? null : val;
    }
    
    private LocalDate getDateValue(Cell cell) {
        if (cell == null) return null;
        if (cell.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(cell)) {
            return cell.getDateCellValue().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        }
        // If string parsing is needed, could parse DD/MM/YYYY here
        return null;
    }

    public List<com.titkul.lms.dto.ParsedTeacherExcelRow> parseTeacherImportFile(MultipartFile file) {
        List<com.titkul.lms.dto.ParsedTeacherExcelRow> rows = new ArrayList<>();
        
        try (InputStream is = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(is)) {
            
            Sheet sheet = workbook.getSheetAt(0);
            
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;
                
                com.titkul.lms.dto.ParsedTeacherExcelRow parsed = new com.titkul.lms.dto.ParsedTeacherExcelRow();
                parsed.setRowNumber(i + 1);
                
                try {
                    parsed.setTeacherCode(getCellValue(row.getCell(0)));
                    parsed.setFullName(getCellValue(row.getCell(1)));
                    parsed.setPhone(getCellValue(row.getCell(2)));
                    parsed.setDepartment(getCellValue(row.getCell(3)));
                    parsed.setDateOfBirth(getDateValue(row.getCell(4)));
                    
                    validateTeacherRow(parsed);
                } catch (Exception e) {
                    parsed.setValid(false);
                    parsed.setErrorMsg("Lỗi đọc dữ liệu: " + e.getMessage());
                }
                
                rows.add(parsed);
            }
            
        } catch (Exception e) {
            throw new RuntimeException("Lỗi xử lý file Excel: " + e.getMessage(), e);
        }
        
        return rows;
    }
    
    private void validateTeacherRow(com.titkul.lms.dto.ParsedTeacherExcelRow row) {
        StringBuilder errors = new StringBuilder();
        
        if (row.getTeacherCode() == null || row.getTeacherCode().trim().isEmpty()) {
            errors.append("Thiếu Mã Giáo Viên; ");
        }
        if (row.getFullName() == null || row.getFullName().trim().isEmpty()) {
            errors.append("Thiếu Họ Tên; ");
        }
        
        if (errors.length() > 0) {
            row.setValid(false);
            row.setErrorMsg(errors.toString());
        }
    }
}
