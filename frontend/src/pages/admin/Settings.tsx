import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Plus, Trash2 } from 'lucide-react';

export default function AdminSettings() {
  const subjects = ['Toán học', 'Tiếng Việt', 'Lịch sử', 'Địa lý', 'Khoa học', 'Tiếng Anh'];
  const grades = ['Khối 1', 'Khối 2', 'Khối 3', 'Khối 4', 'Khối 5'];

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-800">Cấu hình Trường học</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Thông tin chung</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Tên trường" defaultValue="Trường Tiểu học Titkul Kids" />
            <Input label="Hotline" defaultValue="1900 1234" />
          </div>
          <Input label="Địa chỉ" defaultValue="123 Đường ABC, Quận XYZ, TP.HCM" />
          <Input label="Email liên hệ" type="email" defaultValue="contact@titkul.edu.vn" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <Input label="Năm học hiện tại" defaultValue="2025-2026" />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Học kỳ hiện tại</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary focus:ring-1">
                <option value="1">Học kỳ 1</option>
                <option value="2">Học kỳ 2</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button>Lưu thay đổi</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cơ cấu đào tạo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-slate-700 text-sm">Danh sách Khối lớp</h3>
              <Button variant="outline" size="sm"><Plus className="w-4 h-4 mr-1" /> Thêm Khối</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {grades.map(g => (
                <Badge key={g} variant="outline" className="px-3 py-1.5 flex items-center">
                  {g} <Trash2 className="w-3 h-3 ml-2 text-slate-400 hover:text-red-500 cursor-pointer" />
                </Badge>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-slate-700 text-sm">Danh mục Môn học</h3>
              <Button variant="outline" size="sm"><Plus className="w-4 h-4 mr-1" /> Thêm Môn</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {subjects.map(s => (
                <Badge key={s} variant="outline" className="px-3 py-1.5 flex items-center bg-slate-50">
                  {s} <Trash2 className="w-3 h-3 ml-2 text-slate-400 hover:text-red-500 cursor-pointer" />
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
