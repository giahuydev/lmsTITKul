import { Link } from 'react-router-dom';
import { Clock, Bell, ArrowRight } from 'lucide-react';

export default function StudentDashboard() {
  const subjects = [
    { id: 'math', name: 'Toán Học', desc: 'Khám phá thế giới của những con số', icon: 'https://img.icons8.com/color/96/calculator--v1.png', color: 'bg-white border-slate-200 text-blue-700', btnColor: 'bg-blue-50 text-blue-600 hover:bg-blue-100', trackColor: 'bg-slate-100', barColor: 'bg-blue-500', progress: 60 },
    { id: 'viet', name: 'Tiếng Việt', desc: 'Luyện đọc và viết chữ thật hay', icon: 'https://img.icons8.com/color/96/books.png', color: 'bg-white border-slate-200 text-orange-700', btnColor: 'bg-orange-50 text-orange-600 hover:bg-orange-100', trackColor: 'bg-slate-100', barColor: 'bg-orange-500', progress: 85 },
    { id: 'science', name: 'Tự nhiên Xã hội', desc: 'Tìm hiểu về thế giới quanh ta', icon: 'https://img.icons8.com/color/96/globe--v1.png', color: 'bg-white border-slate-200 text-green-700', btnColor: 'bg-green-50 text-green-600 hover:bg-green-100', trackColor: 'bg-slate-100', barColor: 'bg-green-500', progress: 20 }
  ];

  const upcomingTasks = [
    { id: 1, title: 'Luyện tập phép cộng trừ', subject: 'Toán', time: '3 giờ nữa' },
    { id: 2, title: 'Tả con vật nuôi', subject: 'Tiếng Việt', time: 'Ngày mai' }
  ];

  const recentNotifications = [
    { id: 1, title: 'Nghỉ học ngày mai do bão', isNew: true },
    { id: 2, title: 'Thưởng nóng 50 Kim cương!', isNew: false }
  ];

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Banner Flat UI */}
      <div className="bg-blue-600 rounded-3xl p-8 mb-8 text-white shadow-sm flex items-center justify-between overflow-hidden relative">
        <div className="relative z-10">
          <h1 className="text-3xl font-black mb-3">Chào em, hôm nay mình học gì?</h1>
          <p className="text-blue-100 mb-6 font-medium">Hãy chọn một môn học bên dưới để tiếp tục lộ trình nhé.</p>
          <div className="flex flex-wrap gap-3">
            <div className="inline-flex bg-blue-700/50 px-4 py-2 rounded-xl font-bold border border-blue-500/50 items-center">
              <img src="https://img.icons8.com/color/48/fire-element--v1.png" className="w-5 h-5 mr-2" alt="Chuỗi ngày" />
              Chuỗi 5 ngày!
            </div>
            {/* Thanh Level / XP */}
            <div className="inline-flex flex-col bg-white/10 px-4 py-2 rounded-xl border border-white/20 min-w-[200px]">
               <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Level 5: Sóc Nhanh Nhẹn</span>
                  <span>1,250 / 2,000 XP</span>
               </div>
               <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full w-[62%] rounded-full shadow-[0_0_10px_#fbbf24]"></div>
               </div>
            </div>
          </div>
        </div>
        <img src="https://img.icons8.com/color/240/turtle.png" alt="Mascot" className="w-48 hidden lg:block relative z-10" />
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (Môn học) */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-black text-slate-800">Danh sách môn học</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {subjects.map((sub) => (
              <div key={sub.id} className="rounded-2xl p-6 border transition-all hover:shadow-md bg-white border-slate-200 flex flex-col group cursor-pointer hover:-translate-y-1">
                 <div className="flex justify-between items-start mb-6">
                    <div>
                       <h3 className="text-xl font-bold text-slate-800 mb-1">{sub.name}</h3>
                       <p className="text-sm text-slate-500 line-clamp-2">{sub.desc}</p>
                    </div>
                    <img src={sub.icon} alt={sub.name} className="w-14 h-14 ml-2 shrink-0 group-hover:scale-110 transition-transform" />
                 </div>

                 <div className="mb-6 mt-auto">
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                       <span>Tiến độ</span>
                       <span className="text-slate-700">{sub.progress}%</span>
                    </div>
                    <div className={`w-full h-2 rounded-full overflow-hidden ${sub.trackColor}`}>
                       <div className={`${sub.barColor} h-full rounded-full transition-all duration-1000 ease-out`} style={{ width: `${sub.progress}%` }}></div>
                    </div>
                 </div>

                 <Link to={`/student/subject/${sub.id}`} className="block">
                    <button className={`w-full py-3 rounded-xl font-bold transition-colors flex items-center justify-center ${sub.btnColor}`}>
                      Tiếp tục học <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                 </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Widgets (To-do & Notifications) */}
        <div className="space-y-6">
           {/* Widget: Bài tập sắp đến hạn */}
           <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                 <h2 className="text-lg font-black text-slate-800 flex items-center">
                    <Clock className="w-5 h-5 text-orange-500 mr-2" /> Cần làm ngay
                 </h2>
                 <Link to="/student/tasks" className="text-sm font-bold text-blue-600 hover:text-blue-800">Tất cả</Link>
              </div>
              <div className="space-y-3">
                 {upcomingTasks.map(task => (
                    <Link to="/student/tasks" key={task.id} className="block p-3 rounded-xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50 transition-colors group">
                       <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-slate-700 group-hover:text-orange-700 text-sm line-clamp-1">{task.title}</h3>
                       </div>
                       <div className="flex justify-between items-center text-xs font-semibold">
                          <span className="text-slate-500">{task.subject}</span>
                          <span className="text-orange-600 bg-orange-100 px-2 py-0.5 rounded">{task.time}</span>
                       </div>
                    </Link>
                 ))}
                 {upcomingTasks.length === 0 && <p className="text-sm text-slate-500 text-center py-2">Em không có bài tập nào sắp đến hạn!</p>}
              </div>
           </div>

           {/* Widget: Thông báo mới */}
           <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                 <h2 className="text-lg font-black text-slate-800 flex items-center">
                    <Bell className="w-5 h-5 text-blue-500 mr-2" /> Thông báo mới
                 </h2>
                 <Link to="/student/notifications" className="text-sm font-bold text-blue-600 hover:text-blue-800">Tất cả</Link>
              </div>
              <div className="space-y-3">
                 {recentNotifications.map(noti => (
                    <Link to="/student/notifications" key={noti.id} className="block p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors group relative overflow-hidden">
                       {noti.isNew && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>}
                       <h3 className={`text-sm line-clamp-2 ${noti.isNew ? 'font-bold text-slate-800' : 'font-semibold text-slate-600'}`}>{noti.title}</h3>
                    </Link>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
