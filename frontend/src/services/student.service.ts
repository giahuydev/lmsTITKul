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

  getRewards: async () => {
    const response = await api.get('/students/me/rewards');
    return response.data;
  },

  getSubjectTree: async () => {
    const response = await api.get('/students/me/subject-tree');
    return response.data;
  }
};
