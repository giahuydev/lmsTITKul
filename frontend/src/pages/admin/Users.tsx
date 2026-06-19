import { useState, useEffect } from 'react';
import { Search, Filter, ArrowRightLeft, Upload, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

import { adminService } from '../../services/admin.service';
import { classService } from '../../services/class.service';

type TabType = 'teacher' | 'student' | 'parent';

export default function AdminUsers() {
  const [activeTab, setActiveTab] = useState<TabType>('student');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [users, setUsers] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [transferClassId, setTransferClassId] = useState('');
  const [editFormData, setEditFormData] = useState({ phone: '', status: '' });
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    role: 'HOC_SINH',
    username: '',
    fullName: '',
    dateOfBirth: '',
    department: '',
    phone: '',
    classId: '',
    parentName: '',
    parentPhone: ''
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [usersData, classesData] = await Promise.all([
        adminService.getAllUsers(),
        classService.getAllClasses()
      ]);
      setUsers(usersData);
      setClasses(classesData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleStatus = async (userId: number) => {
    try {
      await adminService.toggleUserStatus(userId);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi đổi trạng thái');
    }
  };

  const handleTransferClass = async () => {
    if (!transferClassId) return;
    setIsTransferring(true);
    try {
      await adminService.transferClass(selectedUser.id, parseInt(transferClassId));
      alert('Chuyển lớp thành công!');
      setShowTransferModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi chuyển lớp');
    } finally {
      setIsTransferring(false);
    }
  };

  const handleUpdateUser = async () => {
    setIsUpdating(true);
    try {
      await adminService.updateUser(selectedUser.id, editFormData);
      alert('Cập nhật tài khoản thành công!');
      setShowEditModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi cập nhật');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const payload: any = { ...createFormData };
      if (payload.role === 'HOC_SINH' && payload.classId) {
        payload.classId = parseInt(payload.classId);
      }
      await adminService.createUser(payload);
      alert('Tạo tài khoản thành công!');
      setShowCreateModal(false);
      setCreateFormData({
        role: 'HOC_SINH', username: '', fullName: '', dateOfBirth: '', 
        department: '', phone: '', classId: '', parentName: '', parentPhone: ''
      });
      fetchData();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi tạo tài khoản');
    } finally {
      setIsCreating(false);
    }
  };

  const openEditModal = (user: any) => {
    setSelectedUser(user);
    setEditFormData({ phone: user.phone || '', status: user.status });
    setShowEditModal(true);
  };
  
  const openTransferModal = (user: any) => {
    setSelectedUser(user);
    setTransferClassId('');
    setShowTransferModal(true);
  };

  const openDetailModal = (user: any) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterClassId, setFilterClassId] = useState('all');

  const filteredUsers = users.filter((u) => {
    let matchTab = false;
    if (activeTab === 'student') matchTab = u.role === 'HOC_SINH';
    if (activeTab === 'teacher') matchTab = u.role === 'GIAO_VIEN';
    if (activeTab === 'parent') matchTab = u.role === 'PHU_HUYNH';
    
    if (!matchTab) return false;

    const nameToMatch = u.fullName ? u.fullName : u.username;
    const matchSearch = nameToMatch.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        u.username.toLowerCase().includes(searchQuery.toLowerCase());
                        
    const matchStatus = filterStatus === 'all' || u.status === filterStatus;
    
    let matchClass = true;
    if ((activeTab === 'student' || activeTab === 'parent') && filterClassId !== 'all') {
      const classIdNum = parseInt(filterClassId);
      matchClass = u.classIds && u.classIds.includes(classIdNum);
    }
    
    return matchSearch && matchStatus && matchClass;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản lý Tài khoản</h1>
          <p className="text-xs text-slate-400 mt-1">
            Debug: {users.filter(u => u.role === 'PHU_HUYNH').map(u => u.username + ":" + (u.classIds ? u.classIds.join(',') : 'null')).slice(0, 5).join(' | ')}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setShowCreateModal(true)}>
            + Tạo tài khoản
          </Button>
          <Link to="/admin/import">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import Excel
            </Button>
          </Link>
        </div>
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
            <Input 
              className="pl-9" 
              placeholder="Tìm kiếm theo tên, mã..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {(activeTab === 'student' || activeTab === 'parent') && (
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <select 
                className="px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary"
                value={filterClassId}
                onChange={(e) => setFilterClassId(e.target.value)}
              >
                <option value="all">Tất cả các lớp</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id.toString()}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          <select 
            className="px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="ACTIVE">Hoạt động</option>
            <option value="LOCKED">Bị khóa</option>
          </select>
        </div>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Tên đăng nhập</TableHead>
                {activeTab === 'teacher' && <TableHead>Bảo mật</TableHead>}
                {activeTab === 'student' && <TableHead>Email</TableHead>}
                {activeTab === 'parent' && <TableHead>Số điện thoại</TableHead>}
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeTab === 'teacher' && filteredUsers.map(user => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    {user.requirePasswordChange ? <Badge variant="warning">Mật khẩu mặc định</Badge> : <Badge variant="success">Đã đổi MK</Badge>}
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'ACTIVE' ? "success" : "destructive"}>{user.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openDetailModal(user)}>Chi tiết</Button>
                    <Button variant="outline" size="sm" onClick={() => handleToggleStatus(user.id)}>Đổi trạng thái</Button>
                    <Button variant="ghost" size="sm" onClick={() => openEditModal(user)}>Sửa</Button>
                  </TableCell>
                </TableRow>
              ))}

              {activeTab === 'student' && filteredUsers.map(user => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.fullName || user.username}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-500">{user.email || 'Chưa có'}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'ACTIVE' ? "success" : "destructive"}>{user.status === 'ACTIVE' ? 'Hoạt động' : 'Bị khóa'}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openDetailModal(user)}>Chi tiết</Button>
                    <Button variant="outline" size="sm" onClick={() => openTransferModal(user)}>Chuyển lớp</Button>
                    <Button variant="outline" size="sm" onClick={() => handleToggleStatus(user.id)}>Đổi trạng thái</Button>
                    <Button variant="ghost" size="sm" onClick={() => openEditModal(user)}>Sửa</Button>
                  </TableCell>
                </TableRow>
              ))}

              {activeTab === 'parent' && filteredUsers.map(user => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.fullName || user.username}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.phone || 'Chưa có'}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'ACTIVE' ? "success" : "destructive"}>{user.status === 'ACTIVE' ? 'Hoạt động' : 'Bị khóa'}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openDetailModal(user)}>Chi tiết</Button>
                    <Button variant="outline" size="sm" onClick={() => handleToggleStatus(user.id)}>Đổi trạng thái</Button>
                    <Button variant="ghost" size="sm" onClick={() => openEditModal(user)}>Sửa</Button>
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
                <p className="font-bold text-slate-800">{selectedUser.fullName || selectedUser.name} ({selectedUser.username})</p>
                <p className="text-sm text-slate-600 mt-1">Lớp hiện tại: <span className="font-medium text-slate-800">{selectedUser.className || 'Chưa phân lớp'}</span></p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Chọn lớp mới</label>
                <select 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary"
                  value={transferClassId}
                  onChange={(e) => setTransferClassId(e.target.value)}
                >
                  <option value="">-- Chọn lớp --</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name} (Khối {c.grade})</option>
                  ))}
                </select>
              </div>
              
              <div className="pt-2 flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowTransferModal(false)}>Hủy bỏ</Button>
                <Button 
                  className="bg-indigo-600 hover:bg-indigo-700" 
                  onClick={handleTransferClass}
                  isLoading={isTransferring}
                  disabled={!transferClassId}
                >
                  Xác nhận chuyển
                </Button>
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
                <Input label="Họ và tên" defaultValue={selectedUser.fullName || selectedUser.name} disabled />
                <Input label="Tên đăng nhập" defaultValue={selectedUser.username} disabled />
              </div>
              
              {(activeTab === 'teacher' || activeTab === 'parent') && (
                <Input 
                  label="Số điện thoại" 
                  value={editFormData.phone} 
                  onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                />
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Trạng thái</label>
                <select 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary" 
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                >
                  <option value="ACTIVE">Hoạt động</option>
                  <option value="LOCKED">Bị khóa</option>
                </select>
              </div>

              <div className="pt-4 flex justify-between items-center border-t border-slate-100 mt-2">
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">Khôi phục Mật khẩu</Button>
                <div className="space-x-3">
                  <Button variant="ghost" onClick={() => setShowEditModal(false)}>Hủy</Button>
                  <Button onClick={handleUpdateUser} isLoading={isUpdating}>Lưu thay đổi</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Thêm Mới Tài Khoản */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-[500px] rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">Thêm mới Tài khoản</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Loại tài khoản</label>
                <select 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary"
                  value={createFormData.role}
                  onChange={(e) => setCreateFormData({...createFormData, role: e.target.value})}
                  required
                >
                  <option value="HOC_SINH">Học sinh</option>
                  <option value="GIAO_VIEN">Giáo viên</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label={createFormData.role === 'GIAO_VIEN' ? 'Mã GV' : 'Mã Học sinh'} 
                  required 
                  value={createFormData.username}
                  onChange={(e) => setCreateFormData({...createFormData, username: e.target.value})}
                />
                <Input 
                  label="Họ và tên" 
                  required 
                  value={createFormData.fullName}
                  onChange={(e) => setCreateFormData({...createFormData, fullName: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Ngày sinh</label>
                  <input 
                    type="date"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    value={createFormData.dateOfBirth}
                    onChange={(e) => setCreateFormData({...createFormData, dateOfBirth: e.target.value})}
                  />
                </div>
                {createFormData.role === 'GIAO_VIEN' && (
                  <Input 
                    label="Số điện thoại" 
                    value={createFormData.phone}
                    onChange={(e) => setCreateFormData({...createFormData, phone: e.target.value})}
                  />
                )}
                {createFormData.role === 'HOC_SINH' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Lớp học</label>
                    <select 
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      value={createFormData.classId}
                      onChange={(e) => setCreateFormData({...createFormData, classId: e.target.value})}
                      required
                    >
                      <option value="">-- Chọn lớp --</option>
                      {classes.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {createFormData.role === 'GIAO_VIEN' && (
                <Input 
                  label="Bộ môn giảng dạy" 
                  value={createFormData.department}
                  onChange={(e) => setCreateFormData({...createFormData, department: e.target.value})}
                />
              )}

              {createFormData.role === 'HOC_SINH' && (
                <div className="border-t border-slate-100 pt-4 mt-4">
                  <h4 className="font-semibold text-sm text-slate-800 mb-3">Thông tin Phụ huynh (Tùy chọn)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      label="Số ĐT Phụ huynh" 
                      placeholder="Dùng làm tài khoản"
                      value={createFormData.parentPhone}
                      onChange={(e) => setCreateFormData({...createFormData, parentPhone: e.target.value})}
                    />
                    <Input 
                      label="Tên Phụ huynh" 
                      value={createFormData.parentName}
                      onChange={(e) => setCreateFormData({...createFormData, parentName: e.target.value})}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2 italic">
                    Hệ thống sẽ tự động tạo tài khoản Phụ huynh nếu SĐT này chưa tồn tại.
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
                <Button type="button" variant="ghost" onClick={() => setShowCreateModal(false)}>Hủy</Button>
                <Button type="submit" isLoading={isCreating}>Khởi tạo Tài khoản</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">Chi tiết tài khoản</h3>
              <button onClick={() => setShowDetailModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500">Tên đăng nhập:</span>
                <span className="col-span-2 font-medium">{selectedUser.username}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500">Họ và tên:</span>
                <span className="col-span-2 font-medium">{selectedUser.fullName || 'Chưa cập nhật'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500">Vai trò:</span>
                <span className="col-span-2 font-medium">
                  {selectedUser.role === 'HOC_SINH' ? 'Học sinh' : selectedUser.role === 'GIAO_VIEN' ? 'Giáo viên' : 'Phụ huynh'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500">Email:</span>
                <span className="col-span-2 font-medium">{selectedUser.email || 'Chưa cập nhật'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500">Số điện thoại:</span>
                <span className="col-span-2 font-medium">{selectedUser.phone || 'Chưa cập nhật'}</span>
              </div>
              {selectedUser.className && (
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500">Lớp học:</span>
                  <span className="col-span-2 font-medium">{selectedUser.className}</span>
                </div>
              )}
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500">Trạng thái:</span>
                <span className="col-span-2">
                  <Badge variant={selectedUser.status === 'ACTIVE' ? "success" : "destructive"}>
                    {selectedUser.status === 'ACTIVE' ? 'Hoạt động' : 'Bị khóa'}
                  </Badge>
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500">Ngày tạo:</span>
                <span className="col-span-2 font-medium">
                  {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString('vi-VN') : 'Chưa cập nhật'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500">Đăng nhập l/c:</span>
                <span className="col-span-2 font-medium">
                  {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString('vi-VN') : 'Chưa đăng nhập'}
                </span>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>Đóng</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
