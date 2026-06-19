import { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, RefreshCw, Loader2, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';

import { adminService } from '../../services/admin.service';
import type { ImportError } from '../../services/admin.service';

export default function AdminImport() {
  const [hasError, setHasError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [importType, setImportType] = useState<'student' | 'teacher'>('student');
  const [errors, setErrors] = useState<ImportError[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setHasError(false);
    setIsSuccess(false);
    setErrors([]);

    try {
      if (importType === 'student') {
        await adminService.importUsers(file);
      } else {
        await adminService.importTeachers(file);
      }
      setIsSuccess(true);
    } catch (err: any) {
      setHasError(true);
      if (err.response?.data?.details) {
        setErrors(err.response.data.details);
      } else {
        setErrors([{ row: 0, issue: err.response?.data?.message || 'Lỗi máy chủ không xác định' }]);
      }
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleBoxClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Import Dữ Liệu Excel</h1>
      
      {/* Import Type Selector */}
      <div className="flex space-x-4 mb-2">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input 
            type="radio" 
            checked={importType === 'student'} 
            onChange={() => setImportType('student')} 
            className="w-4 h-4 text-primary" 
          />
          <span className="font-medium">Học sinh & Phụ huynh</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input 
            type="radio" 
            checked={importType === 'teacher'} 
            onChange={() => setImportType('teacher')} 
            className="w-4 h-4 text-primary" 
          />
          <span className="font-medium">Giáo viên</span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tải file Excel lên ({importType === 'student' ? 'Học sinh & Phụ huynh' : 'Giáo viên'})</CardTitle>
            </CardHeader>
            <CardContent>
              {isSuccess && (
                <div className="p-6 bg-green-50 border border-green-200 rounded-lg flex flex-col items-center text-center mb-6">
                  <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                  <h4 className="text-xl font-bold text-green-800 mb-2">Import Thành Công!</h4>
                  <p className="text-green-600 mb-6">Toàn bộ dữ liệu đã được lưu vào hệ thống.</p>
                  <Button variant="outline" onClick={() => setIsSuccess(false)}>Tải thêm file khác</Button>
                </div>
              )}

              {!hasError && !isSuccess ? (
                <div 
                  onClick={handleBoxClick}
                  className="border-2 border-dashed border-slate-300 rounded-xl p-12 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative"
                >
                  <input 
                    type="file" 
                    accept=".xlsx, .xls" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                  />
                  {isLoading ? (
                    <div className="flex flex-col items-center text-indigo-600">
                      <Loader2 className="h-10 w-10 animate-spin mb-4" />
                      <h3 className="text-lg font-bold">Đang quét dữ liệu...</h3>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-slate-400 mb-4" />
                      <h3 className="text-lg font-medium text-slate-800 mb-1">Kéo thả file vào đây</h3>
                      <p className="text-sm text-slate-500 mb-4">hoặc click để chọn file từ máy tính (.xlsx, .xls)</p>
                      <Button variant="outline">Chọn file</Button>
                    </>
                  )}
                </div>
              ) : hasError ? (
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-red-800">Hệ thống từ chối File (Quy tắc All-or-Nothing)</h4>
                      <p className="text-sm text-red-600 mt-1">Phát hiện {errors.length} lỗi trong quá trình quét dữ liệu. Vui lòng sửa lại file và tải lên lại từ đầu.</p>
                    </div>
                    <Button variant="outline" size="sm" className="ml-auto" onClick={() => setHasError(false)}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Tải file mới
                    </Button>
                  </div>
                  
                  <div className="border border-red-200 rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader className="bg-red-50/50">
                        <TableRow>
                          <TableHead className="w-24 text-center">Dòng</TableHead>
                          <TableHead>Chi tiết lỗi (Issue)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {errors.map((err, idx) => (
                          <TableRow key={idx} className="bg-red-50/30 hover:bg-red-50/50">
                            <TableCell className="font-bold text-red-700 text-center">#{err.row}</TableCell>
                            <TableCell className="text-red-600 font-medium">{err.issue}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mẫu File (Template)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center">
                  <FileSpreadsheet className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-sm font-medium text-slate-700">Mẫu Học Sinh + Phụ Huynh</span>
                </div>
                <Button variant="ghost" size="sm">Tải về</Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center">
                  <FileSpreadsheet className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-sm font-medium text-slate-700">Mẫu Phân Lớp</span>
                </div>
                <Button variant="ghost" size="sm">Tải về</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-amber-600 mr-3 shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold mb-1">Quy tắc All-or-Nothing</p>
                <p>Hệ thống quét toàn bộ dữ liệu trước khi thực thi. Nếu có lỗi (trống trường bắt buộc, sai ngày sinh, trùng mã định danh), hệ thống sẽ từ chối toàn bộ file.</p>
                <p className="mt-2 text-xs italic">*Lưu ý: Trùng số điện thoại phụ huynh được chấp nhận (dành cho trường hợp anh chị em sinh đôi học cùng lớp).</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
