import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Folder, FileText } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export default function TeacherMaterialDetail() {
  const { materialId } = useParams();
  const navigate = useNavigate();

  // Giả lập lấy dữ liệu tài liệu từ ID
  // Trong thực tế sẽ gọi API: fetchMaterialById(materialId)
  const isFolder = materialId === '1' || materialId === '3';
  const isShared = materialId === '3';
  const title = materialId === '1' ? 'Toán học Lớp 5' : 
                materialId === '3' ? 'Toán 5 - Kết nối tri thức' : 
                'Bài giảng: Phân số (H5P)';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="outline" onClick={() => navigate('/teacher/materials')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại Kho học liệu
        </Button>
      </div>

      <Card className="border-slate-200 shadow-md">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="h-24 w-24 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 shadow-inner">
              {isFolder ? (
                <Folder className="h-12 w-12 text-blue-600" />
              ) : (
                <FileText className="h-12 w-12 text-orange-600" />
              )}
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-800 mb-2">{title}</h1>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="text-sm px-3 py-1">Môn: Toán học</Badge>
                <Badge variant="outline" className="text-sm px-3 py-1">Khối: 5</Badge>
                {isShared && <Badge variant="warning" className="text-sm px-3 py-1">Thư viện Gốc (Chỉ đọc)</Badge>}
              </div>
              <div className="bg-slate-50 p-4 rounded-lg text-slate-600 leading-relaxed border border-slate-100">
                Đây là tài liệu được sử dụng cho tuần học số 12. Bao gồm các nội dung liên quan đến Phân số và các phép tính cơ bản.
              </div>
            </div>
          </div>

          <div className="mt-8">
            {isFolder ? (
              <div>
                <h4 className="font-bold text-lg text-slate-800 mb-4 flex items-center">
                  Các file bên trong <span className="ml-2 text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">3 tài liệu</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between items-center p-4 border border-slate-200 rounded-lg hover:border-primary/50 hover:shadow-sm transition-all bg-white group cursor-pointer">
                    <div className="flex items-center text-slate-700 font-medium">
                      <div className="w-10 h-10 rounded bg-red-50 flex items-center justify-center mr-3">
                        <FileText className="w-5 h-5 text-red-500" />
                      </div>
                      Phép cộng phân số.pdf
                    </div>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">Xem</Button>
                  </div>
                  <div className="flex justify-between items-center p-4 border border-slate-200 rounded-lg hover:border-primary/50 hover:shadow-sm transition-all bg-white group cursor-pointer">
                    <div className="flex items-center text-slate-700 font-medium">
                      <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center mr-3">
                        <FileText className="w-5 h-5 text-blue-500" />
                      </div>
                      Phép trừ phân số.docx
                    </div>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">Xem</Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-96 w-full bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                <FileText className="w-16 h-16 mb-4 text-slate-300" />
                <p>Khu vực hiển thị nội dung chi tiết (PDF Viewer / H5P Player)</p>
              </div>
            )}
          </div>

          <div className="pt-8 mt-8 flex flex-col sm:flex-row justify-between items-center border-t border-slate-200 gap-4">
            {!isShared && (
              <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 w-full sm:w-auto">
                Xóa tài liệu
              </Button>
            )}
            <div className="flex space-x-3 w-full sm:w-auto">
              {!isShared && (
                <Button variant="outline" className="w-full sm:w-auto">Chỉnh sửa</Button>
              )}
              <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto px-8">Giao bài cho lớp</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
