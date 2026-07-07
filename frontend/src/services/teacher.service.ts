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
  type: 'TAI_LIEU' | 'BAI_GIANG_H5P' | 'BAI_TAP_H5P';
  origin: 'THU_VIEN_GOC' | 'GIAO_VIEN_TAO';
  fileUrl: string | null;
  h5pContentId: string | null;
  xpReward: number;
  allowRetry: boolean;
  maxRetryCount: number | null;
  createdAt: string;
  teacherUserId: number | null;
}

export interface Assignment {
  id: number;
  title: string;
  description: string;
  type: string;
  deadline: string;
  status: string;
  maxResubmitCount: number;
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
  maxResubmitCount: number;
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

  // Lấy danh sách học liệu (Kho học liệu). Truyền giaoVienId để lọc "kho cá nhân của tôi".
  getMaterials: async (giaoVienId?: number): Promise<Material[]> => {
    const response = await api.get<Material[]>('/hoc-lieu', {
      params: giaoVienId ? { giaoVienId } : undefined,
    });
    return response.data;
  },

  getMaterialById: async (id: number | string): Promise<Material> => {
    const response = await api.get<Material>(`/hoc-lieu/${id}`);
    return response.data;
  },

  deleteMaterial: async (id: number | string): Promise<void> => {
    await api.delete(`/hoc-lieu/${id}`);
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
  },

  getReports: async (): Promise<any> => {
    const response = await api.get('/teachers/me/reports');
    return response.data;
  },
};
