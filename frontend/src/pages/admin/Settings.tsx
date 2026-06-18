import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';

import { adminSubjects, adminGrades } from '../../mocks/adminData';

export default function AdminSettings() {
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);

  const subjects = adminSubjects;
  const grades = adminGrades;

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
              <Button variant="outline" size="sm" onClick={() => setShowGradeModal(true)}>
                <Plus className="w-4 h-4 mr-1" /> Thêm Khối
              </Button>
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
              <Button variant="outline" size="sm" onClick={() => setShowSubjectModal(true)}>
                <Plus className="w-4 h-4 mr-1" /> Thêm Môn
              </Button>
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

      {/* Modal Thêm Khối */}
      {showGradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-[400px] rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">Thêm Khối mới</h3>
              <button onClick={() => setShowGradeModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <Input label="Tên Khối" placeholder="VD: Khối 6" />
              <div className="pt-2 flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowGradeModal(false)}>Hủy bỏ</Button>
                <Button onClick={() => setShowGradeModal(false)}>Thêm Khối</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Thêm Môn Học */}
      {showSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-[400px] rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">Thêm Môn học mới</h3>
              <button onClick={() => setShowSubjectModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <Input label="Tên Môn học" placeholder="VD: Tin học" />
              <div className="pt-2 flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowSubjectModal(false)}>Hủy bỏ</Button>
                <Button onClick={() => setShowSubjectModal(false)}>Thêm Môn</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
