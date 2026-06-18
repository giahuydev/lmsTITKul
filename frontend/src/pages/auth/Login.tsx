import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState<'admin' | 'teacher' | 'parent'>('admin');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate(`/${role}`);
    }, 500);
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Đăng nhập Titkul Kids</h1>
        <p className="text-slate-500 mt-2">Hệ thống quản lý học tập</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <Input 
          label="Tài khoản" 
          placeholder="Email hoặc Số điện thoại" 
          required 
        />
        
        <Input 
          label="Mật khẩu" 
          type="password" 
          placeholder="••••••••" 
          required 
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Đăng nhập với vai trò (Dành cho Test)
          </label>
          <select 
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="admin">Admin</option>
            <option value="teacher">Giáo viên</option>
            <option value="parent">Phụ huynh</option>
          </select>
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Đăng nhập
        </Button>
      </form>
    </div>
  );
}
