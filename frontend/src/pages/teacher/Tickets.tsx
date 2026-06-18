import { Plus, Clock, CheckCircle, X } from 'lucide-react';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';

import { teacherTickets } from '../../mocks/teacherData';

export default function TeacherTickets() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const tickets = teacherTickets;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Quản lý Phiếu Hỗ Trợ (Tickets)</h1>
        <Button className="flex items-center" onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Tạo yêu cầu mới
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách yêu cầu đã gửi cho Quản trị viên</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã phiếu</TableHead>
                <TableHead>Học sinh liên quan</TableHead>
                <TableHead>Loại yêu cầu</TableHead>
                <TableHead>Ngày gửi</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map(ticket => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium text-slate-900">{ticket.id}</TableCell>
                  <TableCell>{ticket.student}</TableCell>
                  <TableCell>{ticket.request}</TableCell>
                  <TableCell>{ticket.date}</TableCell>
                  <TableCell>
                    {ticket.status === 'PENDING' ? (
                      <Badge variant="warning" className="flex items-center w-fit">
                         <Clock className="w-3 h-3 mr-1" /> Chờ xử lý
                      </Badge>
                    ) : (
                      <Badge variant="success" className="flex items-center w-fit">
                         <CheckCircle className="w-3 h-3 mr-1" /> Đã giải quyết
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Tạo Yêu cầu mới */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-[500px] rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">Tạo Phiếu Hỗ Trợ Mới</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Loại yêu cầu</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary">
                  <option>Cấp lại mật khẩu học sinh</option>
                  <option>Sửa sai thông tin học sinh</option>
                  <option>Hỗ trợ kỹ thuật khác</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Học sinh liên quan (nếu có)</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary">
                  <option>-- Chọn học sinh --</option>
                  <option>Nguyễn Văn An (5A)</option>
                  <option>Trần Thị Bình (5A)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Mô tả chi tiết</label>
                <textarea 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-primary text-sm h-24 resize-none"
                  placeholder="Nhập mô tả lý do để Admin dễ dàng hỗ trợ..."
                ></textarea>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100 mt-2">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>Hủy bỏ</Button>
                <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowCreateModal(false)}>Gửi yêu cầu</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
