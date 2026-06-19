import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Bot, X, ArrowLeft, Loader2 } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { teacherService } from '../../services/teacher.service';
import { useAuthStore } from '../../stores/useAuthStore';

const GRADE_OPTIONS = [
  { value: 'HOAN_THANH_TOT', label: '✨ Hoàn thành tốt' },
  { value: 'HOAN_THANH', label: '✅ Hoàn thành' },
  { value: 'CHUA_HOAN_THANH', label: '⚠️ Chưa hoàn thành' },
];

const AI_SUGGESTIONS = [
  'Bài viết của con rất tốt, miêu tả sinh động và giàu cảm xúc. Con có thể thêm một vài câu về kỷ niệm đáng nhớ giữa con và chú chó nhé!',
  'Con đã nắm được cấu trúc bài văn miêu tả. Từ ngữ dùng khá phong phú. Cố gắng phát huy con nhé!',
  'Bài làm của con còn ngắn, chưa đủ ý. Con hãy thêm phần miêu tả chi tiết hơn về hành động và thói quen của con vật nhé.',
];

export default function TeacherGradingDetail() {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [submission, setSubmission] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [showAI, setShowAI] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('HOAN_THANH');
  const [retryReason, setRetryReason] = useState('');

  const [isSubmittingApprove, setIsSubmittingApprove] = useState(false);
  const [isSubmittingRetry, setIsSubmittingRetry] = useState(false);
  const [actionStatus, setActionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [actionMsg, setActionMsg] = useState('');

  // Fetch submission từ API
  useEffect(() => {
    if (!submissionId) return;
    const fetchSubmission = async () => {
      try {
        // API trả về danh sách bài nộp, ta cần lấy theo ID
        // Tạm thời dùng endpoint submissions theo assignment rồi filter
        // Sau này có thể tạo thêm GET /submissions/{id} ở Backend
        setIsLoading(false);
        setSubmission({ id: Number(submissionId), status: 'DA_NOP' });
      } catch (err: any) {
        setLoadError('Không thể tải thông tin bài làm. Vui lòng thử lại!');
        setIsLoading(false);
      }
    };
    fetchSubmission();
  }, [submissionId]);

  const handleApplyAI = (text: string) => {
    setCommentText(text);
    setShowAI(false);
  };

  const handleApprove = async () => {
    if (!commentText) {
      setActionStatus('error');
      setActionMsg('Vui lòng nhập nhận xét trước khi phê duyệt!');
      return;
    }
    setIsSubmittingApprove(true);
    setActionStatus('idle');
    try {
      await teacherService.evaluateSubmission(Number(submissionId), {
        grade: selectedGrade,
        comment: commentText,
        action: 'DUYET',
        teacherId: user?.userId ?? 1,
      });
      setActionStatus('success');
      setActionMsg('Phê duyệt bài làm thành công! Học sinh sẽ nhận được phản hồi ngay.');
    } catch (err: any) {
      setActionStatus('error');
      setActionMsg(err.response?.data?.message || 'Có lỗi xảy ra khi chấm bài!');
    } finally {
      setIsSubmittingApprove(false);
    }
  };

  const handleRetry = async () => {
    if (!retryReason) {
      setActionStatus('error');
      setActionMsg('Vui lòng nhập lý do yêu cầu làm lại!');
      return;
    }
    setIsSubmittingRetry(true);
    setActionStatus('idle');
    try {
      await teacherService.evaluateSubmission(Number(submissionId), {
        grade: 'CHUA_HOAN_THANH',
        comment: retryReason,
        action: 'YC_LAM_LAI',
        reason: retryReason,
        teacherId: user?.userId ?? 1,
      });
      setActionStatus('success');
      setActionMsg('Đã gửi yêu cầu làm lại! Học sinh sẽ được phép nộp bài mới.');
    } catch (err: any) {
      setActionStatus('error');
      setActionMsg(err.response?.data?.message || 'Có lỗi xảy ra!');
    } finally {
      setIsSubmittingRetry(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20 text-blue-500">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => navigate('/teacher/grading')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
        </Button>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 font-semibold">{loadError}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/teacher/grading')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
          </Button>
          <h1 className="text-2xl font-bold text-slate-800">
            Chấm bài #{submissionId}
          </h1>
        </div>
        <Badge variant="warning" className="text-sm px-3 py-1">Chờ chấm</Badge>
      </div>

      {/* Feedback Banner */}
      {actionStatus === 'success' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-800 font-semibold">
          <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
          {actionMsg}
        </div>
      )}
      {actionStatus === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 font-semibold">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          {actionMsg}
        </div>
      )}

      <Card className="border-primary/20 shadow-md">
        <CardContent className="p-8">
          {/* Nội dung bài làm */}
          <div className="mb-6">
            <h3 className="font-bold text-sm text-slate-500 uppercase tracking-wide mb-3">Nội dung bài làm</h3>
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 text-base leading-relaxed text-slate-700 shadow-inner min-h-[120px]">
              {submission?.textContent || (
                <span className="text-slate-400 italic">
                  Học sinh chưa có nội dung văn bản. (Có thể là bài nộp file hoặc H5P)
                </span>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Chọn xếp loại */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Đánh giá Xếp loại (Theo TT27)</label>
              <select
                className="w-full md:w-1/2 px-4 py-3 border border-slate-300 rounded-lg outline-none bg-white text-base focus:border-primary shadow-sm"
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
              >
                {GRADE_OPTIONS.map((g) => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </div>

            {/* Nhận xét */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-slate-700">Nhận xét của Giáo viên</label>
                <button
                  className="text-sm text-indigo-600 font-bold flex items-center hover:bg-indigo-50 px-3 py-1.5 rounded transition-colors"
                  onClick={() => setShowAI(!showAI)}
                >
                  <Bot className="w-4 h-4 mr-1.5" /> Gemma2 Gợi ý
                </button>
              </div>

              {showAI && (
                <div className="mb-4 p-4 bg-indigo-50 border border-indigo-100 rounded-lg space-y-3 shadow-sm animate-in fade-in slide-in-from-top-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-indigo-800">Chọn 1 phương án (Human-in-the-loop):</span>
                    <button onClick={() => setShowAI(false)} className="text-indigo-400 hover:text-indigo-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {AI_SUGGESTIONS.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleApplyAI(suggestion)}
                      className="text-left w-full p-3 bg-white rounded border border-indigo-200 text-sm hover:border-indigo-400 text-slate-700 transition-colors shadow-sm"
                    >
                      "{suggestion}"
                    </button>
                  ))}
                </div>
              )}

              <textarea
                className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-primary focus:ring-1 text-base h-40 resize-y shadow-sm"
                placeholder="Nhập nhận xét chi tiết cho học sinh..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
              {/* Phê duyệt */}
              <div className="flex-1">
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 py-6 text-base shadow-sm"
                  onClick={handleApprove}
                  disabled={isSubmittingApprove || actionStatus === 'success'}
                >
                  {isSubmittingApprove
                    ? <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    : <CheckCircle className="w-5 h-5 mr-2" />
                  }
                  Lưu & Phê duyệt kết quả
                </Button>
              </div>

              {/* Yêu cầu làm lại */}
              <div className="flex-1 flex flex-col space-y-3 border-t sm:border-t-0 sm:border-l border-dashed border-slate-200 pt-4 sm:pt-0 sm:pl-4">
                <label className="block text-xs font-medium text-slate-500">Hoặc yêu cầu học sinh làm lại:</label>
                <Input
                  placeholder="Lý do: Lạc đề, quá ngắn..."
                  className="text-sm"
                  value={retryReason}
                  onChange={(e) => setRetryReason(e.target.value)}
                />
                <Button
                  variant="outline"
                  className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 shadow-sm"
                  onClick={handleRetry}
                  disabled={isSubmittingRetry || actionStatus === 'success'}
                >
                  {isSubmittingRetry
                    ? <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    : <AlertCircle className="w-4 h-4 mr-2" />
                  }
                  Trả bài làm lại
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
