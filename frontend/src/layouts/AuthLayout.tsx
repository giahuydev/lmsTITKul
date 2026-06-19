import { Outlet } from 'react-router-dom';
import titiBg from '../assets/pastel-galaxy.png';
import { Star } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen font-sans bg-white overflow-hidden">
      {/* Left side: Titi Galaxy Background */}
      <div className="hidden lg:block lg:w-[45%] relative">
        <img src={titiBg} alt="Rùa Titi Galaxy" className="absolute inset-0 w-full h-full object-cover object-center" />
      </div>

      {/* Right side: Gradient Panel with Zigzag/Scalloped Border */}
      <div 
        className="flex-1 lg:w-[55%] flex items-center justify-center p-8 sm:p-12 relative bg-gradient-to-br from-[#f8d0ff] via-[#c4e0ff] to-[#f8d0ff] z-10"
      >
        {/* Soft Overlapping Zigzag Border */}
        <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-[40px] -translate-x-[39px] z-[-1]" 
             style={{ 
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='80' viewBox='0 0 40 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0 C 0 10, 0 30, 40 40 C 0 50, 0 70, 40 80 Z' fill='%23f8d0ff'/%3E%3C/svg%3E")`,
               backgroundSize: '40px 80px',
               backgroundRepeat: 'repeat-y',
               filter: 'drop-shadow(-15px 0 25px rgba(248, 208, 255, 0.8)) drop-shadow(-5px 0 10px rgba(196, 224, 255, 0.5))'
             }}>
        </div>
        
        {/* Decorative elements */}
        <div className="hidden lg:block absolute left-[-30px] bottom-[25%] animate-[pulse_3s_infinite_1000ms] z-[2]">
          <Star className="text-yellow-200 fill-yellow-200 w-10 h-10 drop-shadow-[0_0_15px_rgba(253,224,71,0.8)] rotate-12" />
        </div>
        
        <div className="hidden lg:flex absolute left-[-15px] bottom-[10%] animate-[bounce_3s_infinite_200ms] z-[2]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-300/60 to-rose-400/20 backdrop-blur-sm shadow-[inset_0_2px_5px_rgba(255,255,255,0.6),_0_8px_15px_rgba(244,114,182,0.2)] border border-white/40"></div>
        </div>

        {/* Enhanced Form Container (Glassmorphism) */}
        <div className="w-full max-w-[420px] relative z-10 bg-white/75 backdrop-blur-[24px] px-10 py-12 rounded-[40px] shadow-[0_20px_60px_-15px_rgba(124,58,237,0.15)] border-[1.5px] border-white/80">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
