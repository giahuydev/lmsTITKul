import { useState } from 'react';
import { Search, Filter, ArrowRightLeft, Upload, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { cn } from '../../layouts/DashboardLayout';
import { Link } from 'react-router-dom';

import { adminTeachers, adminStudents, adminParents } from '../../mocks/adminData';

type TabType = 'teacher' | 'student' | 'parent';

export default function AdminUsers() {
  const [activeTab, setActiveTab] = useState<TabType>('student');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const teachers = adminTeachers;
  const students = adminStudents;
  const parents = adminParents;

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
                    <Button variant="ghost" size="sm" onClick={() => { setSelectedUser(user); setShowEditModal(true); }}>Sửa</Button>
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
                    <Button variant="outline" size="sm" className="text-indigo-600 border-indigo-200 hover:bg-indigo-50" onClick={() => { setSelectedUser(user); setShowTransferModal(true); }}>
                      <ArrowRightLeft className="w-3 h-3 mr-1" /> Chuyển lớp
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => { setSelectedUser(user); setShowEditModal(true); }}>Sửa</Button>
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
                    <Button variant="ghost" size="sm" onClick={() => { setSelectedUser(user); setShowEditModal(true); }}>Sửa</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Chuyển Lớp */}
      {showTransferModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-[400px] rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-indigo-50">
              <h3 className="font-bold text-indigo-900">Chuyển Lớp Học Sinh</h3>
              <button onClick={() => setShowTransferModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-slate-500 mb-1">Học sinh:</p>
                <p className="font-bold text-slate-800">{selectedUser.name} ({selectedUser.username})</p>
                <p className="text-sm text-slate-600 mt-1">Lớp hiện tại: <span className="font-medium text-slate-800">{selectedUser.class}</span></p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Chọn lớp mới</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary">
                  <option>Lớp 5B</option>
                  <option>Lớp 5C</option>
                </select>
              </div>
              
              <div className="pt-2 flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowTransferModal(false)}>Hủy bỏ</Button>
                <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setShowTransferModal(false)}>Xác nhận chuyển</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Sửa Tài Khoản */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-[500px] rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">Sửa thông tin Tài khoản</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Họ và tên" defaultValue={selectedUser.name} />
                <Input label="Tên đăng nhập" defaultValue={selectedUser.username} disabled />
              </div>
              
              {activeTab === 'teacher' && (
                <Input label="Số điện thoại" defaultValue={selectedUser.phone} />
              )}
              
              {activeTab === 'parent' && (
                <Input label="Số điện thoại" defaultValue={selectedUser.phone} />
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Trạng thái</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary" defaultValue={selectedUser.status}>
                  <option value="ACTIVE">Đang hoạt động</option>
                  <option value="INACTIVE">Vô hiệu hóa</option>
                </select>
              </div>

              <div className="pt-4 flex justify-between items-center border-t border-slate-100 mt-2">
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">Reset Mật khẩu</Button>
                <div className="space-x-3">
                  <Button variant="ghost" onClick={() => setShowEditModal(false)}>Hủy</Button>
                  <Button onClick={() => setShowEditModal(false)}>Lưu thay đổi</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
