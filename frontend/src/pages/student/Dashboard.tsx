import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Bell, ArrowRight, Loader2 } from 'lucide-react';
import { studentService } from '../../services/student.service';

export default function StudentDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await studentService.getDashboard();
        setDashboardData(data);
      } catch (err) {
        console.error('Failed to fetch dashboard', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

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
                  <span>{dashboardData?.totalXp || 0} / 2,000 XP</span>
               </div>
               <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full w-[62%] rounded-full shadow-[0_0_10px_#fbbf24]"></div>
               </div>
            </div>
          </div>
        </div>
        <img src="https://img.icons8.com/color/240/turtle.png" alt="Mascot" className="w-48 hidden lg:block relative z-10 animate-bounce" />
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (Môn học) */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-black text-slate-800">Danh sách môn học</h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20 text-blue-500">
               <Loader2 className="w-10 h-10 animate-spin" />
            </div>
          ) : !dashboardData?.subjects || dashboardData.subjects.length === 0 ? (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center text-slate-500">
               Chưa có bài học nào được giao.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {dashboardData.subjects.map((sub: any) => (
                <div key={sub.id} className="rounded-2xl p-6 border transition-all hover:shadow-md bg-white border-slate-200 flex flex-col group cursor-pointer hover:-translate-y-1">
                  <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-slate-800 mb-1">{sub.name}</h3>
                        <p className="text-sm text-slate-500 line-clamp-2">{sub.desc || 'Khám phá tri thức'}</p>
                      </div>
                      <img src={sub.icon || "https://img.icons8.com/color/96/book-stack.png"} alt="Icon" className="w-14 h-14 ml-2 shrink-0 group-hover:scale-110 transition-transform" />
                  </div>

                  <div className="mb-6 mt-auto">
                      <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                        <span>Tiến trình học</span>
                        <span className="text-amber-500">{sub.progress}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full overflow-hidden bg-slate-100">
                        <div className="bg-green-400 h-full rounded-full" style={{ width: `${sub.progress}%` }}></div>
                      </div>
                  </div>

                  <Link to={`/student/subject/${sub.id}`} className="block">
                      <button className="w-full py-3 rounded-xl font-bold transition-colors flex items-center justify-center bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-100 hover:border-blue-600">
                        Tiếp tục học <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                  </Link>
                </div>
              ))}
            </div>
          )}
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
                 {dashboardData?.upcomingTasks?.map((task: any) => (
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
                 {(!dashboardData?.upcomingTasks || dashboardData.upcomingTasks.length === 0) && <p className="text-sm text-slate-500 text-center py-2">Em không có bài tập nào sắp đến hạn!</p>}
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
                 {dashboardData?.recentNotifications?.map((noti: any) => (
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
