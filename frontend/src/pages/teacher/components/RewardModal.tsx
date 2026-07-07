import { memo } from 'react';
import { Trophy, Award, Medal, AlertCircle, X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface Props {
  studentName: string;
  onClose: () => void;
}

export const RewardModal = memo(function RewardModal({ studentName, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white w-[500px] rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-amber-50 to-orange-50">
          <h3 className="font-bold text-amber-900 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-amber-500" /> Tặng Huy Hiệu & Thư Khen
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="text-center mb-2">
            <p className="text-sm text-slate-500">Học sinh nhận thưởng</p>
            <p className="text-lg font-bold text-slate-800">{studentName} (Lớp 5A)</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">1. Chọn loại Huy hiệu</label>
            <div className="grid grid-cols-3 gap-3">
              <div className="border-2 border-amber-400 bg-amber-50 rounded-lg p-3 text-center cursor-pointer relative">
                <div className="absolute top-1 right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white" />
                <Award className="w-8 h-8 text-amber-500 mx-auto mb-1" />
                <p className="text-xs font-bold text-amber-900">Tiến bộ</p>
              </div>
              <div className="border border-slate-200 hover:border-slate-300 rounded-lg p-3 text-center cursor-pointer">
                <Trophy className="w-8 h-8 text-blue-500 mx-auto mb-1 opacity-50" />
                <p className="text-xs font-medium text-slate-600">Chăm chỉ</p>
              </div>
              <div className="border border-slate-200 hover:border-slate-300 rounded-lg p-3 text-center cursor-pointer">
                <Medal className="w-8 h-8 text-green-500 mx-auto mb-1 opacity-50" />
                <p className="text-xs font-medium text-slate-600">Sáng tạo</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">2. Nội dung Thư khen (Tùy chọn)</label>
            <textarea
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-sm h-20 resize-none bg-slate-50"
              placeholder="Ghi nhận xét động viên học sinh..."
              defaultValue={`Cô rất tuyên dương ${studentName} tuần này đã có nhiều tiến bộ trong môn Toán!`}
            />
          </div>

          <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start">
            <AlertCircle className="w-4 h-4 text-blue-600 mr-2 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-800">
              Thư khen và huy hiệu sẽ được hiển thị trên Bộ Sưu Tập của học sinh, đồng thời gửi Email thông báo trực tiếp đến Phụ huynh.
            </p>
          </div>

          <div className="flex space-x-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>Hủy</Button>
            <Button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white" onClick={onClose}>
              Gửi thưởng ngay
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});
