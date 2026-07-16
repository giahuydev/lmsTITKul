import { Link } from 'react-router-dom';
import { ArrowLeft, Lock, Star, CheckCircle, Cloud } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import titiMascot from '../../assets/titi-2d.png';

export default function StudentAdventureMap() {
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
          <Button variant="outline" className="bg-white border-student-border text-student-fg hover:bg-student-primary/5 rounded-full px-4">
            <ArrowLeft className="w-5 h-5 mr-2" /> Quay lại Bản đồ Chính
          </Button>
        </Link>
      </div>

      {/* Tên Hành tinh */}
      <div className="absolute top-6 right-6 z-20">
        <div className="bg-student-primary border border-student-primary/50 px-6 py-2 rounded-full shadow-clay-sm">
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
            stroke="rgba(75,158,255,0.15)"
            strokeWidth="20" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeDasharray="40 40"
          />
          <path 
            d="M 25% 20% Q 50% 20% 50% 40% T 30% 60%" 
            fill="none" 
            stroke="rgba(129,140,248,0.5)"
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
              node.status === 'locked' ? 'bg-slate-200 text-slate-400' :
              node.status === 'current' ? 'bg-amber-500 text-amber-900 scale-110 animate-bounce-subtle' :
              'bg-student-primary text-white'
            }`}>
              {node.title}
            </div>

            {/* Nút Node */}
            {node.status === 'locked' ? (
              <div className="w-20 h-20 bg-slate-100 rounded-full border-4 border-slate-300 flex items-center justify-center relative shadow-inner">
                <Cloud className="absolute -top-4 -left-4 w-12 h-12 text-slate-300" />
                <Cloud className="absolute -bottom-2 -right-4 w-10 h-10 text-slate-300" />
                <Lock className="w-8 h-8 text-slate-400" />
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
                <div className="w-20 h-20 bg-gradient-to-br from-student-primary to-student-accent rounded-full border-4 border-white flex flex-col items-center justify-center shadow-[0_0_20px_rgba(75,158,255,0.5)] cursor-pointer hover:scale-110 transition-transform relative">
                  <CheckCircle className="absolute -top-2 -right-2 w-8 h-8 text-student-success bg-white rounded-full" />
                  <span className="text-white font-black text-2xl drop-shadow-md">{node.id}</span>
                  <div className="flex space-x-1 mt-1">
                    {[1,2,3].map(s => (
                      <Star key={s} className={`w-3 h-3 ${s <= node.stars ? 'text-yellow-300 fill-yellow-300' : 'text-white/40'}`} />
                    ))}
                  </div>
                </div>
              </Link>
            )}
          </div>
        ))}

        {/* Mascot Tit */}
        <div className="absolute bottom-20 right-20 flex items-end animate-float-delayed z-20">
          <div className="bg-white text-student-fg px-4 py-3 rounded-2xl rounded-br-none shadow-xl mb-4 mr-4 font-bold max-w-[200px] border-2 border-student-primary/20">
            Hôm nay mình khám phá "Rừng Phép thuật" nhé!
          </div>
          <div className="w-24 h-24 rounded-full border-4 border-white shadow-clay-md overflow-hidden">
            <img src={titiMascot} alt="Tit - người bạn đồng hành học tập" className="w-full h-full object-cover" />
          </div>
        </div>

      </div>
    </div>
  );
}
