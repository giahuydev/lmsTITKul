import { useState, useEffect } from 'react';
import { BookOpen, Send, Bot, Sparkles, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { teacherService } from '../../services/teacher.service';
import type { ClassRoom, Material } from '../../services/teacher.service';
import { useAuthStore } from '../../stores/useAuthStore';

export default function TeacherAssignments() {
  const user = useAuthStore((state) => state.user);
  const [targetType, setTargetType] = useState('toan-lop');
  const [showAI, setShowAI] = useState(false);
  const [taskDesc, setTaskDesc] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [selectedClassId, setSelectedClassId] = useState<number | ''>('');
  const [deadline, setDeadline] = useState('');
  const [isHardLock, setIsHardLock] = useState(false);
  const [assignmentType, setAssignmentType] = useState('TU_LUAN');

  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classData, materialData] = await Promise.all([
          teacherService.getClasses(),
          teacherService.getMaterials(),
        ]);
        setClasses(classData);
        setMaterials(materialData);
        if (classData.length > 0) setSelectedClassId(classData[0].id);
      } catch (err) {
        console.error('Lỗi tải dữ liệu', err);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
  }, []);

  const handleApplyAI = () => {
    setTaskDesc('Các con hãy viết một đoạn văn ngắn (từ 5-7 câu) miêu tả một con vật nuôi trong nhà mà con yêu thích nhất. Hãy tập trung miêu tả về: hình dáng, bộ lông, và một thói quen đáng yêu của nó nhé!');
    setShowAI(false);
  };

  const handleSubmit = async () => {
    if (!selectedClassId || !taskTitle || !deadline) {
      setSubmitStatus('error');
      setErrorMsg('Vui lòng điền đầy đủ Tiêu đề, chọn Lớp và Hạn chót!');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMsg('');

    try {
      await teacherService.createAssignment({
        title: taskTitle,
        description: taskDesc,
        classId: selectedClassId as number,
        teacherId: user?.userId ?? 0,
        type: assignmentType,
        deadline: new Date(deadline).toISOString(),
        isHardLock,
      });
      setSubmitStatus('success');
      setTaskTitle('');
      setTaskDesc('');
      setDeadline('');
    } catch (err: any) {
      setSubmitStatus('error');
      setErrorMsg(err.response?.data?.message || 'Giao bài thất bại! Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-800">Giao bài tập mới</h1>

      {submitStatus === 'success' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-800 font-semibold">
          <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
          Giao bài thành công! Học sinh đã có thể thấy bài tập mới.
        </div>
      )}
      {submitStatus === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 font-semibold">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          {errorMsg}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Nội dung bài tập</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Tiêu đề bài tập"
            placeholder="Nhập tiêu đề..."
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-medium text-slate-700">Mô tả bài tập / Yêu cầu tự luận</label>
              <button
                className="text-xs text-indigo-600 font-bold flex items-center hover:bg-indigo-50 px-2 py-1 rounded"
                onClick={() => setShowAI(!showAI)}
              >
                <Bot className="w-4 h-4 mr-1" /> AI Đề xuất Yêu cầu
              </button>
            </div>

            {showAI && (
              <div className="mb-3 p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                <p className="text-sm text-indigo-900 mb-2 font-medium">Gemma2 đang đọc tiêu đề "{taskTitle || '...'}"...</p>
                <div className="bg-white p-3 rounded border border-indigo-200 text-sm text-slate-700 leading-relaxed">
                  "Các con hãy viết một đoạn văn ngắn (từ 5-7 câu) miêu tả một con vật nuôi trong nhà mà con yêu thích nhất..."
                </div>
                <div className="mt-2 flex space-x-2">
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-xs" onClick={handleApplyAI}>
                    <Sparkles className="w-3 h-3 mr-1" /> Sử dụng đoạn này
                  </Button>
                </div>
              </div>
            )}

            <textarea
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-primary text-sm h-24 resize-none"
              placeholder="Nhập mô tả hoặc yêu cầu cụ thể..."
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Loại bài tập</label>
            <select
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary"
              value={assignmentType}
              onChange={(e) => setAssignmentType(e.target.value)}
            >
              <option value="TU_LUAN">Bài tự luận (Chấm tay)</option>
              <option value="CA_NHAN">Bài tập H5P (Tự động chấm)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Phân phối & Thời hạn</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Giao cho</label>
            <div className="flex space-x-4 mb-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="target" checked={targetType === 'toan-lop'} onChange={() => setTargetType('toan-lop')} className="w-4 h-4 text-primary" />
                <span className="text-sm">Toàn lớp</span>
              </label>
            </div>

            {isLoadingData ? (
              <div className="flex items-center gap-2 text-slate-500 text-sm p-4 bg-slate-50 rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin" /> Đang tải danh sách lớp...
              </div>
            ) : (
              <div className="space-y-2 p-4 bg-slate-50 border border-slate-100 rounded-lg">
                <label className="block text-sm font-medium text-slate-700 mb-2">Chọn lớp học</label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary"
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(Number(e.target.value))}
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} - Khối {cls.grade} ({cls.academicYear})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Hạn chót (Deadline)" type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="hardlock"
                className="w-4 h-4"
                checked={isHardLock}
                onChange={(e) => setIsHardLock(e.target.checked)}
              />
              <label htmlFor="hardlock" className="text-sm font-medium text-slate-700 cursor-pointer">
                Hard Lock (Cấm nộp sau deadline)
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={() => { setTaskTitle(''); setTaskDesc(''); setDeadline(''); setSubmitStatus('idle'); }}>
          Xóa form
        </Button>
        <Button className="bg-primary hover:bg-primary/90" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
          Giao bài ngay
        </Button>
      </div>
    </div>
  );
}
