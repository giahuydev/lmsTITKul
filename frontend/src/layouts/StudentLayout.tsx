import { Outlet, NavLink, Link } from 'react-router-dom';
import { LogOut, Bell, Search } from 'lucide-react';

export default function StudentLayout() {
  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar Trái */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm z-10">
        <div className="p-6 flex items-center justify-center border-b border-slate-100">
          <Link to="/student" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center border-2 border-blue-500 group-hover:bg-blue-500 transition-colors">
              <span className="text-blue-600 font-black text-xl group-hover:text-white">T</span>
            </div>
            <span className="text-2xl font-black text-slate-800 tracking-tight">Titkul Kids</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavLink 
            to="/student"
            end
            className={({ isActive }) => 
              `flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all font-bold ${
                isActive ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`
            }
          >
            <img src="https://img.icons8.com/color/48/map-marker--v1.png" alt="Bản đồ" className="w-6 h-6" />
            <span>Bản đồ Học tập</span>
          </NavLink>

          <NavLink 
            to="/student/tasks"
            className={({ isActive }) => 
              `flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all font-bold ${
                isActive ? 'bg-orange-50 text-orange-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`
            }
          >
            <img src="https://img.icons8.com/color/48/todo-list--v1.png" alt="Nhiệm vụ" className="w-6 h-6" />
            <span>Nhiệm vụ Hôm nay</span>
          </NavLink>

          <NavLink 
            to="/student/rewards"
            className={({ isActive }) => 
              `flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all font-bold ${
                isActive ? 'bg-amber-50 text-amber-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`
            }
          >
            <img src="https://img.icons8.com/color/48/trophy.png" alt="Thành tích" className="w-6 h-6" />
            <span>Tủ Thành tích</span>
          </NavLink>
        </nav>

        {/* Thông tin nhân vật */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between mb-3 bg-white p-2 rounded-xl shadow-sm border border-slate-100">
             <div className="flex items-center">
                <img src="https://img.icons8.com/color/48/diamond.png" alt="Kim cương" className="w-6 h-6 mr-2" />
                <span className="font-black text-cyan-600 text-lg">1,250</span>
             </div>
             <div className="flex items-center border-l border-slate-200 pl-3">
                <img src="https://img.icons8.com/color/48/star--v1.png" alt="Sao" className="w-6 h-6 mr-1" />
                <span className="font-black text-amber-500 text-lg">42</span>
             </div>
          </div>
          <Link to="/login" className="flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-xl hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors group cursor-pointer">
            <div className="flex items-center space-x-3">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4" alt="Avatar" className="w-8 h-8 rounded-full border border-slate-200 bg-blue-50" />
               <span className="font-bold text-slate-700 group-hover:text-red-600">Bé An</span>
            </div>
            <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-500" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-slate-50">
        {/* Header Phụ */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 z-10 sticky top-0">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm bài học..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm font-medium focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
          </div>
          <div className="flex items-center space-x-4">
             <button className="relative p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-colors">
               <Bell className="w-5 h-5" />
               <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
             </button>
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
