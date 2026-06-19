import { api } from '../lib/axios';

export interface UserProfileDto {
  username: string;
  email: string | null;
  phone: string | null;
  role: string;
  fullName: string;
  avatarUrl: string | null;
}

export interface StudentDashboardDto {
  fullName: string;
  className: string;
  academicYear: string;
  totalXp: number;
  recentEvaluations: {
    assignmentTitle: string;
    score?: string;
    grade?: string;
    comment: string;
    evaluatedAt: string;
  }[];
}

export interface TeacherDashboardDto {
  fullName: string;
  homeroomClass: string;
  department: string;
  totalMaterials: number;
  totalAssignments: number;
}

export interface ParentDashboardDto {
  fullName: string;
  phone: string;
  notificationEmail: string;
  children: {
    studentName: string;
    className: string;
  }[];
}

export const userService = {
  getMyProfile: async (): Promise<UserProfileDto> => {
    const response = await api.get<UserProfileDto>('/users/me/profile');
    return response.data;
  },
  
  getStudentDashboard: async (): Promise<StudentDashboardDto> => {
    const response = await api.get<StudentDashboardDto>('/students/me/dashboard');
    return response.data;
  },

  getTeacherDashboard: async (): Promise<TeacherDashboardDto> => {
    const response = await api.get<TeacherDashboardDto>('/teachers/me/dashboard');
    return response.data;
  },

  getParentDashboard: async (): Promise<ParentDashboardDto> => {
    const response = await api.get<ParentDashboardDto>('/parents/me/dashboard');
    return response.data;
  }
};
