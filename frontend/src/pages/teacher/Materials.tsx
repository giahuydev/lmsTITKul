import { useState } from 'react';
import { Search, Plus, Filter, Folder, FileText, Star, Lock, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Link } from 'react-router-dom';

export default function TeacherMaterials() {
  const [activeTab, setActiveTab] = useState('my-library');
  const [viewMaterial, setViewMaterial] = useState<any>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Kho Học Liệu</h1>
        <div className="flex space-x-2">
          <Link to="/teacher/editor">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Star className="h-4 w-4 mr-2" />
              Soạn H5P mới
            </Button>
          </Link>
          <div>
            <input type="file" id="upload-material" className="hidden" accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.rar" />
            <Button variant="outline" onClick={() => document.getElementById('upload-material')?.click()}>
              <Plus className="h-4 w-4 mr-2" />
              Tải lên File
            </Button>
          </div>
        </div>
      </div>

      <div className="flex space-x-4 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('my-library')}
          className={`pb-3 font-medium text-sm transition-colors relative ${
            activeTab === 'my-library' ? 'text-primary' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Kho cá nhân của tôi
          {activeTab === 'my-library' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />}
        </button>
        <button
          onClick={() => setActiveTab('shared-library')}
          className={`pb-3 font-medium text-sm transition-colors relative ${
            activeTab === 'shared-library' ? 'text-primary' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Thư viện gốc (Kết nối tri thức)
          {activeTab === 'shared-library' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />}
        </button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input className="pl-9" placeholder="Tìm kiếm tài liệu, bài giảng..." />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select className="px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary font-bold text-slate-700">
            <option value="all">Tất cả Khối</option>
            <option value="1">Khối 1</option>
            <option value="2">Khối 2</option>
            <option value="3">Khối 3</option>
            <option value="4">Khối 4</option>
            <option value="5">Khối 5</option>
          </select>
          <select className="px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary">
            <option>Tất cả môn học</option>
            <option>Toán học</option>
            <option>Tiếng Việt</option>
            <option>Đạo đức</option>
            <option>Tự nhiên & Xã hội</option>
          </select>
        </div>
      </div>

      {activeTab === 'my-library' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer group" onClick={() => setViewMaterial({ title: 'Toán học Lớp 5', type: 'Folder', shared: false })}>
            <CardContent className="p-4 flex flex-col items-center justify-center text-center h-48">
              <Folder className="h-12 w-12 text-primary/40 group-hover:text-primary transition-colors mb-3" />
              <h3 className="font-bold text-slate-800">Toán học Lớp 5</h3>
              <p className="text-xs text-slate-500 mt-1">12 Tài liệu</p>
            </CardContent>
          </Card>
          
          <Card className="hover:border-primary/50 transition-colors cursor-pointer group" onClick={() => setViewMaterial({ title: 'Bài giảng: Phân số (H5P)', type: 'H5P' })}>
            <CardContent className="p-4 flex flex-col items-center text-center h-48">
              <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center mb-3">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Bài giảng: Phân số (H5P)</h3>
              <div className="mt-auto flex gap-2">
                <Badge variant="outline" className="text-[10px]">Lớp 5</Badge>
                <Badge variant="outline" className="text-[10px] text-orange-600 border-orange-200">H5P</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'shared-library' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-50 border-slate-200 opacity-90 relative overflow-hidden">
            <div className="absolute top-2 right-2 flex items-center bg-slate-200/50 px-2 py-1 rounded text-xs text-slate-600 font-medium">
              <Lock className="w-3 h-3 mr-1" /> Read-only
            </div>
            <CardContent className="p-4 flex flex-col items-center text-center h-48">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-3 mt-4">
                <Folder className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Toán 5 - Kết nối tri thức</h3>
              <p className="text-xs text-slate-500 mt-1">Sở GDĐT cấp (30 Bài)</p>
              <Button variant="outline" size="sm" className="mt-auto w-full" onClick={() => setViewMaterial({ title: 'Toán 5 - Kết nối tri thức', type: 'Folder', shared: true })}>Xem chi tiết</Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Chi tiết Học Liệu */}
      {viewMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-[600px] rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">Chi tiết Học liệu</h3>
              <button onClick={() => setViewMaterial(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-start space-x-4">
                <div className="h-16 w-16 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                  {viewMaterial.type === 'Folder' ? (
                    <Folder className="h-8 w-8 text-blue-600" />
                  ) : (
                    <FileText className="h-8 w-8 text-orange-600" />
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">{viewMaterial.title}</h2>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">Môn: Toán học</Badge>
                    <Badge variant="outline">Khối: 5</Badge>
                    {viewMaterial.shared && <Badge variant="warning">Thư viện Gốc</Badge>}
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-600">
                Đây là tài liệu được sử dụng cho tuần học số 12. Bao gồm các nội dung liên quan đến Phân số và các phép tính cơ bản.
              </div>
              
              {viewMaterial.type === 'Folder' && (
                <div>
                  <h4 className="font-bold text-sm text-slate-800 mb-2">Các file bên trong (3)</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 border border-slate-100 rounded hover:bg-slate-50">
                      <div className="flex items-center text-sm">
                        <FileText className="w-4 h-4 text-slate-400 mr-2" /> Phép cộng phân số.pdf
                      </div>
                      <Button variant="ghost" size="sm">Xem</Button>
                    </div>
                    <div className="flex justify-between items-center p-2 border border-slate-100 rounded hover:bg-slate-50">
                      <div className="flex items-center text-sm">
                        <FileText className="w-4 h-4 text-slate-400 mr-2" /> Phép trừ phân số.pdf
                      </div>
                      <Button variant="ghost" size="sm">Xem</Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-between border-t border-slate-100">
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">Xóa tài liệu</Button>
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => setViewMaterial(null)}>Đóng</Button>
                  <Button className="bg-primary hover:bg-primary/90">Giao bài cho lớp</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
