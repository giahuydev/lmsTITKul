import { BookOpen, Clock, Sparkles } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export default function TeacherDashboard() {
  const aiReport = "Sáng nay, 92% học sinh lớp 5A đã hoàn thành Bài 4. Cần lưu ý 3 em chưa xem video H5P quá 50% thời lượng. AI đề xuất giao thêm bài tập phụ đạo cho 3 em này.";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Bảng tin Lớp học</h1>
      
      {/* AI Morning Report */}
      <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 flex items-start">
        <div className="p-3 bg-indigo-100 rounded-lg mr-4 shrink-0">
          <Sparkles className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-indigo-900 mb-2">Báo cáo AI buổi sáng</h3>
          <p className="text-indigo-800 leading-relaxed">{aiReport}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">Bài chờ chấm</h3>
              <Badge variant="danger">12 bài</Badge>
            </div>
            <p className="text-sm text-slate-500 mb-4">Bài tập tự luận "Văn miêu tả"</p>
            <Button className="w-full">Chấm ngay</Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">Bài tập đang mở</h3>
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
            <p className="text-sm text-slate-500 mb-4">Quiz H5P "Phân số" (Còn 2 ngày)</p>
            <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
              <div className="bg-amber-500 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
            <p className="text-xs text-slate-500 text-right">24/40 em đã làm</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">Học liệu mới tạo</h3>
              <BookOpen className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-sm text-slate-500 mb-4">Video tương tác "Lịch sử Việt Nam"</p>
            <Button variant="outline" className="w-full">Chỉnh sửa (H5P)</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
