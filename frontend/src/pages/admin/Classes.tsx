import { Plus, Search, RefreshCcw } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';

export default function AdminClasses() {
  const classes = [
    { id: 1, name: 'Lớp 5A', grade: 5, teacher: 'Nguyễn Văn A', students: 35, max: 40, status: 'ACTIVE' },
    { id: 2, name: 'Lớp 3B', grade: 3, teacher: 'Trần Thị B', students: 40, max: 40, status: 'ACTIVE' },
    { id: 3, name: 'Lớp 5C (Cũ)', grade: 5, teacher: '-', students: 0, max: 40, status: 'DONG_BANG' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Quản lý Lớp học</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Tạo lớp mới
        </Button>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-100 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input className="pl-9" placeholder="Tìm lớp..." />
          </div>
          <select className="px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary focus:ring-1">
            <option value="all">Tất cả khối</option>
            <option value="1">Khối 1</option>
            <option value="5">Khối 5</option>
          </select>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên lớp</TableHead>
                <TableHead>Khối</TableHead>
                <TableHead>GVCN</TableHead>
                <TableHead>Sĩ số</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map(cls => (
                <TableRow key={cls.id}>
                  <TableCell className="font-medium text-primary">{cls.name}</TableCell>
                  <TableCell>{cls.grade}</TableCell>
                  <TableCell className="font-medium">
                    {cls.teacher} 
                    <button className="ml-2 text-xs text-indigo-600 hover:text-indigo-800" title="Gán/Đổi GVCN">
                      <RefreshCcw className="w-3 h-3 inline" /> Đổi
                    </button>
                  </TableCell>
                  <TableCell>{cls.students} / {cls.max}</TableCell>
                  <TableCell>
                    <Badge variant={cls.status === 'ACTIVE' ? 'success' : 'outline'}>
                      {cls.status === 'ACTIVE' ? 'Đang học' : 'Đóng băng'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm">HS</Button>
                    <Button variant="ghost" size="sm">Sửa</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
