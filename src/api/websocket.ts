import axios from 'axios';
import { WebSocketConnectionResponse } from '../types';

// WebSocket API配置
const WEBSOCKET_API_BASE_URL = 'http://111.223.37.162:7766';
// const WEBSOCKET_API_BASE_URL = 'https://kefu.5ok.co';

// // 根据环境重写后端返回的 wsUrl 的主机与协议，避免服务端默认返回 localhost 导致浏览器连不上
// function rewriteWsUrlHost(wsUrl: string): string {
//   try {
//     const urlFromServer = new URL(wsUrl);
//     const apiBase = new URL(WEBSOCKET_API_BASE_URL);
//     // 协议映射：http -> ws, https -> wss
//     urlFromServer.protocol = apiBase.protocol === 'https:' ? 'wss:' : 'ws:';
//     urlFromServer.host = apiBase.host;
//     return urlFromServer.toString();
//   } catch {
//     return wsUrl;
//   }
// }

// 获取客服端WebSocket连接信息
export const getAgentWebSocketConnection = async (userId: string): Promise<WebSocketConnectionResponse> => {
  try {
    const response = await axios.post(`${WEBSOCKET_API_BASE_URL}/api/websocket/connect/agent`, 
      `userId=${userId}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    const data = response.data as WebSocketConnectionResponse;
    return data;
  } catch (error) {
    console.error('获取WebSocket连接信息失败:', error);
    throw new Error('获取WebSocket连接信息失败');
  }
};

// 检查客服在线状态
export const checkAgentStatus = async (userId: string) => {
  try {
    const response = await axios.get(`${WEBSOCKET_API_BASE_URL}/api/websocket/status/${userId}`);
    return response.data;
  } catch (error) {
    console.error('检查在线状态失败:', error);
    throw new Error('检查在线状态失败');
  }
};

// 获取在线统计
export const getOnlineStats = async () => {
  try {
    const response = await axios.get(`${WEBSOCKET_API_BASE_URL}/api/websocket/stats`);
    return response.data;
  } catch (error) {
    console.error('获取在线统计失败:', error);
    throw new Error('获取在线统计失败');
  }
};
