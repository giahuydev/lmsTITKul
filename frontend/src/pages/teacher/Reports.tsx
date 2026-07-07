import { FileSpreadsheet, KeySquare, Trophy, Loader2, Calendar } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { useReportsViewModel } from './hooks/useReportsViewModel';
import { RewardModal } from './components/RewardModal';
import { StudentProgressModal } from './components/StudentProgressModal';

export default function TeacherReports() {
  const vm = useReportsViewModel();

  if (vm.isLoading) {
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
        <Button variant="outline" className="text-green-700 border-green-600 hover:bg-green-50">
          <FileSpreadsheet className="w-4 h-4 mr-2" /> Xuất Excel
        </Button>
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
                {vm.students.map((student: any, idx: number) => (
                  <TableRow key={student.id}>
                    <TableCell className="text-center text-slate-500">{idx + 1}</TableCell>
                    <TableCell className="font-medium text-slate-800">
                      <button
                        className="hover:text-indigo-600 hover:underline transition-colors text-left"
                        onClick={() => vm.openProgressModal(student.name)}
                      >
                        {student.name}
                      </button>
                      {student.isExcellent && (
                        <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">Xuất sắc</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">{student.math}</TableCell>
                    <TableCell className="text-center">{student.viet}</TableCell>
                    <TableCell className="text-center font-bold text-primary">{student.avg}</TableCell>
                    <TableCell className="text-center space-x-1">
                      <Button
                        size="sm" variant="outline"
                        className="text-amber-600 border-amber-200 hover:bg-amber-50 h-8 px-2 text-xs"
                        onClick={() => vm.openRewardModal(student.name)}
                      >
                        <Trophy className="w-3.5 h-3.5 mr-1" /> Khen
                      </Button>
                      <button
                        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors bg-slate-50 hover:bg-red-50 rounded"
                        title="Tạo Ticket Cấp lại MK cho HS này"
                      >
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

      {vm.showRewardModal && (
        <RewardModal
          studentName={vm.selectedStudentName}
          onClose={() => vm.setShowRewardModal(false)}
        />
      )}

      {vm.showProgressModal && (
        <StudentProgressModal
          studentName={vm.selectedStudentName}
          onClose={() => vm.setShowProgressModal(false)}
        />
      )}
    </div>
  );
}
