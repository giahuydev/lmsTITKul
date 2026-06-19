import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Bot, X, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { EVALUATIONS } from '../../constants';
import { teacherSubmissions } from '../../mocks/teacherData';
import type { SubmissionInfo } from '../../types';

export default function TeacherGradingDetail() {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  
  const [showAI, setShowAI] = useState(false);
  const [commentText, setCommentText] = useState('');

  // Find the submission from mock data
  const submission = (teacherSubmissions as SubmissionInfo[]).find(
    (s) => s.id === Number(submissionId)
  );

  if (!submission) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => navigate('/teacher/grading')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
        </Button>
        <p className="text-slate-500">Không tìm thấy bài tập.</p>
      </div>
    );
  }

  const handleApplyAI = (text: string) => {
    setCommentText(text);
    setShowAI(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/teacher/grading')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
          </Button>
          <h1 className="text-2xl font-bold text-slate-800">Chấm bài chi tiết</h1>
        </div>
      </div>

      <Card className="border-primary/20 shadow-md">
        <CardContent className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-bold text-xl text-slate-800">{submission.student}</h3>
              <p className="text-slate-500 mt-1">{submission.task}</p>
            </div>
            <Badge variant="warning" className="text-sm px-3 py-1">Chờ chấm</Badge>
          </div>

          <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mb-8 text-base leading-relaxed text-slate-700 shadow-inner">
            Nhà em có nuôi một chú chó rất đáng yêu. Tên nó là Milu. Lông của Milu màu vàng óng, mượt như nhung. 
            Mỗi khi em đi học về, Milu lại chạy ra đón, vẫy đuôi rối rít và liếm vào chân em.
            <br/><br/>
            Chú chó này rất khôn, biết giữ nhà và không bao giờ cắn bậy. Em rất yêu thương Milu.
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Đánh giá Xếp loại (Theo TT27)</label>
              <select className="w-full md:w-1/2 px-4 py-3 border border-slate-300 rounded-lg outline-none bg-white text-base focus:border-primary shadow-sm">
                {EVALUATIONS.filter(e => e.value !== 'all').map(e => (
                  <option key={e.value} value={e.value}>{e.label}</option>
                ))}
              </select>
            </div>
            
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
                  <button 
                    onClick={() => handleApplyAI("Bài viết của con rất tốt, miêu tả sinh động và giàu cảm xúc. Con có thể thêm một vài câu về kỷ niệm đáng nhớ giữa con và chú chó nhé!")}
                    className="text-left w-full p-3 bg-white rounded border border-indigo-200 text-sm hover:border-indigo-400 text-slate-700 transition-colors shadow-sm"
                  >
                    "Bài viết của con rất tốt, miêu tả sinh động và giàu cảm xúc. Con có thể thêm một vài câu về kỷ niệm đáng nhớ giữa con và chú chó nhé!"
                  </button>
                  <button 
                    onClick={() => handleApplyAI("Con đã nắm được cấu trúc bài văn miêu tả. Từ ngữ dùng khá phong phú. Cố gắng phát huy con nhé!")}
                    className="text-left w-full p-3 bg-white rounded border border-indigo-200 text-sm hover:border-indigo-400 text-slate-700 transition-colors shadow-sm"
                  >
                    "Con đã nắm được cấu trúc bài văn miêu tả. Từ ngữ dùng khá phong phú. Cố gắng phát huy con nhé!"
                  </button>
                </div>
              )}

              <textarea 
                className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-primary focus:ring-1 text-base h-40 resize-y shadow-sm"
                placeholder="Nhập nhận xét chi tiết cho học sinh..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              ></textarea>
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Button className="w-full bg-green-600 hover:bg-green-700 py-6 text-base shadow-sm">
                  <CheckCircle className="w-5 h-5 mr-2" /> Lưu & Phê duyệt kết quả
                </Button>
              </div>
              <div className="flex-1 flex flex-col space-y-3 border-t sm:border-t-0 sm:border-l border-dashed border-slate-200 pt-4 sm:pt-0 sm:pl-4">
                <label className="block text-xs font-medium text-slate-500">Hoặc yêu cầu học sinh làm lại:</label>
                <Input placeholder="Lý do: Lạc đề, quá ngắn..." className="text-sm" />
                <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 shadow-sm">
                  <AlertCircle className="w-4 h-4 mr-2" /> Trả bài làm lại
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
