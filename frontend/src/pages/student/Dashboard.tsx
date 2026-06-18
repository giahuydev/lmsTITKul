import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  const subjects = [
    { 
      id: 'math', 
      name: 'Toán Học', 
      desc: 'Khám phá thế giới của những con số',
      icon: 'https://img.icons8.com/3d-fluency/94/calculator.png',
      color: 'bg-blue-100 border-blue-200 text-blue-700',
      btnColor: 'bg-blue-500 hover:bg-blue-600',
      progress: 60
    },
    { 
      id: 'viet', 
      name: 'Tiếng Việt', 
      desc: 'Luyện đọc và viết chữ thật hay',
      icon: 'https://img.icons8.com/3d-fluency/94/books.png',
      color: 'bg-orange-100 border-orange-200 text-orange-700',
      btnColor: 'bg-orange-500 hover:bg-orange-600',
      progress: 85
    },
    { 
      id: 'science', 
      name: 'Tự nhiên Xã hội', 
      desc: 'Tìm hiểu về thế giới quanh ta',
      icon: 'https://img.icons8.com/3d-fluency/94/globe.png',
      color: 'bg-green-100 border-green-200 text-green-700',
      btnColor: 'bg-green-500 hover:bg-green-600',
      progress: 20
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl p-8 mb-10 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 w-2/3">
          <h1 className="text-4xl font-black mb-4">Chào An, Hôm nay mình học gì nhỉ?</h1>
          <p className="text-lg text-blue-100 font-medium mb-6">Hãy chọn một Vùng đất tri thức bên dưới để bắt đầu cuộc hành trình khám phá ngày hôm nay nhé!</p>
          <div className="inline-flex bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl font-bold">
            <img src="https://img.icons8.com/color/48/fire-element--v1.png" className="w-6 h-6 mr-2" alt="Chuỗi ngày" />
            Đang giữ chuỗi học tập 5 ngày liên tiếp!
          </div>
        </div>
        {/* Decor */}
        <img src="https://img.icons8.com/3d-fluency/250/school-boy.png" alt="Mascot" className="absolute -right-10 -bottom-10 w-80 opacity-90 drop-shadow-2xl" />
        <div className="absolute top-10 right-80 w-16 h-16 bg-yellow-300 rounded-full blur-2xl opacity-60"></div>
      </div>

      <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center">
        <img src="https://img.icons8.com/color/48/compass--v1.png" className="w-8 h-8 mr-3" alt="La bàn" />
        Vùng Đất Các Môn Học
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {subjects.map((sub) => (
          <div key={sub.id} className={`bg-white rounded-3xl p-6 border-2 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group ${sub.color}`}>
             {/* Background blur shape */}
             <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/40 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

             <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                   <h3 className="text-2xl font-black mb-1">{sub.name}</h3>
                   <p className="text-sm font-medium opacity-80">{sub.desc}</p>
                </div>
                <img src={sub.icon} alt={sub.name} className="w-20 h-20 drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
             </div>

             <div className="mb-6 relative z-10">
                <div className="flex justify-between text-sm font-bold mb-2">
                   <span>Tiến trình khám phá</span>
                   <span>{sub.progress}%</span>
                </div>
                <div className="w-full h-3 bg-white/60 rounded-full overflow-hidden border border-white/50">
                   <div className={`${sub.btnColor} h-full rounded-full`} style={{ width: `${sub.progress}%` }}></div>
                </div>
             </div>

             <Link to={`/student/subject/${sub.id}`} className="relative z-10">
                <button className={`w-full py-4 rounded-2xl text-white font-black shadow-md transition-transform active:scale-95 flex items-center justify-center ${sub.btnColor}`}>
                  <img src="https://img.icons8.com/color/48/treasure-map.png" className="w-6 h-6 mr-2" alt="Mở bản đồ" />
                  Mở Bản Đồ
                </button>
             </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
