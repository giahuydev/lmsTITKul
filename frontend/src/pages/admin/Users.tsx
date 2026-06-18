import { useState } from 'react';
import { Search, Filter, ArrowRightLeft, Upload } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { cn } from '../../layouts/DashboardLayout';
import { Link } from 'react-router-dom';

type TabType = 'teacher' | 'student' | 'parent';

export default function AdminUsers() {
  const [activeTab, setActiveTab] = useState<TabType>('student');

  const teachers = [
    { id: 1, name: 'Nguyễn Văn A', username: 'GV0901234567', phone: '0901234567', status: 'ACTIVE', isDefaultPwd: false },
    { id: 2, name: 'Trần Thị B', username: 'GV0987654321', phone: '0987654321', status: 'ACTIVE', isDefaultPwd: true },
  ];

  const students = [
    { id: 1, name: 'Lê Hoàng Cường', username: 'HS2026001', class: 'Lớp 5A', status: 'ACTIVE' },
    { id: 2, name: 'Nguyễn Thị D', username: 'HS2026002', class: 'Lớp 5A', status: 'ACTIVE' },
  ];

  const parents = [
    { id: 1, name: 'Lê Văn C (Bố)', username: 'PH090111222', phone: '090111222', children: 'Lê Hoàng Cường (Lớp 5A)', status: 'ACTIVE' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Quản lý Tài khoản</h1>
        <Link to="/admin/import">
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Import Excel
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('student')}
          className={cn("px-4 py-2 rounded-md text-sm font-medium transition-colors", activeTab === 'student' ? "bg-white text-primary shadow-sm" : "text-slate-600")}
        >
          Học sinh
        </button>
        <button
          onClick={() => setActiveTab('parent')}
          className={cn("px-4 py-2 rounded-md text-sm font-medium transition-colors", activeTab === 'parent' ? "bg-white text-primary shadow-sm" : "text-slate-600")}
        >
          Phụ huynh
        </button>
        <button
          onClick={() => setActiveTab('teacher')}
          className={cn("px-4 py-2 rounded-md text-sm font-medium transition-colors", activeTab === 'teacher' ? "bg-white text-primary shadow-sm" : "text-slate-600")}
        >
          Giáo viên
        </button>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input className="pl-9" placeholder="Tìm kiếm theo tên, mã..." />
          </div>
          
          {(activeTab === 'student' || activeTab === 'parent') && (
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <select className="px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary">
                <option value="all">Tất cả các lớp</option>
                <option value="5A">Lớp 5A</option>
              </select>
            </div>
          )}

          <select className="px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary">
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
          </select>
        </div>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Tên đăng nhập</TableHead>
                {activeTab === 'teacher' && <TableHead>Bảo mật</TableHead>}
                {activeTab === 'student' && <TableHead>Lớp học</TableHead>}
                {activeTab === 'parent' && <TableHead>Số điện thoại</TableHead>}
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeTab === 'teacher' && teachers.map(user => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    {user.isDefaultPwd ? <Badge variant="warning">Mật khẩu mặc định</Badge> : <Badge variant="success">Đã đổi MK</Badge>}
                  </TableCell>
                  <TableCell>
                    <Badge variant="success">Hoạt động</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Sửa</Button>
                  </TableCell>
                </TableRow>
              ))}

              {activeTab === 'student' && students.map(user => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.class}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="success">Hoạt động</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" className="text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                      <ArrowRightLeft className="w-3 h-3 mr-1" /> Chuyển lớp
                    </Button>
                    <Button variant="ghost" size="sm">Sửa</Button>
                  </TableCell>
                </TableRow>
              ))}

              {activeTab === 'parent' && parents.map(user => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    <Badge variant="success">Hoạt động</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Sửa</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
