import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Save, X, Bot, PlayCircle, Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';

export default function TeacherEditorMock() {
  const [content, setContent] = useState('');
  
  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center">
          <PlayCircle className="w-6 h-6 mr-2 text-indigo-600" /> 
          Soạn Bài giảng H5P
        </h1>
        <div className="flex space-x-2">
          <Link to="/teacher/materials">
            <Button variant="outline"><X className="w-4 h-4 mr-2" /> Hủy</Button>
          </Link>
          <Button className="bg-indigo-600 hover:bg-indigo-700"><Save className="w-4 h-4 mr-2" /> Lưu học liệu</Button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* H5P Editor Fake Area */}
        <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex gap-4">
            <Input className="flex-1 bg-white" placeholder="Tiêu đề bài giảng (VD: Bài 4 - Phân số)" />
            <select className="px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-indigo-500 w-48">
              <option>Interactive Video</option>
              <option>Course Presentation</option>
              <option>Drag and Drop</option>
            </select>
          </div>
          <div className="flex-1 p-8 flex items-center justify-center bg-slate-100">
            <div className="text-center text-slate-400">
              <div className="w-24 h-24 border-4 border-dashed border-slate-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="font-bold text-2xl">H5P</span>
              </div>
              <p>Khung soạn thảo iframe của thư viện @lumieducation/h5p-server</p>
              <p className="text-sm mt-2">(Tính năng này sẽ được code bằng NestJS ở Backend)</p>
            </div>
          </div>
        </div>

        {/* AI Suggestion Panel (Gemma2) */}
        <Card className="w-80 border-indigo-100 flex flex-col shadow-lg">
          <CardHeader className="bg-indigo-50 border-b border-indigo-100 py-4">
            <CardTitle className="text-base text-indigo-900 flex items-center">
              <Bot className="w-5 h-5 mr-2 text-indigo-600" />
              Gemma2 AI Gợi ý
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex-1 overflow-y-auto space-y-4 bg-indigo-50/30">
            <div className="text-sm text-slate-600 mb-4">
              AI đang theo dõi nội dung bạn gõ để đưa ra gợi ý chèn câu hỏi tương tác.
            </div>

            {/* Mock Suggestion 1 */}
            <div className="bg-white p-3 rounded-lg border border-indigo-200 shadow-sm relative group">
              <Badge variant="outline" className="text-[10px] text-indigo-600 border-indigo-200 bg-indigo-50 absolute top-2 right-2">Trắc nghiệm</Badge>
              <h4 className="font-bold text-slate-800 text-sm mb-2 pr-16">Câu hỏi kiểm tra:</h4>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                "Phân số nào sau đây bằng với phân số 1/2?"<br/>
                A. 2/4 (Đúng)<br/>
                B. 3/5<br/>
                C. 4/9
              </p>
              <Button size="sm" className="w-full text-xs bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-none">
                <Plus className="w-3 h-3 mr-1" /> Chèn vào Bài
              </Button>
            </div>

            {/* Mock Suggestion 2 */}
            <div className="bg-white p-3 rounded-lg border border-indigo-200 shadow-sm relative group">
              <Badge variant="outline" className="text-[10px] text-indigo-600 border-indigo-200 bg-indigo-50 absolute top-2 right-2">Điền từ</Badge>
              <h4 className="font-bold text-slate-800 text-sm mb-2 pr-16">Bài tập điền từ:</h4>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                "Tử số là số nằm ở [*trên*] dấu gạch ngang, mẫu số là số nằm ở [*dưới*] dấu gạch ngang."
              </p>
              <Button size="sm" className="w-full text-xs bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-none">
                <Plus className="w-3 h-3 mr-1" /> Chèn vào Bài
              </Button>
            </div>
            
            <Button variant="outline" className="w-full border-dashed border-indigo-300 text-indigo-600 hover:bg-indigo-50 mt-4">
              <Sparkles className="w-4 h-4 mr-2" /> Sinh thêm gợi ý mới
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
