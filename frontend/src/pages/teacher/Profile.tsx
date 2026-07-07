import { useState, useEffect } from 'react';
import { LogOut, KeyRound, ShieldCheck, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { useNavigate } from 'react-router-dom';
import { userService, type TeacherDashboardDto } from '../../services/user.service';
import { authService } from '../../services/auth.service';
import { useAuthStore } from '../../stores/useAuthStore';
import toast from 'react-hot-toast';

export default function TeacherProfile() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const [dashboard, setDashboard] = useState<TeacherDashboardDto | null>(null);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    userService.getTeacherDashboard()
      .then(data => setDashboard(data))
      .catch(err => console.error("Lỗi lấy dashboard giáo viên", err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.changePassword(oldPassword, newPassword);
      toast.success('Đổi mật khẩu thành công!');
      setShowPasswordModal(false);
      setOldPassword('');
      setNewPassword('');
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Hồ sơ Giáo viên</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Khối thông tin chung */}
        <Card className="md:col-span-1">
          <CardContent className="p-6 flex flex-col items-center text-center">
            {user?.avatarUrl ? (
               <img src={user.avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-white shadow-md mb-4 object-cover" />
            ) : (
               <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-3xl font-bold mb-4">
                 GV
               </div>
            )}
            <h2 className="text-xl font-bold text-slate-800">{dashboard?.fullName || user?.fullName || 'Đang tải...'}</h2>
            <p className="text-slate-500 font-medium mt-1">Giáo viên</p>
            <div className="w-full mt-6 space-y-3">
              <Button variant="outline" className="w-full justify-center" onClick={() => setShowPasswordModal(true)}>
                <KeyRound className="w-4 h-4 mr-2" /> Đổi mật khẩu
              </Button>
              <Button variant="outline" className="w-full justify-center text-red-600 border-red-200 hover:bg-red-50" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" /> Đăng xuất
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Khối thông tin chuyên môn */}
        <Card className="md:col-span-2">
          <CardHeader>
             <CardTitle>Thông tin Công tác</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
               <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-sm text-slate-500 font-semibold mb-1">Tổ chuyên môn</p>
                  <p className="text-lg font-bold text-slate-800">{dashboard?.department || '----'}</p>
               </div>
               <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-sm text-slate-500 font-semibold mb-1">Lớp chủ nhiệm</p>
                  <p className="text-lg font-bold text-slate-800">{dashboard?.homeroomClass || 'Không có'}</p>
               </div>
             </div>

             <h3 className="font-bold text-slate-700 mt-6 mb-2">Thống kê hoạt động</h3>
             <div className="space-y-3">
               <div className="flex justify-between items-center p-3 border border-slate-200 rounded-lg">
                  <span className="font-semibold text-slate-700">Tổng số học liệu đã tạo</span>
                  <span className="font-bold text-indigo-600 text-lg">{dashboard?.totalMaterials?.toLocaleString() || '0'}</span>
               </div>
               <div className="flex justify-between items-center p-3 border border-slate-200 rounded-lg">
                  <span className="font-semibold text-slate-700">Tổng số bài tập đã giao</span>
                  <span className="font-bold text-indigo-600 text-lg">{dashboard?.totalAssignments?.toLocaleString() || '0'}</span>
               </div>
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-[400px] rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center">
                <ShieldCheck className="w-5 h-5 mr-2 text-indigo-600" /> Đổi mật khẩu
              </h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm text-center">
                  {error}
                </div>
              )}
              <Input 
                label="Mật khẩu cũ" 
                type="password" 
                placeholder="Nhập mật khẩu hiện tại" 
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
              <Input 
                label="Mật khẩu mới" 
                type="password" 
                placeholder="Tối thiểu 6 ký tự" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <Button type="submit" className="w-full mt-2" disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Xác nhận đổi mật khẩu'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
