import { Bell, TrendingUp, AlertCircle, MessageSquare } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export default function ParentDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Tiến độ của Bé An</h1>
        <select className="px-4 py-2 bg-white border border-slate-300 rounded-lg outline-none font-medium">
          <option>Bé Nguyễn Văn An (Lớp 5A)</option>
          <option>Bé Nguyễn Thị Bình (Lớp 3B)</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              Kết quả học tập gần đây
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div>
                <p className="font-medium text-slate-800">Toán học - Phân số</p>
                <p className="text-sm text-slate-500">Bài tập H5P</p>
              </div>
              <Badge variant="success">Hoàn thành Tốt</Badge>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div>
                <p className="font-medium text-slate-800">Tiếng Việt - Chính tả</p>
                <p className="text-sm text-slate-500">Bài tự luận</p>
              </div>
              <Badge variant="success">Hoàn thành Tốt</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2 text-amber-500" />
              Thông báo & Nhắc nhở
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-start p-4 border border-amber-200 bg-amber-50 rounded-lg">
                <AlertCircle className="h-5 w-5 mr-3 shrink-0 mt-0.5 text-amber-600" />
                <div>
                  <p className="font-medium text-amber-900">Sắp đến hạn nộp bài!</p>
                  <p className="text-sm mt-1 text-amber-700">Bé An còn 1 bài tập "Lịch sử" chưa làm. Hạn chót: tối nay 23:59.</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
              Bảng tin từ Giáo viên Lớp 5A
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border border-blue-100 bg-blue-50/50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <Badge variant="outline" className="border-blue-300 text-blue-700 bg-blue-100">Ghim</Badge>
                <span className="text-xs text-slate-500">10/06/2026</span>
              </div>
              <h4 className="font-bold text-slate-800">Lịch thi Học kỳ 1</h4>
              <p className="text-sm text-slate-600 mt-2">Kính gửi quý phụ huynh, tuần sau các con sẽ bắt đầu thi học kỳ 1. Phụ huynh vui lòng đôn đốc các con ôn tập nhé.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
