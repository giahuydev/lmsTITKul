import { api } from '../lib/axios';

export interface Material {
  id: number;
  title: string;
  description: string;
  materialType: string;
  origin: string;
  h5pId: string;
  xpReward: number;
  allowRetry: boolean;
}

export const studentService = {
  getMaterials: async (): Promise<Material[]> => {
    const response = await api.get<Material[]>('/materials');
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
