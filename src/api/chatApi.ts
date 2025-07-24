import api from './axiosConfig';
import { ApiResponse, ChatConversation, ChatMessage, PaginatedResponse } from './types';

export const chatApi = {
  /**
   * 获取聊天会话列表
   * @param verified 是否已验证
   * @param page 页码
   * @param size 每页大小
   */
  getChatList: async (verified: boolean, page = 1, size = 10) => {
    const params = { verified, page, size };
    const response = await api.get<PaginatedResponse<ChatConversation>>('/api/chat/list', { params });
    return response.data;
  },

  /**
   * 获取聊天统计信息
   */
  getChatStats: async () => {
    const response = await api.get<ApiResponse<{
      activeChats: number;
      resolvedToday: number;
      averageResponseTime: string;
    }>>('/api/chat/stats');
    return response.data;
  },

  /**
   * 获取聊天会话详情
   * @param id 聊天ID
   */
  getChatDetail: async (id: number) => {
    const response = await api.get<ApiResponse<ChatConversation>>(`/api/chat/detail/${id}`);
    return response.data;
  },

  /**
   * 发送消息
   * @param chatId 聊天ID
   * @param content 消息内容
   */
  sendMessage: async (chatId: number, content: string) => {
    const response = await api.post<ApiResponse<ChatMessage>>(`/api/chat/send/${chatId}`, { content });
    return response.data;
  },

  /**
   * 验证聊天身份
   * @param chatId 聊天ID
   */
  verifyChat: async (chatId: number) => {
    const response = await api.put<ApiResponse<boolean>>(`/api/chat/verify/${chatId}`);
    return response.data;
  },

  /**
   * 拒绝聊天
   * @param chatId 聊天ID
   */
  rejectChat: async (chatId: number) => {
    const response = await api.put<ApiResponse<boolean>>(`/api/chat/reject/${chatId}`);
    return response.data;
  },

  /**
   * 解决聊天
   * @param chatId 聊天ID
   */
  resolveChat: async (chatId: number) => {
    const response = await api.put<ApiResponse<boolean>>(`/api/chat/resolve/${chatId}`);
    return response.data;
  },

  /**
   * 获取快捷回复列表
   */
  getQuickReplies: async () => {
    const response = await api.get<ApiResponse<Array<{
      id: number;
      text: string;
      content: string;
    }>>>('/api/chat/quick-replies');
    return response.data;
  }
}; 