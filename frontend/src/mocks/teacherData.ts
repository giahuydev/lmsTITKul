export const teacherStudents = [
  { id: 1, name: 'Nguyễn Văn An', math: 'Tốt', viet: 'Tốt', avg: 'Tốt', isExcellent: true },
  { id: 2, name: 'Trần Thị Bình', math: 'Đạt', viet: 'Tốt', avg: 'Đạt', isExcellent: false },
];

export const teacherSubmissions = [
  { id: 1, student: 'Nguyễn Văn An', task: 'Viết đoạn văn tả con vật', type: 'Tu_Luan', date: '10/06 14:30', status: 'DA_NOP', late: false },
  { id: 2, student: 'Trần Thị Bình', task: 'Bài tập trắc nghiệm H5P', type: 'H5P', date: '10/06 15:45', status: 'DA_CHAM', late: false, score: 'Hoàn thành tốt' },
];

export const teacherClasses = [
  { id: 1, name: 'Lớp 5A', role: 'GV Chủ Nhiệm', students: 35 },
  { id: 2, name: 'Lớp 5B', role: 'GV Bộ Môn', students: 40 },
];

export const teacherTickets = [
  { id: 'T-001', student: 'Nguyễn Văn An', request: 'Cấp lại mật khẩu', status: 'PENDING', date: '18/06/2026' },
  { id: 'T-002', student: 'Trần Thị Bình', request: 'Sửa sai thông tin ngày sinh', status: 'RESOLVED', date: '15/06/2026' }
];

export const teacherClassStudents = [
  { id: 1, code: 'HS001', name: 'Nguyễn Văn An', dob: '15/03/2015', parentName: 'Nguyễn Văn Bình', phone: '0901234567', evaluation: 'Hoàn thành Tốt', attendance: 100, badges: 5 },
  { id: 2, code: 'HS002', name: 'Trần Thị Bình', dob: '22/07/2015', parentName: 'Trần Văn Cường', phone: '0912345678', evaluation: 'Hoàn thành', attendance: 95, badges: 2 },
  { id: 3, code: 'HS003', name: 'Lê Hoàng Cường', dob: '10/01/2015', parentName: 'Lê Văn Dũng', phone: '0987654321', evaluation: 'Chưa hoàn thành', attendance: 85, badges: 0 },
  { id: 4, code: 'HS004', name: 'Phạm Thị Dung', dob: '05/11/2015', parentName: 'Phạm Văn Em', phone: '0909876543', evaluation: 'Hoàn thành Tốt', attendance: 98, badges: 4 },
  { id: 5, code: 'HS005', name: 'Hoàng Văn Em', dob: '30/08/2015', parentName: 'Hoàng Văn Phát', phone: '0933456789', evaluation: 'Hoàn thành', attendance: 90, badges: 1 }
];
