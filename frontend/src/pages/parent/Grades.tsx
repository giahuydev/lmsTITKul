import { useState, useEffect } from 'react';
import { Download, Award, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { parentService } from '../../services/parent.service';

export default function ParentGrades() {
  const [grades, setGrades] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const data = await parentService.getGrades();
        setGrades(data);
      } catch (err) {
        console.error('Failed to fetch grades', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGrades();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Sổ đánh giá & Thành tích</h1>
        <Button variant="outline" onClick={() => window.print()} className="print:hidden">
          <Download className="h-4 w-4 mr-2" />
          Xuất báo cáo PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Kết quả đánh giá thường xuyên</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Học sinh</TableHead>
                    <TableHead>Môn học</TableHead>
                    <TableHead>Bài tập</TableHead>
                    <TableHead>Hình thức</TableHead>
                    <TableHead>Ngày nộp</TableHead>
                    <TableHead className="text-right">Đánh giá</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grades.length > 0 ? grades.map(grade => (
                    <TableRow key={grade.id}>
                      <TableCell className="font-medium text-blue-600">{grade.studentName}</TableCell>
                      <TableCell className="font-medium text-slate-800">{grade.subject}</TableCell>
                      <TableCell>{grade.assignment}</TableCell>
                      <TableCell>
                        <Badge variant={grade.type === 'H5P' ? 'default' : 'outline'}>{grade.type}</Badge>
                      </TableCell>
                      <TableCell>{grade.date}</TableCell>
                      <TableCell className="text-right">
                        {grade.score ? (
                          <Badge variant="success">{grade.score}</Badge>
                        ) : (
                          <span className="text-slate-400 italic">Chưa có</span>
                        )}
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-slate-500">Chưa có dữ liệu đánh giá nào.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-amber-500" />
                Huy hiệu gần đây
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center p-3 border border-slate-100 rounded-lg">
                  <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 text-xl mr-4 shrink-0">
                    🏆
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 text-sm">Kiện tướng Đúng hạn</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Nộp liên tiếp 5 bài trước deadline</p>
                  </div>
                </div>
                <div className="flex items-center p-3 border border-slate-100 rounded-lg">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl mr-4 shrink-0">
                    🎓
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 text-sm">Nhà thông thái</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Đạt điểm 10 trong 3 bài liên tiếp</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
