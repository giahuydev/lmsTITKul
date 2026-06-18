import { Send, Pin } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function TeacherAnnouncements() {
  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-800">Bảng Tin Lớp Học</h1>

      <Card>
        <CardHeader>
          <CardTitle>Đăng thông báo mới</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Tiêu đề thông báo..." />
          <textarea 
            className="w-full h-32 px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-primary focus:ring-1 resize-none"
            placeholder="Nội dung thông báo (hỗ trợ Markdown)..."
          ></textarea>
          
          <div className="flex justify-between items-center">
            <label className="flex items-center text-sm font-medium text-slate-700 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 text-primary rounded border-slate-300 mr-2" />
              Ghim lên đầu trang
            </label>
            <Button>
              <Send className="w-4 h-4 mr-2" />
              Đăng ngay
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4 mt-8">
        <h3 className="text-lg font-bold text-slate-800">Lịch sử đăng</h3>
        
        <Card className="border-amber-200 bg-amber-50/30">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center text-amber-600 mb-2 font-medium">
                <Pin className="w-4 h-4 mr-1" />
                Bài ghim
              </div>
              <span className="text-xs text-slate-500">10/06/2026</span>
            </div>
            <h4 className="font-bold text-slate-800">Lịch thi Học kỳ 1</h4>
            <p className="text-sm text-slate-600 mt-2">Các em lưu ý lịch thi học kỳ 1 sẽ bắt đầu vào tuần sau nhé...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
