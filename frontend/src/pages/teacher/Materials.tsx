import { useState } from 'react';
import { Search, Plus, Filter, Folder, FileText, Star, Lock } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Link, useNavigate } from 'react-router-dom';

export default function TeacherMaterials() {
  const [activeTab, setActiveTab] = useState('my-library');
  const navigate = useNavigate();

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
          <Card className="hover:border-primary/50 transition-colors cursor-pointer group" onClick={() => navigate('/teacher/materials/1')}>
            <CardContent className="p-4 flex flex-col items-center justify-center text-center h-48">
              <Folder className="h-12 w-12 text-primary/40 group-hover:text-primary transition-colors mb-3" />
              <h3 className="font-bold text-slate-800">Toán học Lớp 5</h3>
              <p className="text-xs text-slate-500 mt-1">12 Tài liệu</p>
            </CardContent>
          </Card>
          
          <Card className="hover:border-primary/50 transition-colors cursor-pointer group" onClick={() => navigate('/teacher/materials/2')}>
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
              <Button variant="outline" size="sm" className="mt-auto w-full" onClick={() => navigate('/teacher/materials/3')}>Xem chi tiết</Button>
            </CardContent>
          </Card>
        </div>
      )}

    </div>
  );
}
