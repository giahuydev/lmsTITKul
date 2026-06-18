import { Bell, CheckCircle2 } from 'lucide-react';

export default function StudentNotifications() {
  const notifications = [
    { id: 1, title: 'Nghỉ học ngày mai do bão', content: 'Các con ở nhà chú ý an toàn nhé, cô sẽ gửi bài tập H5P lên hệ thống.', date: '18/06/2026 08:30', read: false, type: 'NOI_BO', pinned: true },
    { id: 2, title: 'Thưởng nóng 50 Kim cương!', content: 'Cô khen cả lớp hôm qua đã nộp bài đầy đủ và đúng hạn. Mỗi bạn được cộng 50 Kim cương nhé!', date: '17/06/2026 15:00', read: true, type: 'KHEN_THUONG', pinned: false },
    { id: 3, title: 'Nhắc nhở làm bài tập Toán', content: 'Hiện tại vẫn còn 5 bạn chưa nộp bài tập Số Tự Nhiên, các con tranh thủ làm trước 9h tối nay.', date: '16/06/2026 14:20', read: true, type: 'NOI_BO', pinned: false },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center border-2 border-blue-200">
             <Bell className="w-7 h-7 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800">Thông báo</h1>
            <p className="text-slate-500 font-medium mt-1">Em có 1 thông báo chưa đọc</p>
          </div>
        </div>
        <button className="text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors flex items-center">
           <CheckCircle2 className="w-4 h-4 mr-2" />
           Đánh dấu đã đọc tất cả
        </button>
      </div>

      <div className="space-y-4">
        {notifications.map((noti) => (
          <div key={noti.id} className={`bg-white border rounded-2xl p-5 flex items-start transition-colors relative overflow-hidden ${
            noti.read ? 'border-slate-200' : 'border-blue-300 shadow-sm bg-blue-50/30'
          }`}>
             {!noti.read && (
                <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-blue-500"></div>
             )}
             
             <div className="flex-1 ml-2">
               <div className="flex items-center space-x-2 mb-2">
                  {noti.pinned && <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-md flex items-center"><img src="https://img.icons8.com/color/48/pin.png" className="w-3 h-3 mr-1" /> Ghim</span>}
                  {noti.type === 'KHEN_THUONG' && <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-md">Khen thưởng</span>}
                  <span className="text-xs font-semibold text-slate-400">{noti.date}</span>
               </div>
               <h3 className={`text-lg mb-1 ${noti.read ? 'font-semibold text-slate-700' : 'font-bold text-slate-900'}`}>
                 {noti.title}
               </h3>
               <p className={`${noti.read ? 'text-slate-500' : 'text-slate-700'} text-sm leading-relaxed`}>
                 {noti.content}
               </p>
             </div>

             {!noti.read && (
                <div className="w-3 h-3 bg-blue-500 rounded-full shrink-0 ml-4 mt-2"></div>
             )}
          </div>
        ))}
      </div>
    </div>
  );
}
