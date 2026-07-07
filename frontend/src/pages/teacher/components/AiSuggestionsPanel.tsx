import { memo } from 'react';
import { X } from 'lucide-react';

const AI_SUGGESTIONS = [
  'Bài viết của con rất tốt, miêu tả sinh động và giàu cảm xúc. Con có thể thêm một vài câu về kỷ niệm đáng nhớ giữa con và chú chó nhé!',
  'Con đã nắm được cấu trúc bài văn miêu tả. Từ ngữ dùng khá phong phú. Cố gắng phát huy con nhé!',
  'Bài làm của con còn ngắn, chưa đủ ý. Con hãy thêm phần miêu tả chi tiết hơn về hành động và thói quen của con vật nhé.',
];

interface Props {
  onApply: (text: string) => void;
  onClose: () => void;
}

export const AiSuggestionsPanel = memo(function AiSuggestionsPanel({ onApply, onClose }: Props) {
  return (
    <div className="mb-4 p-4 bg-indigo-50 border border-indigo-100 rounded-lg space-y-3 shadow-sm animate-in fade-in slide-in-from-top-2">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-bold text-indigo-800">Chọn 1 phương án (Human-in-the-loop):</span>
        <button onClick={onClose} className="text-indigo-400 hover:text-indigo-600">
          <X className="w-4 h-4" />
        </button>
      </div>
      {AI_SUGGESTIONS.map((suggestion) => (
        <button
          key={suggestion}
          onClick={() => onApply(suggestion)}
          className="text-left w-full p-3 bg-white rounded border border-indigo-200 text-sm hover:border-indigo-400 text-slate-700 transition-colors shadow-sm"
        >
          "{suggestion}"
        </button>
      ))}
    </div>
  );
});
