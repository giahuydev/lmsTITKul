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

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-4">
              <select className="px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary">
                <option value="all">Gửi tất cả (Phụ huynh & Học sinh)</option>
                <option value="parents">Chỉ gửi Phụ huynh</option>
                <option value="students">Chỉ gửi Học sinh</option>
              </select>
              <label className="flex items-center text-sm font-medium text-slate-700 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-primary rounded border-slate-300 mr-2" />
                Ghim lên đầu
              </label>
            </div>
            <Button>
              <Send className="w-4 h-4 mr-2" />
              Đăng ngay
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4 mt-8">
        <h3 className="text-lg font-bold text-slate-800">Lịch sử đăng</h3>

        <Card className="border-amber-300 bg-amber-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-200/50 rounded-bl-full -z-10"></div>
          <CardContent className="p-4 relative z-10">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex items-center text-amber-700 font-bold bg-amber-200/50 px-2 py-1 rounded-md text-sm">
                  <Pin className="w-4 h-4 mr-1" />
                  Đã ghim
                </div>
                <div className="px-2 py-1 bg-white/50 text-amber-800 rounded text-xs border border-amber-300/50">
                  Gửi: Phụ huynh
                </div>
              </div>
              <span className="text-xs text-slate-500">10/06/2026</span>
            </div>
            <h4 className="font-bold text-slate-800 text-lg">Lịch thi Học kỳ 1</h4>
            <p className="text-sm text-slate-700 mt-2">Các em lưu ý lịch thi học kỳ 1 sẽ bắt đầu vào tuần sau nhé...</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white mt-4">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex items-center text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-md text-sm">
                  Tin chung
                </div>
                <div className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs border border-slate-200">
                  Gửi: Tất cả
                </div>
              </div>
              <span className="text-xs text-slate-500">08/06/2026</span>
            </div>
            <h4 className="font-bold text-slate-800">Nhắc nhở làm bài tập về nhà</h4>
            <p className="text-sm text-slate-600 mt-2">Hôm nay các em nhớ làm bài tập Toán trên hệ thống nhé.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
