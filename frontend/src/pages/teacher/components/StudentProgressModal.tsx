import { memo } from 'react';
import { Activity, X } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

interface ProgressBar {
  subject: string;
  percent: number;
  label: string;
  color: string;
}

const PROGRESS_BARS: ProgressBar[] = [
  { subject: 'Toán học 5', percent: 85, label: '85% (Bài 12/14)', color: 'bg-pro-primary' },
  { subject: 'Tiếng Việt 5', percent: 100, label: '100% (Bài 14/14)', color: 'bg-pro-success' },
];

interface Props {
  studentName: string;
  onClose: () => void;
}

export const StudentProgressModal = memo(function StudentProgressModal({ studentName, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white w-[600px] rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-pro-primary/10">
          <h3 className="font-bold text-pro-fg flex items-center">
            <Activity className="w-5 h-5 mr-2 text-pro-primary" /> Báo cáo Tiến độ Học tập
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-pro-primary/10 rounded-full flex items-center justify-center text-pro-primary font-bold text-xl">
              {studentName.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">{studentName}</h3>
              <p className="text-sm text-slate-500">Mã: HS2026001 • Lớp 5A</p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-700 text-sm mb-3">Tỷ lệ hoàn thành Sơ đồ Bài giảng H5P</h4>
            <div className="space-y-4">
              {PROGRESS_BARS.map(({ subject, percent, label, color }) => (
                <div key={subject}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 font-medium">{subject}</span>
                    <span className={`font-bold ${color === 'bg-pro-primary' ? 'text-pro-primary' : 'text-pro-success'}`}>{label}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div className={`${color} h-2.5 rounded-full`} style={{ width: `${percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-700 text-sm mb-3">Lịch sử Nộp bài gần đây</h4>
            <div className="border border-slate-200 rounded-lg divide-y divide-slate-100">
              {[
                { variant: 'success' as const, label: 'Đúng hạn', title: 'Tả con vật nhà em', time: 'Hôm qua', timeColor: 'text-slate-500', rowBg: '' },
                { variant: 'danger' as const, label: 'Nộp trễ', title: 'Quiz H5P Lịch sử', time: 'Trễ 2 giờ', timeColor: 'text-red-500 font-medium', rowBg: 'bg-red-50/50' },
                { variant: 'success' as const, label: 'Đúng hạn', title: 'Toán: Phân số', time: '10/06', timeColor: 'text-slate-500', rowBg: '' },
              ].map(({ variant, label, title, time, timeColor, rowBg }) => (
                <div key={title} className={`p-3 flex items-center justify-between hover:bg-slate-50 ${rowBg}`}>
                  <div className="flex items-center">
                    <Badge variant={variant} className="mr-3 w-20 justify-center">{label}</Badge>
                    <span className="text-sm font-medium text-slate-700">{title}</span>
                  </div>
                  <span className={`text-xs ${timeColor}`}>{time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 text-center">
            <Button variant="outline" className="w-full text-pro-primary border-pro-primary/30 hover:bg-pro-primary/10" onClick={onClose}>
              Đóng báo cáo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});
