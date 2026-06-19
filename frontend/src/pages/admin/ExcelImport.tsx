import { useState, useRef } from 'react';
import { Upload, FileType, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';

interface PreviewRow {
  className: string;
  studentCode: string;
  studentName: string;
  parentName: string;
  parentPhone: string;
  isValid: boolean;
  errors: string[];
}

export default function ExcelImport() {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<PreviewRow[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setUploadResult(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];

      // Skip header row
      const rows = data.slice(1).filter(row => row.length > 0);
      
      const parsedPreview: PreviewRow[] = rows.map((row) => {
        const errors = [];
        if (!row[0]) errors.push('Thiếu lớp');
        if (!row[1]) errors.push('Thiếu mã HS');
        if (!row[2]) errors.push('Thiếu tên HS');
        if (!row[4]) errors.push('Thiếu tên PH');
        if (!row[5]) errors.push('Thiếu SĐT PH');
        
        return {
          className: row[0] || '',
          studentCode: row[1] || '',
          studentName: row[2] || '',
          parentName: row[4] || '',
          parentPhone: row[5] || '',
          isValid: errors.length === 0,
          errors
        };
      });
      
      setPreviewData(parsedPreview);
    };
    reader.readAsBinaryString(selectedFile);
  };

  const handleUploadToServer = async () => {
    if (!file) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('http://localhost:8080/api/v1/admin/import/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Lỗi khi upload file');
      }
      
      setUploadResult(data);
    } catch (error) {
      console.error('Upload error', error);
      alert('Có lỗi xảy ra khi tải file lên!');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nhập danh sách Học sinh & Phụ huynh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg p-10 bg-slate-50 hover:bg-slate-100 transition-colors">
            <FileType className="w-12 h-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-700">Tải file Excel (.xlsx) lên đây</h3>
            <p className="text-sm text-slate-500 mb-4">Mẫu file gồm 7 cột: Lớp, Mã HS, Tên HS, Ngày sinh, Tên PH, SĐT PH, Email PH</p>
            <input 
              type="file" 
              accept=".xlsx, .xls" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <Button onClick={() => fileInputRef.current?.click()} variant="outline">
              <Upload className="w-4 h-4 mr-2" /> Chọn file
            </Button>
          </div>
        </CardContent>
      </Card>

      {previewData.length > 0 && !uploadResult && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Bản xem trước ({previewData.length} dòng)</CardTitle>
            <Button onClick={handleUploadToServer} disabled={isUploading || previewData.some(r => !r.isValid)}>
              {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
              Tiến hành Import
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lớp</TableHead>
                  <TableHead>Mã HS</TableHead>
                  <TableHead>Tên Học sinh</TableHead>
                  <TableHead>Phụ huynh</TableHead>
                  <TableHead>SĐT PH</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewData.slice(0, 10).map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.className}</TableCell>
                    <TableCell className="font-medium">{row.studentCode}</TableCell>
                    <TableCell>{row.studentName}</TableCell>
                    <TableCell>{row.parentName}</TableCell>
                    <TableCell>{row.parentPhone}</TableCell>
                    <TableCell>
                      {row.isValid ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <div className="flex items-center text-red-500" title={row.errors.join(', ')}>
                          <AlertCircle className="w-5 h-5 mr-1" /> Lỗi
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {previewData.length > 10 && (
              <p className="text-center text-sm text-slate-500 mt-4">Hiển thị 10 dòng đầu tiên...</p>
            )}
          </CardContent>
        </Card>
      )}

      {uploadResult && (
        <Card>
          <CardHeader>
            <CardTitle>Kết quả Import</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-6 mb-6">
              <div className="bg-slate-50 p-4 rounded-lg flex-1">
                <p className="text-sm text-slate-500">Tổng số dòng</p>
                <p className="text-2xl font-bold text-slate-800">{uploadResult.totalRows}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg flex-1">
                <p className="text-sm text-green-600">Thành công</p>
                <p className="text-2xl font-bold text-green-700">{uploadResult.successCount}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg flex-1">
                <p className="text-sm text-red-600">Thất bại</p>
                <p className="text-2xl font-bold text-red-700">{uploadResult.failureCount}</p>
              </div>
            </div>

            {uploadResult.failures?.length > 0 && (
              <div>
                <h4 className="font-medium text-red-600 mb-2">Chi tiết lỗi:</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dòng</TableHead>
                      <TableHead>Mã HS</TableHead>
                      <TableHead>Họ Tên</TableHead>
                      <TableHead>Lý do lỗi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {uploadResult.failures.map((f: any, idx: number) => (
                      <TableRow key={idx}>
                        <TableCell>#{f.rowNumber}</TableCell>
                        <TableCell>{f.studentCode}</TableCell>
                        <TableCell>{f.studentName}</TableCell>
                        <TableCell className="text-red-500">{f.errorMsg}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
