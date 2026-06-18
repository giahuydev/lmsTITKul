import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, KeySquare, Award, X, Search, Phone, User as UserIcon } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';

import { teacherClassStudents, teacherClasses } from '../../mocks/teacherData';

export default function TeacherClassDetails() {
  const { classId } = useParams();
  const [resetStudent, setResetStudent] = useState<any>(null);

  // In a real app, fetch class details using classId. Here we mock it.
  const classInfo = teacherClasses.find(c => c.id === Number(classId)) || teacherClasses[0];
  const students = teacherClassStudents;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/teacher/classes">
          <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700">
            <ChevronLeft className="w-5 h-5 mr-1" /> Quay lại
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Chi tiết Lớp {classInfo.name}</h1>
          <p className="text-sm text-slate-500">Sĩ số: {classInfo.students} Học sinh | Giáo viên: {classInfo.role}</p>
        </div>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input className="pl-9" placeholder="Tìm kiếm học sinh theo tên, mã..." />
          </div>
          <select className="px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary">
            <option value="all">Tất cả xếp loại</option>
            <option value="tot">Hoàn thành Tốt</option>
            <option value="dat">Hoàn thành</option>
            <option value="chuadat">Chưa hoàn thành</option>
          </select>
        </div>
        
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã HS</TableHead>
                <TableHead>Học sinh & Phụ huynh</TableHead>
                <TableHead>Ngày sinh</TableHead>
                <TableHead>Đánh giá (TT27)</TableHead>
                <TableHead>Chuyên cần</TableHead>
                <TableHead>Thành tích</TableHead>
                <TableHead className="text-right">Hỗ trợ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map(student => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium text-slate-500">{student.code}</TableCell>
                  <TableCell>
                    <div className="font-bold text-slate-800">{student.name}</div>
                    <div className="text-xs text-slate-500 flex items-center mt-1">
                      <UserIcon className="w-3 h-3 mr-1" /> Phụ huynh: {student.parentName}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center mt-0.5">
                      <Phone className="w-3 h-3 mr-1" /> {student.phone}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{student.dob}</TableCell>
                  <TableCell>
                    <Badge variant={
                      student.evaluation === 'Hoàn thành Tốt' ? 'success' : 
                      student.evaluation === 'Hoàn thành' ? 'outline' : 'danger'
                    }>
                      {student.evaluation}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-full bg-slate-200 rounded-full h-2 max-w-[80px] mr-2">
                        <div className={`h-2 rounded-full ${student.attendance >= 95 ? 'bg-green-500' : student.attendance >= 90 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: `${student.attendance}%` }}></div>
                      </div>
                      <span className="text-xs font-medium text-slate-600">{student.attendance}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-amber-500 font-bold text-sm">
                      <Award className="w-4 h-4 mr-1" /> {student.badges}
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm">Chi tiết HS</Button>
                    <Button variant="outline" size="sm" className="text-orange-600 border-orange-200 hover:bg-orange-50" onClick={() => setResetStudent(student)}>
                      <KeySquare className="w-4 h-4 mr-1" /> Cấp lại MK
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Yêu Cầu Cấp Lại Mật Khẩu */}
      {resetStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-[400px] rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-orange-50">
              <h3 className="font-bold text-orange-800">Yêu cầu cấp lại Mật khẩu</h3>
              <button onClick={() => setResetStudent(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-slate-500 mb-1">Học sinh:</p>
                <p className="font-bold text-slate-800">{resetStudent.name} ({resetStudent.code})</p>
                <p className="text-xs text-slate-500 mt-1">Lớp {classInfo.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Lý do (Sẽ gửi cho Admin)</label>
                <textarea 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-primary text-sm h-24 resize-none"
                  placeholder="VD: Phụ huynh báo quên mật khẩu..."
                  defaultValue="Phụ huynh báo quên mật khẩu, nhờ Admin cấp lại mật khẩu mặc định."
                ></textarea>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100 mt-2">
                <Button variant="outline" onClick={() => setResetStudent(null)}>Hủy bỏ</Button>
                <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => setResetStudent(null)}>Gửi Ticket</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
