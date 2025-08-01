import { chatApi } from './chatApi';
import { taskApi } from './taskApi';
import { userApi } from './userApi';
import { roomApi } from './roomApi';
import { deptApi } from './deptApi';
import api from './axiosConfig';

export * from './types';
export * from './userApi';
export * from './roomApi';
export * from './deptApi';

export {
  api,
  chatApi,
  taskApi,
  userApi,
  roomApi,
  deptApi
}; 