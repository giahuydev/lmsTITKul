import { useState } from 'react';
import { Clock, CheckCircle, AlertCircle, FileText, Upload, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { assignmentTasks } from '../../mocks/studentData';

export default function StudentAssignments() {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const tasks = assignmentTasks;

  const handleOpenSubmit = (task: any) => {
    setSelectedTask(task);
    setIsSubmitModalOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Bài tập hôm nay</h1>
          <p className="text-slate-500 font-medium mt-1">Hoàn thành bài tập để nhận thêm nhiều Kim cương nhé!</p>
        </div>
        <img src="https://img.icons8.com/color/96/todo-list--v1.png" className="w-16 h-16" alt="Nhiệm vụ" />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tasks.map((task) => (
          <div key={task.id} className={`bg-white border rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between transition-shadow hover:shadow-md ${
            task.status === 'YC_LAM_LAI' ? 'border-red-200 bg-red-50/30' : 'border-slate-200'
          }`}>
            <div className="flex items-start mb-4 md:mb-0">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 shrink-0 ${
                task.type === 'H5P' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
              }`}>
                {task.type === 'H5P' ? <img src="https://img.icons8.com/color/48/puzzle.png" className="w-7 h-7" /> : <FileText className="w-6 h-6" />}
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    task.subject === 'Toán Học' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-orange-50 text-orange-700 border border-orange-100'
                  }`}>{task.subject}</span>
                  {task.status === 'YC_LAM_LAI' && <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-red-100 text-red-700 animate-pulse">Làm lại</span>}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">{task.title}</h3>
                
                <div className="flex items-center text-sm font-medium">
                  {task.status === 'DA_NOP' ? (
                    <span className="text-green-600 flex items-center"><CheckCircle className="w-4 h-4 mr-1"/> Đã nộp</span>
                  ) : task.isLate ? (
                    <span className="text-red-500 flex items-center"><AlertCircle className="w-4 h-4 mr-1"/> Quá hạn nộp</span>
                  ) : (
                    <span className="text-orange-500 flex items-center"><Clock className="w-4 h-4 mr-1"/> Còn {task.timeRemaining}</span>
                  )}
                  <span className="mx-2 text-slate-300">•</span>
                  <span className="text-slate-500">Hạn: {task.deadline}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              {task.status === 'DA_NOP' ? (
                 <Button variant="outline" className="w-full md:w-auto border-slate-200 text-slate-600" disabled>Chờ chấm điểm</Button>
              ) : task.type === 'H5P' ? (
                 <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-[0_4px_0_#2563eb] hover:shadow-[0_2px_0_#2563eb] hover:translate-y-[2px] transition-all font-bold">Làm bài H5P</Button>
              ) : (
                 <Button onClick={() => handleOpenSubmit(task)} className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-[0_4px_0_#16a34a] hover:shadow-[0_2px_0_#16a34a] hover:translate-y-[2px] transition-all font-bold">
                   {task.status === 'YC_LAM_LAI' ? 'Nộp lại bài' : 'Nộp bài tự luận'}
                 </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Nộp Bài Tự Luận */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-slate-50 border-b border-slate-100 p-4 flex justify-between items-center">
               <h2 className="font-bold text-lg text-slate-800 flex items-center">
                 <FileText className="w-5 h-5 mr-2 text-blue-600" />
                 Nộp bài: {selectedTask?.title}
               </h2>
               <button onClick={() => setIsSubmitModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                 <X className="w-6 h-6" />
               </button>
            </div>
            
            <div className="p-6 space-y-4">
               <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">Nhập nội dung bài làm</label>
                 <textarea 
                   className="w-full h-40 border border-slate-300 rounded-xl p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none text-sm"
                   placeholder="Em viết đoạn văn vào đây nhé..."
                 ></textarea>
               </div>
               
               <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-6 h-6 text-slate-500 mb-2" />
                          <p className="text-sm text-slate-500 font-medium">Hoặc đính kèm file (Ảnh, Word, PDF)</p>
                      </div>
                      <input type="file" className="hidden" />
                  </label>
               </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end space-x-3 bg-slate-50">
               <Button onClick={() => setIsSubmitModalOpen(false)} variant="outline" className="border-slate-300 text-slate-600 hover:bg-slate-100 font-bold">Lưu Nháp</Button>
               <Button onClick={() => setIsSubmitModalOpen(false)} className="bg-green-500 hover:bg-green-600 text-white shadow-[0_4px_0_#16a34a] hover:shadow-[0_2px_0_#16a34a] hover:translate-y-[2px] transition-all font-bold">Gửi Bài</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
