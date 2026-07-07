import { useState, useEffect } from 'react';
import { Loader2, FileText, Clock, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { parentService } from '../../services/parent.service';

export default function ParentAssignments() {
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const data = await parentService.getChildren();
        setChildren(data);
        if (data && data.length > 0) {
          setSelectedChildId(data[0].id);
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to fetch children', err);
        setIsLoading(false);
      }
    };
    fetchChildren();
  }, []);

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!selectedChildId) return;
      setIsLoading(true);
      try {
        const data = await parentService.getAssignments(selectedChildId);
        setAssignments(data);
      } catch (err) {
        console.error('Failed to fetch assignments', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssignments();
  }, [selectedChildId]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bài tập về nhà</h1>
          <p className="text-slate-500 mt-1">Theo dõi tiến độ làm bài của con</p>
        </div>

        {children.length > 0 && (
          <div className="flex items-center space-x-3 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
            <span className="text-sm font-medium text-slate-500 pl-2">Chọn học sinh:</span>
            <select
              className="bg-slate-50 border-none text-sm font-semibold rounded-lg focus:ring-0 py-2 pl-3 pr-8"
              value={selectedChildId || ''}
              onChange={(e) => setSelectedChildId(Number(e.target.value))}
            >
              {children.map(child => (
                <option key={child.id} value={child.id}>{child.name} - {child.className}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : children.length === 0 ? (
        <Card className="bg-slate-50 border-dashed border-2">
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <FileText className="w-12 h-12 mb-4 text-slate-300" />
            <p>Bạn chưa có học sinh nào được liên kết.</p>
          </div>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên bài tập</TableHead>
                  <TableHead>Loại bài</TableHead>
                  <TableHead>Hạn nộp</TableHead>
                  <TableHead>Còn lại</TableHead>
                  <TableHead className="text-right">Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.length > 0 ? assignments.map(a => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium text-slate-900">{a.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{a.type}</Badge>
                    </TableCell>
                    <TableCell className="text-slate-600">{a.deadline}</TableCell>
                    <TableCell>
                      {a.status === 'DA_NOP' ? (
                        <span className="text-green-500 flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 mr-1" /> Đã hoàn thành
                        </span>
                      ) : a.status === 'QUA_HAN' ? (
                        <span className="text-red-500 flex items-center text-sm">
                          <Clock className="w-4 h-4 mr-1" /> Quá hạn
                        </span>
                      ) : (
                        <span className="text-amber-600 flex items-center text-sm">
                          <Clock className="w-4 h-4 mr-1" /> {a.timeRemaining}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {a.status === 'DA_NOP' ? (
                        <Badge variant="success">Đã nộp</Badge>
                      ) : a.status === 'QUA_HAN' ? (
                        <Badge variant="danger">Quá hạn</Badge>
                      ) : (
                        <Badge variant="warning">Chưa nộp</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                      <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      Chưa có bài tập nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
