// Dữ liệu Môn học (Dashboard)
export const dashboardSubjects = [
  { id: 'math', name: 'Toán Học', desc: 'Khám phá thế giới của những con số', icon: 'https://img.icons8.com/color/96/calculator--v1.png', color: 'bg-white border-slate-200 text-blue-700', btnColor: 'bg-blue-50 text-blue-600 hover:bg-blue-100', trackColor: 'bg-slate-100', barColor: 'bg-blue-500', progress: 60 },
  { id: 'viet', name: 'Tiếng Việt', desc: 'Luyện đọc và viết chữ thật hay', icon: 'https://img.icons8.com/color/96/books.png', color: 'bg-white border-slate-200 text-orange-700', btnColor: 'bg-orange-50 text-orange-600 hover:bg-orange-100', trackColor: 'bg-slate-100', barColor: 'bg-orange-500', progress: 85 },
  { id: 'science', name: 'Tự nhiên Xã hội', desc: 'Tìm hiểu về thế giới quanh ta', icon: 'https://img.icons8.com/color/96/globe--v1.png', color: 'bg-white border-slate-200 text-green-700', btnColor: 'bg-green-50 text-green-600 hover:bg-green-100', trackColor: 'bg-slate-100', barColor: 'bg-green-500', progress: 20 }
];

export const upcomingTasks = [
  { id: 1, title: 'Luyện tập phép cộng trừ', subject: 'Toán', time: '3 giờ nữa' },
  { id: 2, title: 'Tả con vật nuôi', subject: 'Tiếng Việt', time: 'Ngày mai' }
];

export const recentNotifications = [
  { id: 1, title: 'Nghỉ học ngày mai do bão', isNew: true },
  { id: 2, title: 'Thưởng nóng 50 Kim cương!', isNew: false }
];

// Dữ liệu Bài tập (Assignments)
export const assignmentTasks = [
  { id: 1, title: 'Tả con vật nuôi trong nhà', subject: 'Tiếng Việt', type: 'TU_LUAN', status: 'CHUA_NOP', deadline: '20/06/2026 23:59', timeRemaining: '2 ngày', isLate: false },
  { id: 2, title: 'Luyện tập phép cộng trừ', subject: 'Toán Học', type: 'H5P', status: 'CHUA_NOP', deadline: '18/06/2026 17:00', timeRemaining: '3 giờ', isLate: false },
  { id: 3, title: 'Viết thư cho bạn', subject: 'Tiếng Việt', type: 'TU_LUAN', status: 'YC_LAM_LAI', deadline: '17/06/2026 23:59', timeRemaining: 'Quá hạn', isLate: true },
  { id: 4, title: 'Các số có 6 chữ số', subject: 'Toán Học', type: 'H5P', status: 'DA_NOP', deadline: '15/06/2026', timeRemaining: '-', isLate: false },
];

// Dữ liệu Thông báo (Notifications)
export const allNotifications = [
  { id: 1, title: 'Nghỉ học ngày mai do bão', content: 'Các con ở nhà chú ý an toàn nhé, cô sẽ gửi bài tập H5P lên hệ thống.', date: '18/06/2026 08:30', read: false, type: 'NOI_BO', pinned: true },
  { id: 2, title: 'Thưởng nóng 50 Kim cương!', content: 'Cô khen cả lớp hôm qua đã nộp bài đầy đủ và đúng hạn. Mỗi bạn được cộng 50 Kim cương nhé!', date: '17/06/2026 15:00', read: true, type: 'KHEN_THUONG', pinned: false },
  { id: 3, title: 'Nhắc nhở làm bài tập Toán', content: 'Hiện tại vẫn còn 5 bạn chưa nộp bài tập Số Tự Nhiên, các con tranh thủ làm trước 9h tối nay.', date: '16/06/2026 14:20', read: true, type: 'NOI_BO', pinned: false },
];

// Dữ liệu Thành tích & Thư khen (Rewards)
export const rewardBadges = [
  { id: 1, name: 'Vua Toán Học', desc: 'Đạt điểm tuyệt đối 3 bài kiểm tra Toán', icon: 'https://img.icons8.com/color/96/crown.png', date: '15/06/2026', unlocked: true },
  { id: 2, name: 'Chăm Chỉ', desc: 'Hoàn thành bài tập 7 ngày liên tiếp', icon: 'https://img.icons8.com/color/96/star--v1.png', date: '10/06/2026', unlocked: true },
  { id: 3, name: 'Bút Vàng', desc: 'Hoàn thành bài tập Tiếng Việt xuất sắc', icon: 'https://img.icons8.com/color/96/pen.png', date: '05/06/2026', unlocked: true },
  { id: 4, name: 'Siêu Tốc Độ', desc: 'Hoàn thành bài tập sớm nhất lớp', icon: 'https://img.icons8.com/color/96/rocket.png', date: '', unlocked: false },
  { id: 5, name: 'Nhà Thám Hiểm', desc: 'Hoàn thành 50% chương trình Tự nhiên XH', icon: 'https://img.icons8.com/color/96/map-marker--v1.png', date: '', unlocked: false },
];

export const rewardLetters = [
  { id: 1, teacher: 'Cô Lan', subject: 'Tiếng Việt', content: 'Cô rất tự hào về An, con đã có một bài viết miêu tả con vật rất sinh động và giàu cảm xúc. Cố gắng phát huy nhé!', date: '12/06/2026' },
  { id: 2, teacher: 'Thầy Hùng', subject: 'Toán Học', content: 'Tuần qua An làm bài tập rất nhanh và chính xác. Tinh thần tự học của con rất đáng khen ngợi!', date: '08/06/2026' }
];

// Dữ liệu Lộ trình Chương học (SubjectTree)
export const subjectChapters = [
  {
    id: 1,
    title: 'Chương 1: Số Tự Nhiên',
    icon: 'https://img.icons8.com/color/96/1-circle.png',
    lessons: [
      { id: 101, title: 'Ôn tập các số đến 100,000', type: 'video', status: 'completed' },
      { id: 102, title: 'Biểu thức có chứa một chữ', type: 'h5p', status: 'completed' },
      { id: 103, title: 'Các số có sáu chữ số', type: 'document', status: 'current' },
    ]
  },
  {
    id: 2,
    title: 'Chương 2: Bốn Phép Tính',
    icon: 'https://img.icons8.com/color/96/math.png',
    lessons: [
      { id: 201, title: 'Phép cộng', type: 'h5p', status: 'locked' },
      { id: 202, title: 'Phép trừ', type: 'h5p', status: 'locked' },
      { id: 203, title: 'Biểu thức có chứa hai chữ', type: 'video', status: 'locked' },
    ]
  }
];
