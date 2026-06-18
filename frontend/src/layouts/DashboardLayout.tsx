import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Settings, BookOpen, 
  FileText, Award, Bell, Upload, LogOut, KeyRound, ShieldCheck, X
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

type Role = 'admin' | 'teacher' | 'parent';

export default function DashboardLayout({ role }: { role: Role }) {
  const location = useLocation();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [otpStep, setOtpStep] = useState(false);

  const navItems = {
    admin: [
      { name: 'Tổng quan', path: '/admin', icon: LayoutDashboard },
      { name: 'Tài khoản', path: '/admin/users', icon: Users },
      { name: 'Phiếu hỗ trợ', path: '/admin/tickets', icon: Bell },
      { name: 'Import dữ liệu', path: '/admin/import', icon: Upload },
      { name: 'Lớp học', path: '/admin/classes', icon: BookOpen },
      { name: 'Cấu hình', path: '/admin/settings', icon: Settings },
    ],
    teacher: [
      { name: 'Tổng quan', path: '/teacher', icon: LayoutDashboard },
      { name: 'Lớp học', path: '/teacher/classes', icon: Users },
      { name: 'Bảng tin', path: '/teacher/announcements', icon: Bell },
      { name: 'Kho học liệu', path: '/teacher/materials', icon: BookOpen },
      { name: 'Giao bài tập', path: '/teacher/assignments', icon: FileText },
      { name: 'Chấm bài', path: '/teacher/grading', icon: Award },
      { name: 'Sổ điểm', path: '/teacher/reports', icon: FileText },
    ],
    parent: [
      { name: 'Tổng quan', path: '/parent', icon: LayoutDashboard },
      { name: 'Hồ sơ con', path: '/parent/children', icon: Users },
      { name: 'Bảng điểm', path: '/parent/grades', icon: Award },
    ]
  };

  const items = navItems[role];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <span className="text-xl font-bold text-slate-800">Titkul Kids</span>
          </div>
          <div className="mt-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
            {role === 'admin' ? 'Quản trị viên' : role === 'teacher' ? 'Giáo viên' : 'Phụ huynh'}
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
              (item.path !== `/${role}` && location.pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors group",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon className={cn(
                  "mr-3 h-5 w-5 transition-colors",
                  isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-600"
                )} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-slate-600 hover:text-slate-900"
            onClick={() => setShowPasswordModal(true)}
          >
            <KeyRound className="mr-2 h-4 w-4 text-slate-400" /> Đổi mật khẩu
          </Button>
          <Link to="/login" className="block w-full">
            <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
              <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-[400px] rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center">
                <ShieldCheck className="w-5 h-5 mr-2 text-indigo-600" /> Đổi mật khẩu (QT01.2)
              </h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {!otpStep ? (
                <>
                  <Input label="Mật khẩu cũ" type="password" placeholder="Nhập mật khẩu hiện tại" />
                  <Input label="Mật khẩu mới" type="password" placeholder="Tối thiểu 6 ký tự" />
                  <Input label="Xác nhận mật khẩu mới" type="password" placeholder="Nhập lại mật khẩu mới" />
                  <Button className="w-full mt-2" onClick={() => setOtpStep(true)}>Tiếp tục</Button>
                </>
              ) : (
                <>
                  <div className="text-center mb-4">
                    <p className="text-sm text-slate-600">Một mã OTP gồm 6 chữ số đã được gửi đến email của bạn.</p>
                    <p className="text-xs text-indigo-600 font-medium mt-1">Mã có hiệu lực trong 1 phút.</p>
                  </div>
                  <Input label="Mã OTP" placeholder="Ví dụ: 123456" className="text-center text-lg tracking-widest" />
                  <Button className="w-full mt-2 bg-green-600 hover:bg-green-700" onClick={() => setShowPasswordModal(false)}>Xác nhận đổi mật khẩu</Button>
                  <Button variant="ghost" className="w-full text-sm text-slate-500 mt-1" onClick={() => setOtpStep(false)}>Quay lại</Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
