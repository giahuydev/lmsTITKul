import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Save, X, PlayCircle, Maximize2, Minimize2, Eye, AlertTriangle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import H5PEditor, { type H5PEditorHandle } from '../../components/h5p/H5PEditor';
import H5PPlayer from '../../components/h5p/H5PPlayer';

export default function TeacherEditorMock() {
  const { contentId } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef<H5PEditorHandle>(null);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewContentId, setPreviewContentId] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleSave = async () => {
    if (!editorRef.current) return;
    setSaving(true);
    try {
      const result = await editorRef.current.save();
      setHasUnsavedChanges(false);
      toast.success('Đã lưu học liệu H5P thành công!');
      setPreviewContentId(result.contentId);
    } catch (error: any) {
      toast.error(error?.message ?? 'Lưu học liệu thất bại, vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setShowCancelConfirm(true);
      return;
    }
    navigate('/teacher/materials');
  };

  // Ổn định tham chiếu — hàm inline mới mỗi re-render sẽ khiến effect trong
  // H5PEditor chạy lại và reset loading (xem H5PEditor.tsx).
  const handleEditorReady = useCallback(() => setHasUnsavedChanges(true), []);

  return (
    <div className={isFullscreen ? 'fixed inset-0 z-40 bg-white overflow-y-auto p-4 space-y-4' : 'space-y-4'}>
      <div className={isFullscreen ? 'flex justify-between items-center sticky top-0 bg-white z-10 pb-2' : 'flex justify-between items-center'}>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center">
          <PlayCircle className="w-6 h-6 mr-2 text-indigo-600" />
          {contentId ? 'Sửa Bài giảng H5P' : 'Soạn Bài giảng H5P'}
        </h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setIsFullscreen((f) => !f)}>
            {isFullscreen ? <Minimize2 className="w-4 h-4 mr-2" /> : <Maximize2 className="w-4 h-4 mr-2" />}
            {isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
          </Button>
          <Button variant="outline" onClick={handleCancel}>
            <X className="w-4 h-4 mr-2" /> Hủy
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" /> {saving ? 'Đang lưu...' : 'Lưu học liệu'}
          </Button>
        </div>
      </div>

      {/* H5P tự giới hạn cứng nội dung trong iframe ở 960px — canh giữa thay vì để trống hai bên. */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 min-h-[70vh] max-w-[1040px] mx-auto">
        <H5PEditor ref={editorRef} contentId={contentId} onReady={handleEditorReady} />
      </div>

      <Modal
        isOpen={!!previewContentId}
        onClose={() => {
          setPreviewContentId(null);
          navigate('/teacher/materials');
        }}
        title={
          <div className="flex items-center">
            <Eye className="w-4 h-4 mr-2 text-indigo-600" /> Xem trước học liệu vừa lưu
          </div>
        }
        widthClass="w-[90vw] max-w-4xl"
      >
        <div className="h-[70vh] p-4">
          {previewContentId && <H5PPlayer contentId={previewContentId} />}
        </div>
      </Modal>

      <Modal
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        title={
          <div className="flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2 text-amber-500" /> Hủy soạn bài?
          </div>
        }
        widthClass="w-[420px]"
      >
        <div className="p-6 space-y-4">
          <p className="text-slate-600 text-sm">Nội dung chưa lưu sẽ mất. Bạn có chắc muốn hủy?</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowCancelConfirm(false)}>
              Tiếp tục soạn
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={() => navigate('/teacher/materials')}
            >
              Hủy bỏ
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
