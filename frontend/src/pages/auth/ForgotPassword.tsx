import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Xác thực thành công (Mock)!");
    navigate('/login');
  };

  return (
    <div>
      <div className="mb-6">
        <Link to="/login" className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại đăng nhập
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Quên mật khẩu</h1>
        <p className="text-slate-500 mt-2">
          {step === 1 ? 'Nhập Email hoặc SĐT để nhận mã OTP' : 'Nhập mã OTP đã được gửi đến bạn'}
        </p>
      </div>

      {step === 1 ? (
        <form onSubmit={handleSendOTP} className="space-y-6">
          <Input 
            label="Email hoặc Số điện thoại" 
            placeholder="Ví dụ: 0901234567" 
            required 
          />
          <Button type="submit" className="w-full">
            Gửi mã xác nhận (OTP)
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-6">
          <Input 
            label="Mã OTP (6 chữ số)" 
            placeholder="123456" 
            maxLength={6}
            required 
          />
          <Input 
            label="Mật khẩu mới" 
            type="password" 
            placeholder="••••••••" 
            required 
          />
          <Button type="submit" className="w-full">
            Xác nhận đổi mật khẩu
          </Button>
        </form>
      )}
    </div>
  );
}
