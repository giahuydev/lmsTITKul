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
  }
};
