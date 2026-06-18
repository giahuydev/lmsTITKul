import { useState } from 'react';
import { Search, Filter, CheckCircle, AlertCircle, Bot, X } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';

export default function TeacherGrading() {
  const [selectedStudent, setSelectedStudent] = useState<number | null>(1);
  const [showAI, setShowAI] = useState(false);
  const [commentText, setCommentText] = useState('');

  const submissions = [
    { id: 1, student: 'Nguyễn Văn An', task: 'Viết đoạn văn tả con vật', type: 'Tu_Luan', date: '10/06 14:30', status: 'DA_NOP', late: false },
    { id: 2, student: 'Trần Thị Bình', task: 'Bài tập trắc nghiệm H5P', type: 'H5P', date: '10/06 15:45', status: 'DA_CHAM', late: false, score: 'Hoàn thành tốt' },
  ];

  const handleApplyAI = (text: string) => {
    setCommentText(text);
    setShowAI(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Chấm bài & Phản hồi</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <div className="p-4 border-b border-slate-100 flex flex-wrap gap-4 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input className="pl-9" placeholder="Tìm kiếm học sinh..." />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <select className="px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary">
                  <option value="all">Tất cả bài tập</option>
                  <option value="pending">Chờ chấm</option>
                  <option value="graded">Đã chấm</option>
                </select>
              </div>
            </div>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Học sinh</TableHead>
                    <TableHead>Bài tập</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Thời gian nộp</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map(sub => (
                    <TableRow key={sub.id} className={selectedStudent === sub.id ? 'bg-primary/5' : ''}>
                      <TableCell className="font-medium">{sub.student}</TableCell>
                      <TableCell className="truncate max-w-[150px]">{sub.task}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{sub.type === 'H5P' ? 'H5P Auto' : 'Tự luận'}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">{sub.date}</TableCell>
                      <TableCell>
                        {sub.status === 'DA_NOP' && (
                          <Badge variant={sub.late ? 'danger' : 'warning'}>
                            {sub.late ? 'Nộp trễ' : 'Chờ chấm'}
                          </Badge>
                        )}
                        {sub.status === 'DA_CHAM' && <Badge variant="success">Đã chấm ({sub.score})</Badge>}
                      </TableCell>
                      <TableCell className="text-right">
                        {sub.type === 'H5P' ? (
                          <Button variant="ghost" size="sm" onClick={() => setSelectedStudent(sub.id)}>Xem chi tiết</Button>
                        ) : (
                          <Button variant="outline" size="sm" onClick={() => setSelectedStudent(sub.id)}>Chấm bài</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Khung chấm điểm (Chỉ hiển thị cho Tự luận) */}
        {selectedStudent === 1 && (
          <Card className="border-primary/20 shadow-md">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-lg text-slate-800">Nguyễn Văn An</h3>
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
                    <option>Hoàn thành Tốt</option>
                    <option>Hoàn thành</option>
                    <option>Chưa hoàn thành</option>
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
                        onClick={() => handleApplyAI("Bài viết của con rất tốt, miêu tả sinh động và giàu cảm xúc. Con có thể thêm một vài câu về kỷ niệm đáng nhớ giữa con và chú chó nhé!")}
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
        )}
      </div>
    </div>
  );
}
