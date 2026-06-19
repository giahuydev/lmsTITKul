import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { studentService } from '../../services/student.service';

export default function SubjectTree() {
  const { subjectId } = useParams();
  const [chapters, setChapters] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const data = await studentService.getSubjectTree();
        setChapters(data);
      } catch (err) {
        console.error('Failed to fetch subject tree', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTree();
  }, [subjectId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <Link to="/student" className="inline-flex items-center text-blue-600 font-bold hover:text-blue-800 mb-8 bg-blue-50 px-4 py-2 rounded-full transition-colors">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Quay lại Trang Chủ
      </Link>

      <div className="flex items-center mb-10">
        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mr-4 border-2 border-blue-200">
           <img src="https://img.icons8.com/color/96/calculator--v1.png" alt="Toán" className="w-10 h-10" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-800">Toán Học (Lớp 4)</h1>
          <p className="text-slate-500 font-medium">Bạn đã hoàn thành 2/12 bài học</p>
        </div>
      </div>

      <div className="space-y-12 mt-12 relative pb-20">
        {chapters.map((chapter) => (
          <div key={chapter.id} className="relative z-10">
            {/* Tiêu đề Chương */}
            <div className="flex flex-col items-center mb-8">
               <div className="bg-white border-2 border-slate-200 rounded-2xl px-6 py-3 shadow-sm inline-flex items-center">
                 <img src={chapter.icon} alt={chapter.title} className="w-10 h-10 mr-3" />
                 <h2 className="text-2xl font-bold text-slate-800">
                   {chapter.title}
                 </h2>
               </div>
            </div>

            {/* Các nhánh (Bài học) xếp thẳng hàng */}
            <div className="relative max-w-xl mx-auto">
               {/* Đường nối dọc ở giữa */}
               <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-slate-200 -translate-x-1/2 -z-10"></div>

               {chapter.lessons.map((lesson, idx) => {
                 const isLeft = idx % 2 === 0;
                 return (
                   <div key={lesson.id} className={`relative flex items-center justify-between mb-8 ${isLeft ? 'flex-row-reverse' : ''}`}>
                      
                      {/* Khoảng trống đối diện */}
                      <div className="w-[45%] hidden md:block"></div>

                      {/* Node Giữa (Flat UI) */}
                      <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-4 z-20 ${
                        lesson.status === 'completed' ? 'bg-green-500 border-green-100' :
                        lesson.status === 'current' ? 'bg-blue-600 border-blue-200 ring-4 ring-blue-50' :
                        'bg-slate-200 border-white'
                      }`}></div>

                      {/* Card Bài Học (Flat UI) */}
                      <div className={`w-full md:w-[45%] flex flex-col p-4 rounded-2xl border transition-all z-10 bg-white ${
                        lesson.status === 'completed' ? 'border-green-200 shadow-sm hover:shadow-md cursor-pointer' :
                        lesson.status === 'current' ? 'border-blue-300 shadow-md ring-2 ring-blue-50 cursor-pointer hover:-translate-y-1' :
                        'border-slate-200 opacity-60 grayscale'
                      }`}>
                         <div className="flex items-center mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-3 ${
                              lesson.status === 'completed' ? 'bg-green-50 text-green-600' :
                              lesson.status === 'current' ? 'bg-blue-50 text-blue-600' :
                              'bg-slate-100 text-slate-400'
                            }`}>
                              {lesson.type === 'video' && <img src="https://img.icons8.com/color/48/play--v1.png" className="w-6 h-6" />}
                              {lesson.type === 'h5p' && <img src="https://img.icons8.com/color/48/puzzle.png" className="w-6 h-6" />}
                              {lesson.type === 'quiz' && <img src="https://img.icons8.com/color/48/exam.png" className="w-6 h-6" />}
                            </div>
                            <div>
                              <h3 className={`text-lg font-bold leading-tight mb-1 ${lesson.status === 'current' ? 'text-blue-800' : 'text-slate-700'}`}>
                                {lesson.title}
                              </h3>
                              <p className="text-xs font-semibold text-slate-500">
                                {lesson.type === 'video' ? 'Video bài giảng' : lesson.type === 'h5p' ? 'Bài tập tương tác' : 'Bài kiểm tra'}
                              </p>
                            </div>
                         </div>

                         {/* Nút Trạng thái dạng Flat */}
                         <div className="mt-auto">
                            {lesson.status === 'completed' && (
                               <div className="flex items-center justify-center w-full py-2 bg-green-50 rounded-lg text-green-700 font-semibold text-sm">
                                 <img src="https://img.icons8.com/color/48/checked--v1.png" alt="Hoàn thành" className="w-5 h-5 mr-1.5" />
                                 Hoàn thành
                               </div>
                            )}
                            {lesson.status === 'current' && (
                               <Link to={`/student/lesson/${lesson.id}`} className="block">
                                 <button className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm">
                                   Học ngay
                                   <img src="https://img.icons8.com/color/48/circled-play.png" className="w-5 h-5 ml-1.5 brightness-200" />
                                 </button>
                               </Link>
                            )}
                            {lesson.status === 'locked' && (
                               <div className="flex items-center justify-center w-full py-2 bg-slate-50 rounded-lg text-slate-500 font-semibold text-sm">
                                 <img src="https://img.icons8.com/color/48/lock.png" alt="Khóa" className="w-5 h-5 mr-1.5 grayscale" />
                                 Chưa mở khóa
                               </div>
                            )}
                         </div>
                      </div>
                   </div>
                 );
               })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
