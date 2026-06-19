import { useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Settings, BookOpen, 
  FileText, Award, Bell, Upload, LogOut, KeyRound, ShieldCheck, X
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../stores/useAuthStore';
import { userService } from '../services/user.service';

import { cn } from '../lib/utils';

type Role = 'admin' | 'teacher' | 'parent';

export default function DashboardLayout({ role }: { role: Role }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  useEffect(() => {
    if (user?.requirePasswordChange) {
      navigate('/force-change-password');
      return;
    }

    if (user && !user.fullName) {
      userService.getMyProfile()
        .then(data => {
          updateUser({ fullName: data.fullName, avatarUrl: data.avatarUrl || undefined });
        })
        .catch(err => console.error("Failed to fetch profile", err));
    }
  }, [user, navigate, updateUser]);

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
          <div className="mt-4 flex items-center space-x-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
             <img src={user?.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin&backgroundColor=b6e3f4"} alt="Avatar" className="w-10 h-10 rounded-full border border-slate-200 bg-white" />
             <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold text-slate-800 truncate" title={user?.fullName || user?.username}>{user?.fullName || user?.username || 'User'}</span>
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                  {role === 'admin' ? 'Quản trị viên' : role === 'teacher' ? 'Giáo viên' : 'Phụ huynh'}
                </span>
             </div>
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

        <div className="p-4 border-t border-slate-200">
          <Link to={`/${role}/profile`} className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <Settings className="mr-3 h-5 w-5 text-slate-400" />
            Hồ sơ cá nhân
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}
