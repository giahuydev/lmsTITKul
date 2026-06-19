import { useState, useEffect } from 'react';
import { Plus, Search, RefreshCcw, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';

import { Modal } from '../../components/ui/Modal';
import { GRADES } from '../../constants';
import { teacherService, type TeacherProfile } from '../../services/teacher.service';
import { classService, type ClassRoom } from '../../services/class.service';
import { Link } from 'react-router-dom';

export default function AdminClasses() {
  const [showClassModal, setShowClassModal] = useState(false);
  const [editingClass, setEditingClass] = useState<any>(null);
  
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    grade: '5',
    academicYear: '2026-2027',
    maxCapacity: '40',
    homeroomTeacherId: ''
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [classData, teacherData] = await Promise.all([
        classService.getAllClasses(),
        teacherService.getAllTeachers()
      ]);
      setClasses(classData);
      setTeachers(teacherData);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingClass(null);
    setFormData({
      name: '',
      grade: '5',
      academicYear: '2026-2027',
      maxCapacity: '40',
      homeroomTeacherId: ''
    });
    setShowClassModal(true);
  };

  const handleOpenEditModal = (cls: ClassRoom) => {
    setEditingClass(cls);
    setFormData({
      name: cls.name,
      grade: cls.grade.toString(),
      academicYear: cls.academicYear,
      maxCapacity: cls.maxCapacity.toString(),
      homeroomTeacherId: cls.homeroomTeacher?.id?.toString() || ''
    });
    setShowClassModal(true);
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await classService.toggleStatus(id);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleSaveClass = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    try {
      const dto = {
        name: formData.name,
        grade: parseInt(formData.grade),
        academicYear: formData.academicYear,
        maxCapacity: parseInt(formData.maxCapacity),
        homeroomTeacherId: formData.homeroomTeacherId ? parseInt(formData.homeroomTeacherId) : undefined
      };

      if (!editingClass) {
        await classService.createClass(dto as any);
        alert('Tạo lớp học thành công!');
      } else {
        await classService.updateClass(editingClass.id, dto as any);
        alert('Sửa lớp học thành công!');
      }
      setShowClassModal(false);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi tạo lớp');
    } finally {
      setIsSubmitting(false);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [filterGrade, setFilterGrade] = useState('all');

  const filteredClasses = classes.filter(cls => {
    const matchSearch = cls.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchGrade = filterGrade === 'all' || cls.grade.toString() === filterGrade;
    return matchSearch && matchGrade;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Quản lý Lớp học</h1>
        <Button onClick={handleOpenCreateModal}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo lớp mới
        </Button>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-100 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              className="pl-9" 
              placeholder="Tìm lớp..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select 
            className="px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary focus:ring-1"
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
          >
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">Đang tải dữ liệu...</TableCell>
                </TableRow>
              ) : filteredClasses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">Không tìm thấy lớp học nào.</TableCell>
                </TableRow>
              ) : filteredClasses.map(cls => (
                <TableRow key={cls.id}>
                  <TableCell className="font-medium text-primary">{cls.name}</TableCell>
                  <TableCell>{cls.grade}</TableCell>
                  <TableCell className="font-medium">
                    {cls.homeroomTeacher ? cls.homeroomTeacher.fullName : <span className="text-slate-400 italic">Chưa phân công</span>} 
                  </TableCell>
                  <TableCell>{cls.currentStudentCount || 0} / {cls.maxCapacity}</TableCell>
                  <TableCell>
                    <Badge variant={cls.status === 'ACTIVE' ? 'success' : 'outline'}>
                      {cls.status === 'ACTIVE' ? 'Đang học' : 'Đóng băng'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link to={`/admin/classes/${cls.id}`}>
                      <Button variant="ghost" size="sm">Chi tiết</Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={() => handleToggleStatus(cls.id)}>
                      {cls.status === 'ACTIVE' ? 'Đóng băng' : 'Mở khóa'}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleOpenEditModal(cls)}>Sửa</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal 
        isOpen={showClassModal} 
        onClose={() => setShowClassModal(false)} 
        title={editingClass ? 'Sửa thông tin Lớp học' : 'Tạo Lớp học mới'}
      >
        <form onSubmit={handleSaveClass} className="p-6 space-y-4">
          <Input 
            label="Tên lớp" 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="VD: Lớp 5A" 
            required
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Khối</label>
              <select 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary" 
                value={formData.grade}
                onChange={(e) => setFormData({...formData, grade: e.target.value})}
              >
                {GRADES.filter(g => g.value !== 'all').map(g => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </div>
            <Input 
              label="Niên khóa" 
              value={formData.academicYear}
              onChange={(e) => setFormData({...formData, academicYear: e.target.value})}
              placeholder="VD: 2026-2027" 
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Sĩ số tối đa" 
              type="number" 
              value={formData.maxCapacity} 
              onChange={(e) => setFormData({...formData, maxCapacity: e.target.value})}
              required
              min="1"
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Giáo viên chủ nhiệm</label>
              <select 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary"
                value={formData.homeroomTeacherId}
                onChange={(e) => setFormData({...formData, homeroomTeacherId: e.target.value})}
              >
                <option value="">-- Chưa phân công --</option>
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>{t.fullName}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100 mt-2">
            <Button type="button" variant="outline" onClick={() => setShowClassModal(false)}>Hủy bỏ</Button>
            <Button type="submit" isLoading={isSubmitting}>Lưu thay đổi</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
