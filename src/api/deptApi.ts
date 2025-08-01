import api from './axiosConfig';

export interface DeptSelectListRequest {
  // 可根据后端实际定义补充字段
  [key: string]: unknown;
}

export interface DeptSelectListItem {
  deptId: number;
  deptName: string;
}

export interface DeptSelectListResponse {
  deptList: DeptSelectListItem[];
}

export const deptApi = {
  /**
   * 获取部门下拉列表
   */
  getDeptSelectList: async (params: DeptSelectListRequest = {}): Promise<DeptSelectListItem[]> => {
    const response = await api.post<{ statusCode: number; message: string; data: DeptSelectListResponse }>(
      '/dept/select-list',
      params
    );
    return response.data.data.deptList;
  }
}; 