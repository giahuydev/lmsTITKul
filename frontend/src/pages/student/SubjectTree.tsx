import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function SubjectTree() {
  const { subjectId } = useParams();

  // Dữ liệu Mock cho Cây môn học
  const chapters = [
    {
      id: 1,
      title: 'Chương 1: Số Tự Nhiên',
      icon: 'https://img.icons8.com/3d-fluency/94/1-circle.png',
      lessons: [
        { id: 101, title: 'Ôn tập các số đến 100,000', type: 'video', status: 'completed' },
        { id: 102, title: 'Biểu thức có chứa một chữ', type: 'h5p', status: 'completed' },
        { id: 103, title: 'Các số có sáu chữ số', type: 'h5p', status: 'current' },
        { id: 104, title: 'Kiểm tra Chương 1', type: 'quiz', status: 'locked' }
      ]
    },
    {
      id: 2,
      title: 'Chương 2: Bốn Phép Tính',
      icon: 'https://img.icons8.com/3d-fluency/94/math.png',
      lessons: [
        { id: 201, title: 'Phép cộng', type: 'h5p', status: 'locked' },
        { id: 202, title: 'Phép trừ', type: 'h5p', status: 'locked' },
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <Link to="/student" className="inline-flex items-center text-blue-600 font-bold hover:text-blue-800 mb-8 bg-blue-50 px-4 py-2 rounded-full transition-colors">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Quay lại Trang Chủ
      </Link>

      <div className="flex items-center mb-10">
        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mr-4 border-2 border-blue-200">
           <img src="https://img.icons8.com/3d-fluency/94/calculator.png" alt="Toán" className="w-10 h-10" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-800">Toán Học (Lớp 4)</h1>
          <p className="text-slate-500 font-medium">Bạn đã hoàn thành 2/12 bài học</p>
        </div>
      </div>

      <div className="space-y-12">
        {chapters.map((chapter) => (
          <div key={chapter.id} className="relative">
            {/* Tiêu đề Chương */}
            <div className="flex items-center mb-6">
               <img src={chapter.icon} alt={chapter.title} className="w-12 h-12 mr-4 drop-shadow-md z-10" />
               <h2 className="text-2xl font-black text-slate-700 bg-white px-4 py-2 border-2 border-slate-200 rounded-2xl shadow-sm z-10">
                 {chapter.title}
               </h2>
            </div>

            {/* Trục chính của Cây */}
            <div className="absolute left-6 top-12 bottom-0 w-1.5 bg-slate-200 rounded-full"></div>

            {/* Các nhánh (Bài học) */}
            <div className="space-y-6 ml-14 relative">
               {chapter.lessons.map((lesson, idx) => (
                 <div key={lesson.id} className="relative flex items-center group">
                    {/* Đường rẽ nhánh */}
                    <div className="absolute -left-8 top-1/2 w-8 h-1.5 bg-slate-200 rounded-l-full"></div>

                    {/* Node Cột mốc */}
                    <div className={`absolute -left-[39px] w-6 h-6 rounded-full border-4 z-10 ${
                      lesson.status === 'completed' ? 'bg-green-500 border-green-200 shadow-[0_0_10px_rgba(34,197,94,0.4)]' :
                      lesson.status === 'current' ? 'bg-blue-500 border-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.6)] animate-bounce' :
                      'bg-slate-300 border-slate-100'
                    }`}></div>

                    {/* Card Bài Học */}
                    <div className={`flex-1 flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                      lesson.status === 'completed' ? 'bg-white border-green-200 hover:shadow-md cursor-pointer' :
                      lesson.status === 'current' ? 'bg-blue-50 border-blue-300 shadow-md cursor-pointer hover:-translate-y-1' :
                      'bg-slate-50 border-slate-200 opacity-60 grayscale'
                    }`}>
                       <div className="flex items-center">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
                            lesson.status === 'completed' ? 'bg-green-100' :
                            lesson.status === 'current' ? 'bg-blue-100' :
                            'bg-slate-200'
                          }`}>
                            {lesson.type === 'video' && <img src="https://img.icons8.com/color/48/play--v1.png" className="w-6 h-6" />}
                            {lesson.type === 'h5p' && <img src="https://img.icons8.com/color/48/puzzle.png" className="w-6 h-6" />}
                            {lesson.type === 'quiz' && <img src="https://img.icons8.com/color/48/exam.png" className="w-6 h-6" />}
                          </div>
                          <div>
                            <h3 className={`text-lg font-bold ${lesson.status === 'current' ? 'text-blue-800' : 'text-slate-700'}`}>
                              {lesson.title}
                            </h3>
                            <p className="text-sm font-medium text-slate-500">
                              {lesson.type === 'video' ? 'Video bài giảng' : lesson.type === 'h5p' ? 'Bài tập tương tác' : 'Bài kiểm tra'}
                            </p>
                          </div>
                       </div>

                       {/* Nút Trạng thái */}
                       <div>
                          {lesson.status === 'completed' && (
                             <img src="https://img.icons8.com/color/48/checked--v1.png" alt="Hoàn thành" className="w-8 h-8" />
                          )}
                          {lesson.status === 'current' && (
                             <Link to={`/student/lesson/${lesson.id}`}>
                               <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center">
                                 Học ngay
                                 <img src="https://img.icons8.com/ios-glyphs/30/ffffff/circled-play.png" className="w-5 h-5 ml-2" />
                               </button>
                             </Link>
                          )}
                          {lesson.status === 'locked' && (
                             <img src="https://img.icons8.com/color/48/lock.png" alt="Khóa" className="w-8 h-8 opacity-50" />
                          )}
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
