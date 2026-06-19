import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../stores/useAuthStore';
import { authService } from '../../services/auth.service';
import { User, Lock, Sparkles, Paperclip } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 1. Gửi request Login
      const authData = await authService.login({ username, password });

      // 2. Lưu vào Zustand (Sử dụng accessToken và user từ authData)
      setAuth(authData.accessToken, authData.user);

      // 3. Chuyển hướng
      if (authData.user.requirePasswordChange) {
        navigate('/force-change-password');
      } else {
        switch (authData.user.role) {
          case 'ADMIN': navigate('/admin'); break;
          case 'GIAO_VIEN': navigate('/teacher'); break;
          case 'HOC_SINH': navigate('/student'); break;
          case 'PHU_HUYNH': navigate('/parent'); break;
          default: navigate('/');
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // Xử lý lỗi chuẩn từ Backend (errorCode, message, details)
      const errorMessage = err.response?.data?.message || 'Biệt danh hoặc mật mã chưa đúng rồi!';
      const details = err.response?.data?.details;

      if (details && details.length > 0) {
        setError(`${errorMessage}: ${details[0].issue}`);
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-[34px] font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] pb-1">
          Đến giờ học rồi!
        </h1>
        <p className="text-slate-600 mt-2 font-semibold text-[14px]">Gõ biệt danh và mật mã bí mật của bạn vào đây nhé! 🚀</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6" autoComplete="off">
        {error && (
          <div className="p-4 rounded-3xl bg-red-50/90 border-2 border-red-100 text-red-600 text-[15px] font-bold flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <div className="space-y-5">
          <Input
            label={<><User size={18} className="text-[#8b5cf6]" /> Biệt danh</>}
            placeholder="Tên của bạn là gì nhỉ?..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="new-password"
            className="h-[52px] text-[16px]"
          />

          <Input
            label={<><Lock size={18} className="text-[#8b5cf6]" /> Mật mã bí mật</>}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            className="h-[52px] text-[20px] tracking-[0.2em]"
          />
        </div>

        <div className="flex items-center justify-between mt-4">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative flex items-center justify-center w-[22px] h-[22px]">
              <input type="checkbox" className="peer w-full h-full appearance-none rounded-md bg-white border-2 border-white/60 checked:bg-purple-500 checked:border-purple-500 transition-all cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-purple-500/30 shadow-sm" />
              <svg className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <span className="text-[14px] text-slate-700 font-bold group-hover:text-slate-900 transition-colors flex items-center gap-1.5"><Paperclip size={14} className="text-slate-500" /> Nhớ mặt tớ nha!</span>
          </label>
        </div>

        <Button type="submit" variant="kids" className="w-full h-[56px] text-[17px] font-black mt-8 uppercase tracking-widest group rounded-full" isLoading={isLoading}>
          <span className="flex items-center gap-2.5 drop-shadow-md">
            <Sparkles size={20} className="group-hover:animate-spin text-yellow-200" /> BẮT ĐẦU HỌC NÀO!
          </span>
        </Button>

        <div className="text-center mt-6">
          <Link to="/forgot-password" className="text-[14px] font-bold text-slate-500 hover:text-purple-600 transition-colors underline decoration-2 underline-offset-4">
            Quên mật mã à? Nhờ người lớn giúp bạn nha!
          </Link>
        </div>
      </form>
    </div>
  );
}
