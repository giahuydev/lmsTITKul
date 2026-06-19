import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { teacherSubmissions } from '../../mocks/teacherData';
import { GradedDetailsModal } from './components/GradedDetailsModal';
import { useGradingSystem } from './hooks/useGradingSystem';
import type { SubmissionInfo } from '../../types';

export default function TeacherGrading() {
  const navigate = useNavigate();
  const { 
    selectedStudentId, 
    viewGradedDetails, 
    handleSelectStudent, 
    handleViewDetails, 
    closeDetails 
  } = useGradingSystem();

  const submissions = teacherSubmissions as SubmissionInfo[];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Chấm bài & Phản hồi</h1>

      <Card>
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input className="pl-9" placeholder="Tìm kiếm học sinh..." />
          </div>
          <div className="flex items-center space-x-2">
            <select className="px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary font-bold text-indigo-700 bg-indigo-50">
              <option value="5A">Lớp 5A</option>
              <option value="5B">Lớp 5B</option>
              <option value="5C">Lớp 5C</option>
            </select>
            <Filter className="h-4 w-4 text-slate-400 ml-2" />
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
                    <TableRow key={sub.id} className={selectedStudentId === sub.id ? 'bg-primary/5' : ''}>
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
                        {sub.status === 'DA_CHAM' ? (
                          <Button variant="ghost" size="sm" onClick={() => handleViewDetails(sub)}>Xem chi tiết</Button>
                        ) : sub.type === 'H5P' ? (
                          <Button variant="ghost" size="sm" onClick={() => handleSelectStudent(sub.id)}>Xem tiến độ</Button>
                        ) : (
                          <Button variant="outline" size="sm" onClick={() => navigate(`/teacher/grading/${sub.id}`)}>Chấm bài</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
      </Card>

      <GradedDetailsModal 
        submission={viewGradedDetails} 
        onClose={closeDetails} 
      />
    </div>
  );
}
