import { api } from '../lib/axios';

export interface Material {
  id: number;
  title: string;
  type: 'TAI_LIEU' | 'BAI_GIANG_H5P' | 'BAI_TAP_H5P';
  origin: 'THU_VIEN_GOC' | 'GIAO_VIEN_TAO';
  fileUrl: string | null;
  h5pContentId: string | null;
  xpReward: number;
  allowRetry: boolean;
}

export const studentService = {
  getMaterials: async (): Promise<Material[]> => {
    const response = await api.get<Material[]>('/hoc-lieu');
    return response.data;
  },
  
  getDashboard: async () => {
    const response = await api.get('/students/me/dashboard');
    return response.data;
  },
  
  getAssignments: async () => {
    const response = await api.get('/students/me/assignments');
    return response.data;
  },

  getNotifications: async () => {
    const response = await api.get('/students/me/notifications');
    return response.data;
  },

  markNotificationRead: async (notificationId: number) => {
    await api.post(`/students/me/notifications/${notificationId}/read`);
  },

  markAllNotificationsRead: async () => {
    await api.post('/students/me/notifications/read-all');
  },

  getRewards: async () => {
    const response = await api.get('/students/me/rewards');
    return response.data;
  },

  getSubjectTree: async (subjectId: number) => {
    const response = await api.get('/students/me/subject-tree', { params: { subjectId } });
    return response.data;
  },

  getContentNodeDetail: async (contentNodeId: number) => {
    const response = await api.get(`/students/me/content-nodes/${contentNodeId}`);
    return response.data;
  },

  markContentNodeComplete: async (contentNodeId: number) => {
    const response = await api.post(`/students/me/content-nodes/${contentNodeId}/complete`);
    return response.data;
  },

  getH5PAssignmentDetail: async (assignmentId: number) => {
    const response = await api.get(`/students/me/assignments/${assignmentId}/h5p-detail`);
    return response.data;
  },

  submitH5PAssignment: async (
    assignmentId: number,
    payload: { rawScore: number; maxScore: number; completed: boolean; interactionDetails?: string }
  ) => {
    const response = await api.post(`/students/me/assignments/${assignmentId}/h5p-submissions`, payload);
    return response.data;
  },

  getQuizAssignmentDetail: async (assignmentId: number) => {
    const response = await api.get(`/students/me/assignments/${assignmentId}/quiz-detail`);
    return response.data;
  },

  submitQuizAssignment: async (assignmentId: number, baiLam: Record<string, unknown>) => {
    const response = await api.post(`/students/me/assignments/${assignmentId}/quiz-submissions`, baiLam);
    return response.data;
  },

  getEssayAssignmentDetail: async (assignmentId: number) => {
    const response = await api.get(`/students/me/assignments/${assignmentId}/essay-detail`);
    return response.data;
  },

  submitEssay: async (assignmentId: number, payload: { textContent: string; isDraft: boolean; attachmentUrl?: string | null }) => {
    const response = await api.post(`/students/me/assignments/${assignmentId}/essay-submissions`, payload);
    return response.data;
  },

  uploadFile: async (file: File): Promise<{ url: string; fileName: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/uploads', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
