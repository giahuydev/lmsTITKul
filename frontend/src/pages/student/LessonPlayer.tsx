import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, CheckCircle2, BookOpen, Loader2, Star, Gem, Lightbulb } from 'lucide-react';
import H5PPlayer from '../../components/h5p/H5PPlayer';
import LessonVisual from '../../components/student/LessonVisual';
import { studentService } from '../../services/student.service';

type Loai = 'LY_THUYET' | 'TRAC_NGHIEM' | 'NOI_CAP' | 'DIEN_KHUYET';

interface QuizResult {
  diem: number;
  xpEarned: number;
  dapAnChuan: any;
}

function QuizForm({
  loai,
  cauHinh,
  result,
  onSubmit,
  submitting,
}: {
  loai: Loai;
  cauHinh: any;
  result: QuizResult | null;
  onSubmit: (baiLam: any) => void;
  submitting: boolean;
}) {
  const [dapAnDungId, setDapAnDungId] = useState('');
  const [capChon, setCapChon] = useState<Record<string, string>>({});
  const [traLoiTheoCho, setTraLoiTheoCho] = useState<Record<string, string>>({});

  const canSubmit =
    loai === 'TRAC_NGHIEM'
      ? !!dapAnDungId
      : loai === 'NOI_CAP'
      ? cauHinh.cotTrai.every((c: any) => !!capChon[c.id])
      : cauHinh.danhSachCho.every((id: string) => !!traLoiTheoCho[id]?.trim());

  const handleSubmit = () => {
    if (loai === 'TRAC_NGHIEM') onSubmit({ dapAnDungId });
    else if (loai === 'NOI_CAP') onSubmit({ capChon: Object.entries(capChon).map(([traiId, phaiId]) => ({ traiId, phaiId })) });
    else onSubmit({ traLoiTheoCho });
  };

  return (
    <div className="w-full h-full overflow-y-auto p-8 space-y-6">
      <p className="text-xl font-bold text-slate-800">{cauHinh.cauHoi}</p>

      {loai === 'TRAC_NGHIEM' && (
        <div className="space-y-2.5">
          {cauHinh.luaChon.map((lc: any) => {
            const isCorrect = result && result.dapAnChuan?.dapAnDungId === lc.id;
            const isChosenWrong = result && dapAnDungId === lc.id && !isCorrect;
            return (
              <button
                key={lc.id}
                disabled={!!result}
                onClick={() => setDapAnDungId(lc.id)}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 font-medium transition-colors ${
                  isCorrect
                    ? 'border-student-success bg-student-success/10 text-student-success'
                    : isChosenWrong
                    ? 'border-red-400 bg-red-50 text-red-600'
                    : dapAnDungId === lc.id
                    ? 'border-student-primary bg-student-primary/10 text-student-primary'
                    : 'border-slate-200 hover:border-student-primary/40'
                }`}
              >
                {lc.noiDung}
              </button>
            );
          })}
        </div>
      )}

      {loai === 'NOI_CAP' && (
        <div className="space-y-3">
          {cauHinh.cotTrai.map((c: any) => (
            <div key={c.id} className="flex items-center gap-3">
              <span className="w-1/2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 font-medium text-slate-700">
                {c.noiDung}
              </span>
              <select
                disabled={!!result}
                value={capChon[c.id] || ''}
                onChange={(e) => setCapChon((prev) => ({ ...prev, [c.id]: e.target.value }))}
                className="w-1/2 px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-student-primary"
              >
                <option value="">-- chọn --</option>
                {cauHinh.cotPhai.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.noiDung}</option>
                ))}
              </select>
            </div>
          ))}
          {result && (
            <p className="text-sm text-slate-500 pt-1">
              Đáp án đúng:{' '}
              {result.dapAnChuan?.capDung
                ?.map((cap: any) => {
                  const trai = cauHinh.cotTrai.find((c: any) => c.id === cap.traiId)?.noiDung;
                  const phai = cauHinh.cotPhai.find((c: any) => c.id === cap.phaiId)?.noiDung;
                  return `${trai} ↔ ${phai}`;
                })
                .join('; ')}
            </p>
          )}
        </div>
      )}

      {loai === 'DIEN_KHUYET' && (
        <div className="space-y-3">
          {cauHinh.danhSachCho.map((choId: string) => {
            const accepted: string[] = result?.dapAnChuan?.dapAnTheoCho?.[choId] ?? [];
            const myAnswer = (traLoiTheoCho[choId] || '').trim().toLowerCase();
            const isCorrect = result ? accepted.some((a: string) => a.trim().toLowerCase() === myAnswer) : null;
            return (
              <div key={choId}>
                <input
                  disabled={!!result}
                  value={traLoiTheoCho[choId] || ''}
                  onChange={(e) => setTraLoiTheoCho((prev) => ({ ...prev, [choId]: e.target.value }))}
                  placeholder="Nhập câu trả lời..."
                  className={`w-full px-4 py-2.5 rounded-lg border-2 outline-none focus:border-student-primary ${
                    result
                      ? isCorrect
                        ? 'border-student-success bg-student-success/10 text-student-success font-semibold'
                        : 'border-red-400 bg-red-50 text-red-600'
                      : 'border-slate-200'
                  }`}
                />
                {result && !isCorrect && (
                  <p className="text-sm text-student-success font-semibold mt-1 pl-1">
                    Đáp án đúng: {accepted.join(' / ')}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!result ? (
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || submitting}
          className="px-6 py-2.5 bg-student-primary hover:brightness-95 text-white font-bold rounded-xl disabled:opacity-50 transition-all"
        >
          {submitting ? <Loader2 className="w-5 h-5 animate-spin inline mr-2" /> : null}
          Nộp bài
        </button>
      ) : (
        <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-700">
          Điểm: {result.diem}/10
        </div>
      )}
    </div>
  );
}

export default function LessonPlayer() {
  const { lessonId } = useParams();
  const [searchParams] = useSearchParams();
  const subjectId = searchParams.get('subjectId');

  const [title, setTitle] = useState('');
  const [h5pContentId, setH5pContentId] = useState<string | null>(null);
  const [loaiNoiDung, setLoaiNoiDung] = useState<string | null>(null);
  const [loai, setLoai] = useState<Loai | null>(null);
  const [cauHinh, setCauHinh] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [rewardVisible, setRewardVisible] = useState(false);

  useEffect(() => {
    if (!lessonId) return;
    setIsLoading(true);
    studentService
      .getContentNodeDetail(Number(lessonId))
      .then((data) => {
        setTitle(data.title);
        setH5pContentId(data.h5pContentId);
        setCompleted(!!data.completed);
        setLoaiNoiDung(data.loaiNoiDung ?? null);
        setLoai(data.loai ?? null);
        setCauHinh(data.cauHinh ?? null);
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
      setRewardVisible(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Không thể đánh dấu hoàn thành.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitQuiz = async (baiLam: any) => {
    if (!lessonId) return;
    setSubmitting(true);
    try {
      const result = await studentService.submitContentNodeQuiz(Number(lessonId), baiLam);
      setQuizResult({ diem: result.diem, xpEarned: result.xpEarned ?? 0, dapAnChuan: result.dapAnChuan });
      setXpEarned(result.xpEarned ?? 0);
      setCompleted(true);
      setRewardVisible(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Không thể nộp bài.');
    } finally {
      setSubmitting(false);
    }
  };

  const backLink = subjectId ? `/student/subject/${subjectId}` : '/student';
  const isQuizType = loaiNoiDung === 'JSON_TEXT' && (loai === 'TRAC_NGHIEM' || loai === 'NOI_CAP' || loai === 'DIEN_KHUYET');
  const isLyThuyet = loaiNoiDung === 'JSON_TEXT' && loai === 'LY_THUYET';

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
          {!completed && !isQuizType ? (
            <button
              onClick={handleComplete}
              disabled={submitting}
              className="flex items-center px-6 py-2 bg-student-success hover:brightness-95 text-white font-bold rounded-xl shadow-[0_4px_0_0_theme(colors.student.success)] hover:shadow-[0_2px_0_0_theme(colors.student.success)] hover:translate-y-[2px] transition-all disabled:opacity-60"
            >
              {submitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <CheckCircle2 className="w-5 h-5 mr-2" />}
              Đánh dấu hoàn thành
            </button>
          ) : completed ? (
            <div className="flex items-center px-4 py-2 bg-student-success/10 border border-student-success/30 rounded-xl">
               <CheckCircle2 className="w-6 h-6 mr-2 text-student-success" />
               <span className="text-student-success font-bold">Đã hoàn thành</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-slate-100 p-6 flex justify-center items-center relative">
         <div className={`w-full max-w-4xl h-full bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col transition-all duration-500 ${rewardVisible ? 'scale-95 opacity-50 blur-sm' : ''}`}>
             {h5pContentId ? (
               <H5PPlayer contentId={h5pContentId} />
             ) : isLyThuyet ? (
               <div className="flex-1 flex flex-col items-center justify-center text-center p-8 overflow-y-auto">
                  <Lightbulb className="w-16 h-16 mb-4 text-student-primary" strokeWidth={1.5} />
                  <h3 className="text-lg font-bold text-slate-700 mb-3">Lý thuyết</h3>
                  <LessonVisual data={cauHinh?.trucQuan} />
                  <p className="text-slate-600 max-w-xl leading-relaxed whitespace-pre-line">{cauHinh?.noiDung}</p>
               </div>
             ) : isQuizType && loai && cauHinh ? (
               <QuizForm loai={loai} cauHinh={cauHinh} result={quizResult} onSubmit={handleSubmitQuiz} submitting={submitting} />
             ) : (
               <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <BookOpen className="w-20 h-20 mb-6 opacity-80 text-student-primary" strokeWidth={1.5} />
                  <h3 className="text-2xl font-bold text-slate-700 mb-2">Bài học chưa có nội dung tương tác</h3>
                  <p className="text-slate-500 max-w-md">Giáo viên chưa gắn nội dung H5P cho bài này. Em có thể đánh dấu hoàn thành sau khi đã đọc/nghe giảng trên lớp.</p>
               </div>
             )}
         </div>

         {/* Reward Overlay */}
         {rewardVisible && (
            <div className="absolute inset-0 z-50 flex items-center justify-center">
               <div className="bg-white p-10 rounded-2xl shadow-xl border border-slate-200 text-center animate-in zoom-in-95 duration-300 max-w-sm">
                  <h1 className="text-3xl font-bold text-amber-500 mb-2">Giỏi Quá!</h1>
                  <p className="text-slate-600 font-medium mb-8">
                    {quizResult ? `Em đạt ${quizResult.diem}/10 điểm.` : 'Em đã hoàn thành bài học này.'}
                  </p>

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

                  <button onClick={() => setRewardVisible(false)} className="block w-full mb-3">
                    <span className="w-full block bg-white border-2 border-slate-200 hover:border-student-primary text-slate-600 font-semibold py-3 rounded-xl transition-colors">
                      Xem lại bài
                    </span>
                  </button>
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
