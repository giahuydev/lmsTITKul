import { useState } from 'react';
import { Plus, Search, RefreshCcw, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';

import { adminClasses } from '../../mocks/adminData';
import { Modal } from '../../components/ui/Modal';
import { GRADES } from '../../constants';

export default function AdminClasses() {
  const [showClassModal, setShowClassModal] = useState(false);
  const [editingClass, setEditingClass] = useState<any>(null);

  const classes = adminClasses;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Quản lý Lớp học</h1>
        <Button onClick={() => { setEditingClass(null); setShowClassModal(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo lớp mới
        </Button>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-100 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input className="pl-9" placeholder="Tìm lớp..." />
          </div>
          <select className="px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary focus:ring-1">
            {GRADES.map(g => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </select>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên lớp</TableHead>
                <TableHead>Khối</TableHead>
                <TableHead>GVCN</TableHead>
                <TableHead>Sĩ số</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map(cls => (
                <TableRow key={cls.id}>
                  <TableCell className="font-medium text-primary">{cls.name}</TableCell>
                  <TableCell>{cls.grade}</TableCell>
                  <TableCell className="font-medium">
                    {cls.teacher} 
                    <button className="ml-2 text-xs text-indigo-600 hover:text-indigo-800" title="Gán/Đổi GVCN">
                      <RefreshCcw className="w-3 h-3 inline" /> Đổi
                    </button>
                  </TableCell>
                  <TableCell>{cls.students} / {cls.max}</TableCell>
                  <TableCell>
                    <Badge variant={cls.status === 'ACTIVE' ? 'success' : 'outline'}>
                      {cls.status === 'ACTIVE' ? 'Đang học' : 'Đóng băng'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm">HS</Button>
                    <Button variant="ghost" size="sm" onClick={() => { setEditingClass(cls); setShowClassModal(true); }}>Sửa</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Tạo/Sửa Lớp Học */}
      <Modal 
        isOpen={showClassModal} 
        onClose={() => setShowClassModal(false)} 
        title={editingClass ? 'Sửa thông tin Lớp học' : 'Tạo Lớp học mới'}
      >
        <div className="p-6 space-y-4">
          <Input label="Tên lớp" defaultValue={editingClass?.name || ''} placeholder="VD: Lớp 5A" />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Khối</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary" defaultValue={editingClass?.grade || '5'}>
                {GRADES.filter(g => g.value !== 'all').map(g => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </div>
            <Input label="Sĩ số tối đa" type="number" defaultValue={editingClass?.max || 40} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Giáo viên chủ nhiệm</label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary">
              <option>-- Chưa phân công --</option>
              <option>Nguyễn Văn A</option>
              <option>Trần Thị B</option>
            </select>
          </div>
          
          <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100 mt-2">
            <Button variant="outline" onClick={() => setShowClassModal(false)}>Hủy bỏ</Button>
            <Button onClick={() => setShowClassModal(false)}>Lưu thay đổi</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
