import { useState } from 'react';
import { CheckCircle, AlertCircle, Bot, X } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { EVALUATIONS } from '../../../constants';

interface GradingPanelProps {
  studentId: number;
}

export function GradingPanel({ studentId }: GradingPanelProps) {
  const [showAI, setShowAI] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleApplyAI = (text: string) => {
    setCommentText(text);
    setShowAI(false);
  };

  return (
    <Card className="border-primary/20 shadow-md">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="font-bold text-lg text-slate-800">Nguyễn Văn An (ID: {studentId})</h3>
            <p className="text-sm text-slate-500">Tả con vật nhà em</p>
          </div>
          <Badge variant="warning">Chờ chấm</Badge>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-6 text-sm leading-relaxed text-slate-700">
          Nhà em có nuôi một chú chó rất đáng yêu. Tên nó là Milu. Lông của Milu màu vàng óng, mượt như nhung. 
          Mỗi khi em đi học về, Milu lại chạy ra đón, vẫy đuôi rối rít và liếm vào chân em.
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Đánh giá Xếp loại (Theo TT27)</label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary">
              {EVALUATIONS.filter(e => e.value !== 'all').map(e => (
                <option key={e.value} value={e.value}>{e.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-bold text-slate-700">Nhận xét của Giáo viên</label>
              <button 
                className="text-xs text-indigo-600 font-bold flex items-center hover:bg-indigo-50 px-2 py-1 rounded"
                onClick={() => setShowAI(!showAI)}
              >
                <Bot className="w-4 h-4 mr-1" /> Gemma2 Gợi ý
              </button>
            </div>

            {showAI && (
              <div className="mb-3 p-3 bg-indigo-50 border border-indigo-100 rounded-lg space-y-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-indigo-800">Chọn 1 phương án (Human-in-the-loop):</span>
                  <X className="w-3 h-3 text-indigo-400 cursor-pointer" onClick={() => setShowAI(false)} />
                </div>
                <button 
                  onClick={() => handleApplyAI("Bài viết của con rất tốt, miêu tả sinh động và giàu cảm xúc. Cố gắng phát huy con nhé!")}
                  className="text-left w-full p-2 bg-white rounded border border-indigo-200 text-sm hover:border-indigo-400 text-slate-700"
                >
                  "Bài viết của con rất tốt, miêu tả sinh động và giàu cảm xúc..."
                </button>
                <button 
                  onClick={() => handleApplyAI("Con đã nắm được cấu trúc bài văn miêu tả. Từ ngữ dùng khá phong phú. Cố gắng phát huy con nhé!")}
                  className="text-left w-full p-2 bg-white rounded border border-indigo-200 text-sm hover:border-indigo-400 text-slate-700"
                >
                  "Con đã nắm được cấu trúc bài văn miêu tả..."
                </button>
              </div>
            )}

            <textarea 
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-primary text-sm h-24 resize-none"
              placeholder="Nhập nhận xét chi tiết..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            ></textarea>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col space-y-3">
            <div className="flex space-x-2">
              <Button className="flex-1 bg-green-600 hover:bg-green-700">
                <CheckCircle className="w-4 h-4 mr-2" /> Lưu & Duyệt
              </Button>
            </div>
            <div className="space-y-2 border-t border-dashed border-slate-200 pt-3">
              <label className="block text-xs font-medium text-slate-500">Lý do yêu cầu nộp lại:</label>
              <Input placeholder="VD: Lạc đề, cần viết dài hơn..." className="text-sm" />
              <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                <AlertCircle className="w-4 h-4 mr-2" /> Yêu cầu làm lại
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
