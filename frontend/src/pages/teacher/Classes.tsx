import { Users } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function TeacherClasses() {
  const classes = [
    { id: 1, name: 'Lớp 5A', role: 'GV Chủ Nhiệm', students: 35 },
    { id: 2, name: 'Lớp 5B', role: 'GV Bộ Môn', students: 40 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Lớp học của tôi</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {classes.map(cls => (
          <Card key={cls.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-primary">{cls.name}</h3>
                  <p className="text-sm text-slate-500 font-medium">{cls.role}</p>
                </div>
                <div className="flex items-center text-slate-600 bg-slate-100 px-3 py-1 rounded-full text-sm">
                  <Users className="h-4 w-4 mr-2 text-slate-500" />
                  <span className="font-bold">{cls.students}</span> HS
                </div>
              </div>
              <div className="flex space-x-3 pt-4 border-t border-slate-100">
                <Button variant="outline" className="flex-1">Danh sách Học sinh chi tiết</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
