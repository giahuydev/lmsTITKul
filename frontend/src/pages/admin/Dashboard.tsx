import { Users, BookOpen, UserCheck, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

import { adminKpis } from '../../mocks/adminData';

export default function AdminDashboard() {
  const kpis = adminKpis;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Tổng quan toàn trường</h1>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="flex items-center p-6">
              <div className={`p-4 rounded-full ${kpi.bg} mr-4`}>
                <Icon className={`h-6 w-6 ${kpi.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{kpi.title}</p>
                <p className="text-2xl font-bold text-slate-800">{kpi.value}</p>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Lưu lượng truy cập</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
              <span className="text-slate-400">Biểu đồ đang cập nhật...</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Cảnh báo hệ thống</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-start p-3 bg-red-50 text-red-700 rounded-lg">
                <AlertCircle className="h-5 w-5 mr-3 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">5 Học sinh chưa có lớp</p>
                  <p className="text-sm mt-1 text-red-600">Vui lòng phân bổ học sinh mới import vào lớp học.</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
