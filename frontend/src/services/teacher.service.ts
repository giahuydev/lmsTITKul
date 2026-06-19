import { api } from '../lib/axios';

// ===== Interfaces (Types phản ánh cấu trúc JSON từ Backend) =====

export interface ClassRoom {
  id: number;
  name: string;
  grade: number;
  academicYear: string;
  maxCapacity: number;
  status: string;
}

export interface Material {
  id: number;
  title: string;
  materialType: 'TAI_LIEU' | 'BAI_GIANG_H5P' | 'BAI_TAP_H5P';
  origin: string;
  xpReward: number;
  allowRetry: boolean;
}

export interface Assignment {
  id: number;
  title: string;
  description: string;
  type: string;
  deadline: string;
  status: string;
  isHardLock: boolean;
  createdAt: string;
}

export interface Submission {
  id: number;
  textContent: string;
  attachmentUrl: string;
  h5pScore: number | null;
  xpEarned: number;
  attemptNumber: number;
  status: 'CHUA_NOP' | 'DA_NOP' | 'DA_CHAM' | 'YEU_CAU_LAM_LAI' | 'LUU_NHAP';
  isLate: boolean;
  submittedAt: string;
}

export interface AssignmentCreateDTO {
  title: string;
  description: string;
  classId: number;
  teacherId: number;
  type: string;
  deadline: string;
  isHardLock: boolean;
}

export interface EvaluateDTO {
  teacherId: number;   // ID giáo viên chấm bài (bắt buộc)
  grade: string;       // Enum: HOAN_THANH_TOT, HOAN_THANH, CHUA_HOAN_THANH
  comment: string;
  action: string;      // Enum: DUYET, YC_LAM_LAI
  reason?: string;
}

// ===== Service =====

export const teacherService = {
  // Lấy danh sách tất cả lớp học
  getClasses: async (): Promise<ClassRoom[]> => {
    const response = await api.get<ClassRoom[]>('/classes');
    return response.data;
  },

  // Lấy danh sách học liệu để chọn giao bài
  getMaterials: async (): Promise<Material[]> => {
    const response = await api.get<Material[]>('/materials');
    return response.data;
  },

  // Giao bài tập mới
  createAssignment: async (dto: AssignmentCreateDTO): Promise<Assignment> => {
    const response = await api.post<Assignment>('/assignments', dto);
    return response.data;
  },

  // Lấy danh sách bài nộp theo ID bài tập
  getSubmissions: async (assignmentId: number): Promise<Submission[]> => {
    const response = await api.get<Submission[]>(`/assignments/${assignmentId}/submissions`);
    return response.data;
  },

  // Lấy danh sách bài tập của một lớp
  getAssignmentsByClass: async (classId: number): Promise<Assignment[]> => {
    const response = await api.get<{ content: Assignment[] }>(`/assignments?classId=${classId}`);
    return response.data.content;
  },

  evaluateSubmission: async (submissionId: number, dto: EvaluateDTO): Promise<any> => {
    const response = await api.post(`/submissions/${submissionId}/evaluate`, dto);
    return response.data;
  },

  getAllTeachers: async (): Promise<any[]> => {
    const response = await api.get('/teachers');
    return response.data;
  }
};
