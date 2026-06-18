import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function LessonPlayer() {
  const { lessonId } = useParams();
  const [completed, setCompleted] = useState(false);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header Player */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center space-x-4">
          <Link to="/student/subject/math" className="p-2 bg-white rounded-full border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bài tập Tương tác</span>
            <h2 className="text-lg font-black text-slate-800">Các số có sáu chữ số</h2>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {!completed && (
            <div className="flex items-center bg-orange-100 border border-orange-200 text-orange-700 px-4 py-2 rounded-xl font-bold animate-pulse">
              <img src="https://img.icons8.com/color/48/time.png" className="w-5 h-5 mr-2" />
              14:59
            </div>
          )}
          {!completed ? (
            <button 
              onClick={() => setCompleted(true)}
              className="flex items-center px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-[0_4px_0_#16a34a] hover:shadow-[0_2px_0_#16a34a] hover:translate-y-[2px] transition-all"
            >
              <img src="https://img.icons8.com/color/48/checked-checkbox.png" className="w-5 h-5 mr-2" alt="Nộp" />
              Nộp bài
            </button>
          ) : (
            <div className="flex items-center px-4 py-2 bg-green-50 border border-green-200 rounded-xl">
               <img src="https://img.icons8.com/color/48/ok--v1.png" className="w-6 h-6 mr-2" alt="Đã nộp" />
               <span className="text-green-700 font-bold">Đã hoàn thành</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-slate-100 p-6 flex justify-center items-center relative">
         {/* H5P Iframe Mock */}
         <div className={`w-full max-w-4xl h-full bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col transition-all duration-500 ${completed ? 'scale-95 opacity-50 blur-sm' : ''}`}>
             <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <img src="https://img.icons8.com/color/96/puzzle.png" alt="H5P" className="w-20 h-20 mb-6 opacity-80" />
                <h3 className="text-2xl font-bold text-slate-700 mb-2">Trình phát bài giảng H5P</h3>
                <p className="text-slate-500 max-w-md">Khu vực này sẽ nhúng iframe H5P từ Backend. Học sinh sẽ kéo thả, điền khuyết trực tiếp tại đây.</p>
             </div>
         </div>

         {/* Reward Overlay */}
         {completed && (
            <div className="absolute inset-0 z-50 flex items-center justify-center">
               <div className="bg-white p-10 rounded-2xl shadow-xl border border-slate-200 text-center animate-in zoom-in-95 duration-300 max-w-sm">
                  <h1 className="text-3xl font-bold text-amber-500 mb-2">Giỏi Quá!</h1>
                  <p className="text-slate-600 font-medium mb-8">Em đã hoàn thành xuất sắc bài tập này.</p>
                  
                  <div className="flex justify-center items-end space-x-2 mb-8">
                     <img src="https://img.icons8.com/color/96/star--v1.png" className="w-16 h-16 animate-bounce delay-75" />
                     <img src="https://img.icons8.com/color/96/star--v1.png" className="w-20 h-20 animate-bounce" />
                     <img src="https://img.icons8.com/color/96/star--v1.png" className="w-16 h-16 animate-bounce delay-150" />
                  </div>

                  <div className="inline-flex items-center justify-center bg-slate-50 border border-slate-200 px-6 py-3 rounded-xl w-full mb-6">
                     <span className="text-slate-600 font-semibold mr-3">Phần thưởng:</span>
                     <img src="https://img.icons8.com/color/48/diamond.png" className="w-6 h-6 mr-2" />
                     <span className="text-2xl font-bold text-amber-500">+50</span>
                  </div>

                  <Link to="/student/subject/math" className="block w-full">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors">
                      Tiếp tục hành trình
                    </button>
                  </Link>
               </div>
            </div>
         )}
      </div>
    </div>
  );
}
