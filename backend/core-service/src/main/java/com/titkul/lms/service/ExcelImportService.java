package com.titkul.lms.service;

import com.titkul.lms.service.excel.ExcelRowParser;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.titkul.lms.dto.ParsedStudentExcelRow;
import com.titkul.lms.dto.ParsedTeacherExcelRow;
import com.titkul.lms.service.excel.StudentExcelParser;
import com.titkul.lms.service.excel.TeacherExcelParser;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExcelImportService {

    private final StudentExcelParser studentParser;
    private final TeacherExcelParser teacherParser;

    public List<ParsedStudentExcelRow> parseStudentImportFile(MultipartFile file) {
        return parseFile(file, studentParser);
    }

    public List<ParsedTeacherExcelRow> parseTeacherImportFile(MultipartFile file) {
        return parseFile(file, teacherParser);
    }

    private <T> List<T> parseFile(MultipartFile file, ExcelRowParser<T> parser) {
        List<T> rows = new ArrayList<>();
        try (InputStream is = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(is)) {

            Sheet sheet = workbook.getSheetAt(0);
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;
                rows.add(parser.parse(row, i + 1));
            }
        } catch (Exception e) {
            throw new RuntimeException("Lỗi xử lý file Excel: " + e.getMessage(), e);
        }
        return rows;
    }
}
