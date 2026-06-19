import { useState, useEffect } from 'react';
import { Users, Loader2 } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { parentService } from '../../services/parent.service';

export default function ParentChildren() {
  const [children, setChildren] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const data = await parentService.getChildren();
        setChildren(data);
      } catch (err) {
        console.error('Failed to fetch children', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChildren();
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
      <h1 className="text-2xl font-bold text-slate-800">Quản lý Hồ sơ con</h1>
      <p className="text-sm text-slate-500 mb-6">
        *Lưu ý: Nếu con quên mật khẩu, phụ huynh vui lòng liên hệ Giáo viên chủ nhiệm để tạo Phiếu hỗ trợ cấp lại mật khẩu mới.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children.map(child => (
          <Card key={child.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{child.name}</h3>
                    <p className="text-sm text-slate-500">{child.grade} • {child.school}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Tên đăng nhập:</span>
                  <span className="font-medium text-slate-800">{child.username}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Tổng điểm XP:</span>
                  <span className="font-bold text-amber-500">{child.totalXp} XP</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
