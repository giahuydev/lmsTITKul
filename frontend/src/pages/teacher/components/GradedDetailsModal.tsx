import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import type { SubmissionInfo } from '../../../types';

interface GradedDetailsModalProps {
  submission: SubmissionInfo | null;
  onClose: () => void;
}

export function GradedDetailsModal({ submission, onClose }: GradedDetailsModalProps) {
  if (!submission) return null;

  return (
    <Modal isOpen={!!submission} onClose={onClose} title="Chi tiết Đánh giá" widthClass="w-[500px]">
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg text-slate-800">{submission.student}</h3>
            <p className="text-sm text-slate-500">{submission.task}</p>
          </div>
          <Badge variant="success">Điểm: {submission.score}</Badge>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm leading-relaxed text-slate-700">
          <strong className="block mb-2 text-slate-800">Bài làm:</strong>
          Nhà em có nuôi một chú chó rất đáng yêu... (Nội dung bài làm của học sinh)
        </div>

        <div>
          <strong className="block mb-1 text-sm text-slate-800">Nhận xét của giáo viên:</strong>
          <div className="p-3 bg-indigo-50 text-indigo-900 text-sm rounded border border-indigo-100">
            Bài viết của con rất tốt, miêu tả sinh động và giàu cảm xúc. Cố gắng phát huy con nhé!
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button variant="outline" onClick={onClose}>Đóng</Button>
        </div>
      </div>
    </Modal>
  );
}
