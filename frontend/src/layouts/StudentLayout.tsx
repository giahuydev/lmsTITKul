import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import { useEffect } from 'react';
import { userService } from '../services/user.service';

export default function StudentLayout() {
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

  return (
    <div className="flex h-screen font-sans bg-slate-50">
      {/* Sidebar Trái - Flat UI */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col z-10">
        <div className="p-6 flex items-center justify-center border-b border-slate-100">
          <Link to="/student" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <span className="text-2xl font-bold text-slate-800 tracking-tight">Titkul Kids</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavLink 
            to="/student"
            end
            className={({ isActive }) => 
              `flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-colors ${
                isActive 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <img src="https://img.icons8.com/color/48/map-marker--v1.png" alt="Bản đồ" className="w-6 h-6" />
            <span>Lộ trình học tập</span>
          </NavLink>

          <NavLink 
            to="/student/tasks"
            className={({ isActive }) => 
              `flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-colors ${
                isActive 
                  ? 'bg-orange-50 text-orange-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <img src="https://img.icons8.com/color/48/todo-list--v1.png" alt="Nhiệm vụ" className="w-6 h-6" />
            <span>Bài tập hôm nay</span>
          </NavLink>

          <NavLink 
            to="/student/rewards"
            className={({ isActive }) => 
              `flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-colors ${
                isActive 
                  ? 'bg-amber-50 text-amber-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <img src="https://img.icons8.com/color/48/trophy.png" alt="Thành tích" className="w-6 h-6" />
            <span>Thành tích</span>
          </NavLink>
        </nav>

        {/* Thông tin nhân vật */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <div className="flex items-center justify-between mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
             <div className="flex items-center">
                <img src="https://img.icons8.com/color/48/diamond.png" alt="Kim cương" className="w-5 h-5 mr-2" />
                <span className="font-bold text-cyan-700">1,250</span>
             </div>
             <div className="flex items-center border-l border-slate-300 pl-3">
                <img src="https://img.icons8.com/color/48/star--v1.png" alt="Sao" className="w-5 h-5 mr-2" />
                <span className="font-bold text-amber-500">42</span>
             </div>
          </div>
          <Link to="/student/profile" className="flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors group cursor-pointer font-medium">
            <div className="flex items-center space-x-3">
               <img src={user?.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4"} alt="Avatar" className="w-8 h-8 rounded-full border border-slate-200 bg-blue-50" />
               <span className="truncate max-w-[120px]">{user?.fullName || user?.username || 'Học sinh'}</span>
            </div>
            <img src="https://img.icons8.com/color/48/gender-neutral-user.png" className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" alt="Profile" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-slate-50">
        {/* Header Phụ */}
        <header className="h-16 flex items-center justify-between px-8 z-20 sticky top-0 bg-white border-b border-slate-200">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm khóa học..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-transparent rounded-lg text-sm focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>
          <div className="flex items-center space-x-4">
             <Link to="/student/notifications" className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors block">
               <Bell className="w-5 h-5" />
               <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
             </Link>
          </div>
        </header>

        {/* Vùng Render Trang Con */}
        <div className="flex-1 overflow-y-auto p-8 relative">
           <Outlet />
        </div>
      </main>
    </div>
  );
}
