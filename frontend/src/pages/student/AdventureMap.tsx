import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Lock, Star, CheckCircle, Cloud, Bot } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function StudentAdventureMap() {
  const { subjectId } = useParams();
  
  const nodes = [
    { id: 1, title: 'Ải 1: Bí ẩn Phân số', status: 'completed', stars: 3, top: '20%', left: '20%' },
    { id: 2, title: 'Trạm 2: Cộng trừ cơ bản', status: 'completed', stars: 2, top: '40%', left: '50%' },
    { id: 3, title: 'Ải 3: Rừng Phép thuật', status: 'current', stars: 0, top: '60%', left: '30%' },
    { id: 4, title: 'Trạm 4: Lâu đài Thử thách', status: 'locked', stars: 0, top: '80%', left: '60%' },
    { id: 5, title: 'Boss: Rồng Khổng Lồ', status: 'locked', stars: 0, top: '20%', left: '80%' }, // Wrap around or scroll
  ];

  return (
    <div className="flex-1 flex flex-col relative hide-scrollbar overflow-y-auto">
      {/* Nút quay lại */}
      <div className="absolute top-6 left-6 z-20">
        <Link to="/student">
          <Button variant="outline" className="bg-slate-800/80 border-slate-600 text-white hover:bg-slate-700 rounded-full px-4">
            <ArrowLeft className="w-5 h-5 mr-2" /> Quay lại Bản đồ Chính
          </Button>
        </Link>
      </div>

      {/* Tên Hành tinh */}
      <div className="absolute top-6 right-6 z-20">
        <div className="bg-blue-600/80 backdrop-blur-md border border-blue-400 px-6 py-2 rounded-full shadow-[0_0_15px_#3b82f6]">
          <h2 className="text-xl font-black text-white">Hành tinh Toán Học</h2>
        </div>
      </div>

      {/* The Map Area */}
      <div className="relative w-full h-[1200px] mt-24">
        {/* Đường nối mờ mờ (SVG Path) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          <path 
            d="M 25% 20% Q 50% 20% 50% 40% T 30% 60% T 60% 80% T 80% 20%" 
            fill="none" 
            stroke="rgba(255,255,255,0.1)" 
            strokeWidth="20" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeDasharray="40 40"
          />
          <path 
            d="M 25% 20% Q 50% 20% 50% 40% T 30% 60%" 
            fill="none" 
            stroke="rgba(167, 139, 250, 0.6)" 
            strokeWidth="20" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>

        {/* Các Nodes */}
        {nodes.map((node) => (
          <div 
            key={node.id} 
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-10"
            style={{ top: node.top, left: node.left }}
          >
            {/* Nhãn Tên Bài */}
            <div className={`mb-3 px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap shadow-lg transition-transform ${
              node.status === 'locked' ? 'bg-slate-700/80 text-slate-400' : 
              node.status === 'current' ? 'bg-amber-500 text-amber-900 scale-110 animate-bounce-subtle' : 
              'bg-blue-500 text-white'
            }`}>
              {node.title}
            </div>

            {/* Nút Node */}
            {node.status === 'locked' ? (
              <div className="w-20 h-20 bg-slate-800 rounded-full border-4 border-slate-600 flex items-center justify-center relative shadow-inner">
                <Cloud className="absolute -top-4 -left-4 w-12 h-12 text-slate-700/50" />
                <Cloud className="absolute -bottom-2 -right-4 w-10 h-10 text-slate-700/50" />
                <Lock className="w-8 h-8 text-slate-500" />
              </div>
            ) : node.status === 'current' ? (
              <Link to={`/student/lesson/${node.id}`}>
                <div className="w-24 h-24 bg-gradient-to-br from-amber-300 to-orange-500 rounded-full border-4 border-white flex items-center justify-center shadow-[0_0_30px_#f59e0b] animate-pulse-glow cursor-pointer hover:scale-110 transition-transform relative">
                  <div className="absolute inset-0 rounded-full border-4 border-dashed border-white/50 animate-[spin_4s_linear_infinite]"></div>
                  <span className="text-white font-black text-3xl drop-shadow-md">{node.id}</span>
                </div>
              </Link>
            ) : (
              <Link to={`/student/lesson/${node.id}`}>
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full border-4 border-white flex flex-col items-center justify-center shadow-[0_0_20px_#3b82f6] cursor-pointer hover:scale-110 transition-transform relative">
                  <CheckCircle className="absolute -top-2 -right-2 w-8 h-8 text-green-400 bg-white rounded-full" />
                  <span className="text-white font-black text-2xl drop-shadow-md">{node.id}</span>
                  <div className="flex space-x-1 mt-1">
                    {[1,2,3].map(s => (
                      <Star key={s} className={`w-3 h-3 ${s <= node.stars ? 'text-yellow-300 fill-yellow-300' : 'text-indigo-300'}`} />
                    ))}
                  </div>
                </div>
              </Link>
            )}
          </div>
        ))}

        {/* Mascot Gemma2 */}
        <div className="absolute bottom-20 right-20 flex items-end animate-float-delayed z-20">
          <div className="bg-white text-indigo-900 px-4 py-3 rounded-2xl rounded-br-none shadow-xl mb-4 mr-4 font-bold max-w-[200px] border-2 border-indigo-200">
            Hôm nay mình khám phá "Rừng Phép thuật" nhé!
          </div>
          <div className="w-24 h-24 bg-indigo-500 rounded-full border-4 border-indigo-300 flex items-center justify-center shadow-[0_0_20px_#6366f1]">
            <Bot className="w-12 h-12 text-white" />
          </div>
        </div>

      </div>
    </div>
  );
}
