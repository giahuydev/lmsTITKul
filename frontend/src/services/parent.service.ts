import { api } from '../lib/axios';

export const parentService = {
  getDashboard: async () => {
    const response = await api.get('/parents/me/dashboard');
    return response.data;
  },
  
  getChildren: async () => {
    const response = await api.get('/parents/me/children');
    return response.data;
  },

  getGrades: async () => {
    const response = await api.get('/parents/me/grades');
    return response.data;
  },

  getAssignments: async (childId: number) => {
    const response = await api.get(`/parents/me/children/${childId}/assignments`);
    return response.data;
  },

  getNotifications: async () => {
    const response = await api.get('/parents/me/notifications');
    return response.data;
  },

  markNotificationRead: async (notificationId: number) => {
    await api.post(`/parents/me/notifications/${notificationId}/read`);
  },

  markAllNotificationsRead: async () => {
    await api.post('/parents/me/notifications/read-all');
  },

  getRewards: async (childId: number) => {
    const response = await api.get(`/parents/me/children/${childId}/rewards`);
    return response.data;
  },

  getSubjectTree: async (childId: number) => {
    const response = await api.get(`/parents/me/children/${childId}/subject-tree`);
    return response.data;
  },

  resetChildPassword: async (childId: number, newPassword: string) => {
    const response = await api.post(`/parents/me/children/${childId}/reset-password`, { newPassword });
    return response.data;
  }
};
