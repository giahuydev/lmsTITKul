import { CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';

export default function AdminTickets() {
  const tickets = [
    { id: 1, student: 'Nguyễn Văn An (HS2026001)', teacher: 'Trần Thị B', reason: 'Quên mật khẩu', status: 'CHO_DUYET', date: 'Vừa xong' },
    { id: 2, student: 'Lê Hoàng C (HS2026005)', teacher: 'Trần Thị B', reason: 'Lỗi đăng nhập', status: 'DA_DUYET', date: '1 ngày trước' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Phiếu Hỗ Trợ (Tickets)</h1>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Học sinh liên quan</TableHead>
                <TableHead>Giáo viên yêu cầu</TableHead>
                <TableHead>Loại yêu cầu</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map(ticket => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium text-slate-800">{ticket.student}</TableCell>
                  <TableCell>{ticket.teacher}</TableCell>
                  <TableCell>{ticket.reason}</TableCell>
                  <TableCell>{ticket.date}</TableCell>
                  <TableCell>
                    <Badge variant={ticket.status === 'CHO_DUYET' ? 'warning' : 'success'}>
                      {ticket.status === 'CHO_DUYET' ? 'Chờ duyệt' : 'Đã duyệt'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {ticket.status === 'CHO_DUYET' ? (
                      <>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="w-4 h-4 mr-1" /> Duyệt
                        </Button>
                        <Button size="sm" variant="danger">
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" variant="ghost">Chi tiết</Button>
                    )}
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
