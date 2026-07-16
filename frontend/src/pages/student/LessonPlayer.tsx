import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, CheckCircle2, BookOpen, Loader2, Star, Gem } from 'lucide-react';
import H5PPlayer from '../../components/h5p/H5PPlayer';
import { studentService } from '../../services/student.service';

export default function LessonPlayer() {
  const { lessonId } = useParams();
  const [searchParams] = useSearchParams();
  const subjectId = searchParams.get('subjectId');

  const [title, setTitle] = useState('');
  const [h5pContentId, setH5pContentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  useEffect(() => {
    if (!lessonId) return;
    setIsLoading(true);
    studentService
      .getContentNodeDetail(Number(lessonId))
      .then((data) => {
        setTitle(data.title);
        setH5pContentId(data.h5pContentId);
        setCompleted(!!data.completed);
      })
      .catch(() => toast.error('Không tải được nội dung bài học.'))
      .finally(() => setIsLoading(false));
  }, [lessonId]);

  const handleComplete = async () => {
    if (!lessonId || completed) return;
    setSubmitting(true);
    try {
      const result = await studentService.markContentNodeComplete(Number(lessonId));
      setXpEarned(result.xpEarned ?? 0);
      setCompleted(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Không thể đánh dấu hoàn thành.');
    } finally {
      setSubmitting(false);
    }
  };

  const backLink = subjectId ? `/student/subject/${subjectId}` : '/student';

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-student-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header Player */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center space-x-4">
          <Link to={backLink} className="p-2 bg-white rounded-full border border-slate-200 text-slate-500 hover:text-student-primary hover:border-student-primary/30 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bài học</span>
            <h2 className="text-lg font-black text-slate-800">{title}</h2>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {!completed ? (
            <button
              onClick={handleComplete}
              disabled={submitting}
              className="flex items-center px-6 py-2 bg-student-success hover:brightness-95 text-white font-bold rounded-xl shadow-[0_4px_0_0_theme(colors.student.success)] hover:shadow-[0_2px_0_0_theme(colors.student.success)] hover:translate-y-[2px] transition-all disabled:opacity-60"
            >
              {submitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <CheckCircle2 className="w-5 h-5 mr-2" />}
              Đánh dấu hoàn thành
            </button>
          ) : (
            <div className="flex items-center px-4 py-2 bg-student-success/10 border border-student-success/30 rounded-xl">
               <CheckCircle2 className="w-6 h-6 mr-2 text-student-success" />
               <span className="text-student-success font-bold">Đã hoàn thành</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-slate-100 p-6 flex justify-center items-center relative">
         <div className={`w-full max-w-4xl h-full bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col transition-all duration-500 ${completed ? 'scale-95 opacity-50 blur-sm' : ''}`}>
             {h5pContentId ? (
               <H5PPlayer contentId={h5pContentId} />
             ) : (
               <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <BookOpen className="w-20 h-20 mb-6 opacity-80 text-student-primary" strokeWidth={1.5} />
                  <h3 className="text-2xl font-bold text-slate-700 mb-2">Bài học chưa có nội dung tương tác</h3>
                  <p className="text-slate-500 max-w-md">Giáo viên chưa gắn nội dung H5P cho bài này. Em có thể đánh dấu hoàn thành sau khi đã đọc/nghe giảng trên lớp.</p>
               </div>
             )}
         </div>

         {/* Reward Overlay */}
         {completed && (
            <div className="absolute inset-0 z-50 flex items-center justify-center">
               <div className="bg-white p-10 rounded-2xl shadow-xl border border-slate-200 text-center animate-in zoom-in-95 duration-300 max-w-sm">
                  <h1 className="text-3xl font-bold text-amber-500 mb-2">Giỏi Quá!</h1>
                  <p className="text-slate-600 font-medium mb-8">Em đã hoàn thành bài học này.</p>

                  <div className="flex justify-center items-end space-x-2 mb-8">
                     <Star className="w-16 h-16 animate-bounce delay-75 text-yellow-400 fill-yellow-400" />
                     <Star className="w-20 h-20 animate-bounce text-yellow-400 fill-yellow-400" />
                     <Star className="w-16 h-16 animate-bounce delay-150 text-yellow-400 fill-yellow-400" />
                  </div>

                  {xpEarned > 0 && (
                    <div className="inline-flex items-center justify-center bg-slate-50 border border-slate-200 px-6 py-3 rounded-xl w-full mb-6">
                       <span className="text-slate-600 font-semibold mr-3">Phần thưởng:</span>
                       <Gem className="w-6 h-6 mr-2 text-cyan-500 fill-cyan-100" />
                       <span className="text-2xl font-bold text-amber-500">+{xpEarned}</span>
                    </div>
                  )}

                  <Link to={backLink} className="block w-full">
                    <button className="w-full bg-student-primary hover:bg-[#3A82DF] text-white font-semibold py-3 rounded-xl transition-colors">
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
