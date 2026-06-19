import { useState, useEffect } from 'react';
import { FileSpreadsheet, Medal, Award, Calendar, KeySquare, Trophy, AlertCircle, X, ChevronRight, Activity, Loader2 } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';

import { teacherService } from '../../services/teacher.service';

export default function TeacherReports() {
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedStudentName, setSelectedStudentName] = useState('');
  
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await teacherService.getReports();
        setReportData(data);
      } catch (err) {
        console.error('Failed to fetch reports', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []);

  const students = reportData?.students || [];

  const handleOpenReward = (name: string) => {
    setSelectedStudentName(name);
    setShowRewardModal(true);
  };

  const handleOpenProgress = (name: string) => {
    setSelectedStudentName(name);
    setShowProgressModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl relative">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Sổ điểm & Danh sách Học sinh</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="text-green-700 border-green-600 hover:bg-green-50">
            <FileSpreadsheet className="w-4 h-4 mr-2" /> Xuất Excel
          </Button>
        </div>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-100 flex gap-4 bg-slate-50 items-center">
          <div className="font-semibold text-slate-700 mr-2">Bộ lọc:</div>
          <select className="px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary">
            <option>Lớp 5A</option>
            <option>Lớp 5B</option>
          </select>
          <div className="flex items-center space-x-2 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus-within:border-primary">
            <Calendar className="w-4 h-4 text-slate-400" />
            <select className="outline-none bg-transparent">
              <option>Học kỳ 1 (2025-2026)</option>
              <option>Tháng 10/2025</option>
              <option>Tháng 11/2025</option>
            </select>
          </div>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-12 text-center">STT</TableHead>
                  <TableHead>Họ và tên Học sinh</TableHead>
                  <TableHead className="text-center">Toán học</TableHead>
                  <TableHead className="text-center">Tiếng Việt</TableHead>
                  <TableHead className="text-center font-bold text-primary">Đánh giá chung</TableHead>
                  <TableHead className="text-center">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student, idx) => (
                  <TableRow key={student.id}>
                    <TableCell className="text-center text-slate-500">{idx + 1}</TableCell>
                    <TableCell className="font-medium text-slate-800">
                      {/* Bấm vào tên để xem Tiến độ */}
                      <button 
                        className="hover:text-indigo-600 hover:underline transition-colors text-left"
                        onClick={() => handleOpenProgress(student.name)}
                      >
                        {student.name}
                      </button>
                      {student.isExcellent && <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">Xuất sắc</span>}
                    </TableCell>
                    <TableCell className="text-center">{student.math}</TableCell>
                    <TableCell className="text-center">{student.viet}</TableCell>
                    <TableCell className="text-center font-bold text-primary">{student.avg}</TableCell>
                    <TableCell className="text-center space-x-1">
                      {/* Nút khen thưởng nổi bật hơn */}
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-amber-600 border-amber-200 hover:bg-amber-50 h-8 px-2 text-xs"
                        onClick={() => handleOpenReward(student.name)}
                      >
                        <Trophy className="w-3.5 h-3.5 mr-1" /> Khen
                      </Button>
                      <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors bg-slate-50 hover:bg-red-50 rounded" title="Tạo Ticket Cấp lại MK cho HS này">
                        <KeySquare className="w-4 h-4 inline" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* MODAL 1: KHEN THƯỞNG (QT12.1) */}
      {showRewardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-[500px] rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-amber-50 to-orange-50">
              <h3 className="font-bold text-amber-900 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-amber-500" /> Tặng Huy Hiệu & Thư Khen
              </h3>
              <button onClick={() => setShowRewardModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="text-center mb-2">
                <p className="text-sm text-slate-500">Học sinh nhận thưởng</p>
                <p className="text-lg font-bold text-slate-800">{selectedStudentName} (Lớp 5A)</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">1. Chọn loại Huy hiệu</label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="border-2 border-amber-400 bg-amber-50 rounded-lg p-3 text-center cursor-pointer relative">
                    <div className="absolute top-1 right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white"></div>
                    <Award className="w-8 h-8 text-amber-500 mx-auto mb-1" />
                    <p className="text-xs font-bold text-amber-900">Tiến bộ</p>
                  </div>
                  <div className="border border-slate-200 hover:border-slate-300 rounded-lg p-3 text-center cursor-pointer">
                    <Trophy className="w-8 h-8 text-blue-500 mx-auto mb-1 opacity-50" />
                    <p className="text-xs font-medium text-slate-600">Chăm chỉ</p>
                  </div>
                  <div className="border border-slate-200 hover:border-slate-300 rounded-lg p-3 text-center cursor-pointer">
                    <Medal className="w-8 h-8 text-green-500 mx-auto mb-1 opacity-50" />
                    <p className="text-xs font-medium text-slate-600">Sáng tạo</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">2. Nội dung Thư khen (Tùy chọn)</label>
                <textarea 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-sm h-20 resize-none bg-slate-50"
                  placeholder="Ghi nhận xét động viên học sinh..."
                  defaultValue={`Cô rất tuyên dương ${selectedStudentName} tuần này đã có nhiều tiến bộ trong môn Toán!`}
                ></textarea>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start">
                <AlertCircle className="w-4 h-4 text-blue-600 mr-2 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800">Thư khen và huy hiệu sẽ được hiển thị trên Bộ Sưu Tập của học sinh, đồng thời gửi Email thông báo trực tiếp đến Phụ huynh.</p>
              </div>

              <div className="flex space-x-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowRewardModal(false)}>Hủy</Button>
                <Button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white" onClick={() => setShowRewardModal(false)}>Gửi thưởng ngay</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: TIẾN ĐỘ HỌC TẬP CÁ NHÂN (QT14.2) */}
      {showProgressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-[600px] rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-indigo-50">
              <h3 className="font-bold text-indigo-900 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-indigo-600" /> Báo cáo Tiến độ Học tập
              </h3>
              <button onClick={() => setShowProgressModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl">
                  {selectedStudentName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{selectedStudentName}</h3>
                  <p className="text-sm text-slate-500">Mã: HS2026001 • Lớp 5A</p>
                </div>
              </div>

              {/* Progress Chart */}
              <div>
                <h4 className="font-bold text-slate-700 text-sm mb-3">Tỷ lệ hoàn thành Sơ đồ Bài giảng H5P</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600 font-medium">Toán học 5</span>
                      <span className="font-bold text-indigo-600">85% (Bài 12/14)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                      <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600 font-medium">Tiếng Việt 5</span>
                      <span className="font-bold text-green-600">100% (Bài 14/14)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submission History */}
              <div>
                <h4 className="font-bold text-slate-700 text-sm mb-3">Lịch sử Nộp bài gần đây</h4>
                <div className="border border-slate-200 rounded-lg divide-y divide-slate-100">
                  <div className="p-3 flex items-center justify-between hover:bg-slate-50">
                    <div className="flex items-center">
                      <Badge variant="success" className="mr-3 w-20 justify-center">Đúng hạn</Badge>
                      <span className="text-sm font-medium text-slate-700">Tả con vật nhà em</span>
                    </div>
                    <span className="text-xs text-slate-500">Hôm qua</span>
                  </div>
                  <div className="p-3 flex items-center justify-between hover:bg-slate-50 bg-red-50/50">
                    <div className="flex items-center">
                      <Badge variant="danger" className="mr-3 w-20 justify-center">Nộp trễ</Badge>
                      <span className="text-sm font-medium text-slate-700">Quiz H5P Lịch sử</span>
                    </div>
                    <span className="text-xs text-red-500 font-medium">Trễ 2 giờ</span>
                  </div>
                  <div className="p-3 flex items-center justify-between hover:bg-slate-50">
                    <div className="flex items-center">
                      <Badge variant="success" className="mr-3 w-20 justify-center">Đúng hạn</Badge>
                      <span className="text-sm font-medium text-slate-700">Toán: Phân số</span>
                    </div>
                    <span className="text-xs text-slate-500">10/06</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-center">
                <Button variant="outline" className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50" onClick={() => setShowProgressModal(false)}>
                  Đóng báo cáo
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
