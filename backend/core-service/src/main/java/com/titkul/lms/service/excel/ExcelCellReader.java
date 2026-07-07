package com.titkul.lms.service.excel;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.DateUtil;

import java.time.LocalDate;
import java.time.ZoneId;

public final class ExcelCellReader {

    private ExcelCellReader() {}

    public static String getString(Cell cell) {
        if (cell == null) return null;
        String val = new DataFormatter().formatCellValue(cell).trim();
        return val.isEmpty() ? null : val;
    }

    public static LocalDate getDate(Cell cell) {
        if (cell == null) return null;
        if (cell.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(cell)) {
            return cell.getDateCellValue().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        }
        return null;
    }
}
