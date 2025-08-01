import api from './axiosConfig';
import { ApiResponse, PaginatedResponse } from './types';

export interface RoomInfo {
  id: number;
  roomNumber: string;
  roomType: string;
  status: string;
  floor: number;
  building?: string;
}

export interface GuestInfo {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  checkInDate: string;
  checkOutDate: string;
  roomId: number;
  roomNumber: string;
  vipLevel?: number;
}

export const roomApi = {
  /**
   * 获取房间列表
   * @param status 房间状态
   * @param floor 楼层
   * @param building 楼栋
   */
  getRoomList: async (status?: string, floor?: number, building?: string, page = 1, size = 20) => {
    const params = { status, floor, building, page, size };
    const response = await api.get<PaginatedResponse<RoomInfo>>('/room/list', { params });
    return response.data;
  },

  /**
   * 获取房间详情
   * @param id 房间ID或房间号
   */
  getRoomDetail: async (id: string | number) => {
    const response = await api.get<ApiResponse<RoomInfo>>(`/room/detail/${id}`);
    return response.data;
  },

  /**
   * 获取客人列表
   * @param roomId 房间ID
   */
  getGuestList: async (roomId?: number, page = 1, size = 20) => {
    const params = { roomId, page, size };
    const response = await api.get<PaginatedResponse<GuestInfo>>('/guest/list', { params });
    return response.data;
  },

  /**
   * 获取客人详情
   * @param id 客人ID
   */
  getGuestDetail: async (id: number) => {
    const response = await api.get<ApiResponse<GuestInfo>>(`/guest/detail/${id}`);
    return response.data;
  },

  /**
   * 根据房间号查询当前入住客人
   * @param roomNumber 房间号
   */
  getGuestByRoomNumber: async (roomNumber: string) => {
    const response = await api.get<ApiResponse<GuestInfo>>(`/guest/room/${roomNumber}`);
    return response.data;
  }
}; 