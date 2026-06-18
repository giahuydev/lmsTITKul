import { CheckCircle, XCircle, X } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';

import { adminTickets } from '../../mocks/adminData';

export default function AdminTickets() {
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const tickets = adminTickets;

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
                      <Button size="sm" variant="ghost" onClick={() => setSelectedTicket(ticket)}>Chi tiết</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Chi tiết Ticket */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-[500px] rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">Chi tiết Phiếu hỗ trợ</h3>
              <button onClick={() => setSelectedTicket(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between pb-2 border-b border-slate-50">
                  <span className="text-slate-500 text-sm">Trạng thái:</span>
                  <Badge variant={selectedTicket.status === 'CHO_DUYET' ? 'warning' : 'success'}>
                    {selectedTicket.status === 'CHO_DUYET' ? 'Chờ duyệt' : 'Đã duyệt'}
                  </Badge>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-50">
                  <span className="text-slate-500 text-sm">Học sinh liên quan:</span>
                  <span className="font-bold text-slate-800">{selectedTicket.student}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-50">
                  <span className="text-slate-500 text-sm">Giáo viên yêu cầu:</span>
                  <span className="font-medium text-slate-800">{selectedTicket.teacher}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-50">
                  <span className="text-slate-500 text-sm">Loại yêu cầu:</span>
                  <span className="font-medium text-slate-800">{selectedTicket.reason}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-50">
                  <span className="text-slate-500 text-sm">Thời gian:</span>
                  <span className="text-slate-800">{selectedTicket.date}</span>
                </div>
                
                <div className="pt-2">
                  <span className="text-slate-500 text-sm block mb-1">Chi tiết lỗi/Mô tả từ GV:</span>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded text-sm text-slate-700">
                    Học sinh này quên mật khẩu đăng nhập hệ thống từ hôm qua. Xin Admin cấp lại mật khẩu mặc định mới nhất.
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100 mt-4">
                <Button variant="outline" onClick={() => setSelectedTicket(null)}>Đóng</Button>
                {selectedTicket.status === 'CHO_DUYET' && (
                  <Button className="bg-green-600 hover:bg-green-700" onClick={() => setSelectedTicket(null)}>Duyệt yêu cầu</Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
