import { useState } from 'react';
import { BookOpen, Search, Send, Clock, AlertCircle, Bot, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function TeacherAssignments() {
  const [targetType, setTargetType] = useState('toan-lop');
  const [showAI, setShowAI] = useState(false);
  const [taskDesc, setTaskDesc] = useState('');

  const handleApplyAI = () => {
    setTaskDesc("Các con hãy viết một đoạn văn ngắn (từ 5-7 câu) miêu tả một con vật nuôi trong nhà mà con yêu thích nhất. Hãy tập trung miêu tả về: hình dáng, bộ lông, và một thói quen đáng yêu của nó nhé!");
    setShowAI(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-800">Giao bài tập mới</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Nội dung bài tập</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input label="Tiêu đề bài tập" placeholder="Nhập tiêu đề..." defaultValue="Tả con vật nuôi trong nhà" />
          
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-medium text-slate-700">Mô tả bài tập / Yêu cầu tự luận</label>
              <button 
                className="text-xs text-indigo-600 font-bold flex items-center hover:bg-indigo-50 px-2 py-1 rounded"
                onClick={() => setShowAI(!showAI)}
              >
                <Bot className="w-4 h-4 mr-1" /> AI Đề xuất Yêu cầu
              </button>
            </div>
            
            {showAI && (
              <div className="mb-3 p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                <p className="text-sm text-indigo-900 mb-2 font-medium">Gemma2 đang đọc tiêu đề "Tả con vật nuôi trong nhà"...</p>
                <div className="bg-white p-3 rounded border border-indigo-200 text-sm text-slate-700 leading-relaxed">
                  "Các con hãy viết một đoạn văn ngắn (từ 5-7 câu) miêu tả một con vật nuôi trong nhà mà con yêu thích nhất. Hãy tập trung miêu tả về: hình dáng, bộ lông, và một thói quen đáng yêu của nó nhé!"
                </div>
                <div className="mt-2 flex space-x-2">
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-xs" onClick={handleApplyAI}>
                    <Sparkles className="w-3 h-3 mr-1" /> Sử dụng đoạn này
                  </Button>
                </div>
              </div>
            )}
            
            <textarea 
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-primary text-sm h-24 resize-none"
              placeholder="Nhập mô tả hoặc yêu cầu cụ thể..."
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
            ></textarea>
          </div>

          <div className="pt-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Loại bài tập</label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary">
              <option>Bài tự luận (Chấm tay)</option>
              <option>Bài tập H5P (Tự động chấm)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Phân phối & Thời hạn</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Giao cho</label>
            <div className="flex space-x-4 mb-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="target" checked={targetType === 'toan-lop'} onChange={() => setTargetType('toan-lop')} className="w-4 h-4 text-primary" />
                <span className="text-sm">Toàn lớp</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="target" checked={targetType === 'ca-nhan'} onChange={() => setTargetType('ca-nhan')} className="w-4 h-4 text-primary" />
                <span className="text-sm">Cá nhân / Nhóm nhỏ</span>
              </label>
            </div>

            {targetType === 'toan-lop' ? (
              <div className="space-y-2 p-4 bg-slate-50 border border-slate-100 rounded-lg">
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="w-4 h-4 rounded text-primary" />
                  <span className="text-sm font-medium">Lớp 5A (35 HS)</span>
                </label>
              </div>
            ) : (
              <div className="space-y-3 p-4 bg-slate-50 border border-slate-100 rounded-lg">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input className="pl-9 bg-white" placeholder="Tìm kiếm tên học sinh..." />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Thời gian bắt đầu" type="datetime-local" />
            <Input label="Hạn chót (Deadline)" type="datetime-local" />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-3">
        <Button variant="outline">Lưu nháp</Button>
        <Button className="bg-primary hover:bg-primary/90">
          <Send className="w-4 h-4 mr-2" /> Giao bài ngay
        </Button>
      </div>
    </div>
  );
}
