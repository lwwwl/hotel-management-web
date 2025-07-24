import api from './axiosConfig';
import { ApiResponse, PaginatedResponse } from './types';

export interface UserInfo {
  id: number;
  username: string;
  realName: string;
  avatar?: string;
  email?: string;
  phone?: string;
  departments: Array<{
    id: number;
    name: string;
  }>;
  roles: Array<{
    id: number;
    name: string;
  }>;
}

export interface DepartmentInfo {
  id: number;
  name: string;
  description?: string;
  parentId?: number;
}

export const userApi = {
  /**
   * 获取当前用户信息
   */
  getCurrentUser: async () => {
    const response = await api.get<ApiResponse<UserInfo>>('/api/user/current');
    return response.data;
  },

  /**
   * 获取用户列表
   * @param departmentId 部门ID
   */
  getUserList: async (departmentId?: number, page = 1, size = 20) => {
    const params = { departmentId, page, size };
    const response = await api.get<PaginatedResponse<UserInfo>>('/api/user/list', { params });
    return response.data;
  },

  /**
   * 获取部门列表
   */
  getDepartments: async () => {
    const response = await api.get<ApiResponse<DepartmentInfo[]>>('/api/department/list');
    return response.data;
  },

  /**
   * 登录
   * @param username 用户名
   * @param password 密码
   */
  login: async (username: string, password: string) => {
    const response = await api.post<ApiResponse<{token: string}>>('/api/auth/login', { username, password });
    return response.data;
  },

  /**
   * 退出登录
   */
  logout: async () => {
    const response = await api.post<ApiResponse<boolean>>('/api/auth/logout');
    return response.data;
  }
}; 