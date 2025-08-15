import { useState, useEffect, useRef, useCallback } from 'react';
import { getAgentWebSocketConnection } from '../api/websocket';
import { NotificationMessage, WebSocketMessage } from '../types';

// WebSocket连接状态
export interface WebSocketState {
  isConnected: boolean;
  isConnecting: boolean;
  connectionError: string | null;
  lastMessage: any | null;
}

// WebSocket Hook返回值
export interface UseWebSocketReturn extends WebSocketState {
  connect: (userId: string) => Promise<void>;
  disconnect: () => void;
  sendMessage: (message: string) => void;
  reconnect: () => Promise<void>;
  onMessageReceived?: (notification: NotificationMessage) => void;
}

export const useWebSocket = (onMessageReceived?: (notification: NotificationMessage) => void): UseWebSocketReturn => {
  console.log('🔌 useWebSocket hook 初始化');
  
  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    isConnecting: false,
    connectionError: null,
    lastMessage: null,
  });

  const wsRef = useRef<WebSocket | null>(null);
  const userIdRef = useRef<string | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const heartbeatIntervalRef = useRef<number | null>(null);
  const messageCallbackRef = useRef(onMessageReceived);

  // 更新消息回调函数
  useEffect(() => {
    console.log('🔄 更新消息回调函数:', !!onMessageReceived);
    messageCallbackRef.current = onMessageReceived;
  }, [onMessageReceived]);

  // 清理资源
  const cleanup = useCallback(() => {
    console.log('🧹 清理WebSocket资源');
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  // 建立WebSocket连接
  const connect = useCallback(async (userId: string) => {
    console.log('🚀 开始建立WebSocket连接, userId:', userId);
    console.log('📊 当前连接状态:', { isConnecting: state.isConnecting, isConnected: state.isConnected });
    
    if (state.isConnecting || state.isConnected) {
      console.log('⚠️ 连接已在进行中或已连接，跳过');
      return;
    }

    try {
      setState(prev => ({ ...prev, isConnecting: true, connectionError: null }));
      console.log('📡 正在获取WebSocket连接信息...');
      
      // 获取WebSocket连接信息
      const connectionInfo = await getAgentWebSocketConnection(userId);
      console.log('📡 获取到连接信息:', connectionInfo);
      
      if (!connectionInfo.success) {
        throw new Error(connectionInfo.message || '获取连接信息失败');
      }

      // 建立WebSocket连接
      console.log('🔗 正在建立WebSocket连接，URL:', connectionInfo.wsUrl);
      const ws = new WebSocket(connectionInfo.wsUrl);
      wsRef.current = ws;
      userIdRef.current = userId;

      // 连接建立
      ws.onopen = () => {
        console.log('✅ WebSocket连接已建立');
        setState(prev => ({ 
          ...prev, 
          isConnected: true, 
          isConnecting: false, 
          connectionError: null 
        }));

        // 启动心跳
        startHeartbeat();
      };

      // 接收消息
      ws.onmessage = (event) => {
        console.log("接收到消息", event)
        const rawData = event.data as string;
        console.log("接收到消息data", rawData)

        // 处理心跳纯文本
        if (rawData === 'ping' || rawData === 'pong') {
          if (rawData === 'pong') {
            handleMessage({ type: 'pong', data: null, timestamp: new Date().toISOString() });
          }
          return;
        }
        // 解析JSON消息，并尽量将 data 从字符串解析为对象
        try {
          const parsed = JSON.parse(rawData);
          let processed = parsed;
          if (typeof parsed?.data === 'string') {
            try {
              processed = { ...parsed, data: JSON.parse(parsed.data) };
            } catch {
              // data 不是合法JSON，保留原样
            }
          }
          setState(prev => ({ ...prev, lastMessage: processed }));
          handleMessage(processed);
        } catch {
          // 非JSON且非心跳的情况直接忽略
        }
      };

      // 连接关闭
      ws.onclose = (event) => {
        console.log('🔒 WebSocket连接已关闭:', { code: event.code, reason: event.reason });
        setState(prev => ({ 
          ...prev, 
          isConnected: false, 
          isConnecting: false 
        }));
        
        cleanup();
        
        // 如果不是主动关闭，则安排重连
        if (event.code !== 1000) {
          console.log('🔄 连接非主动关闭，安排重连');
          scheduleReconnect();
        }
      };

      // 连接错误
      ws.onerror = (error) => {
        console.error('❌ WebSocket连接错误:', error);
        setState(prev => ({ 
          ...prev, 
          connectionError: 'WebSocket连接错误',
          isConnecting: false 
        }));
      };

    } catch (error) {
      console.error('❌ 建立WebSocket连接失败:', error);
      setState(prev => ({ 
        ...prev, 
        isConnecting: false, 
        connectionError: error instanceof Error ? error.message : '连接失败' 
      }));
    }
  }, [state.isConnecting, state.isConnected, cleanup]);

  // 断开连接
  const disconnect = useCallback(() => {
    console.log('🔌 主动断开WebSocket连接');
    if (wsRef.current) {
      wsRef.current.close(1000, '用户主动断开');
      wsRef.current = null;
    }
    userIdRef.current = null;
    cleanup();
    
    setState(prev => ({ 
      ...prev, 
      isConnected: false, 
      isConnecting: false,
      connectionError: null 
    }));
  }, [cleanup]);

  // 发送消息
  const sendMessage = useCallback((message: string) => {
    console.log('📤 尝试发送WebSocket消息:', message);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(message);
      console.log('✅ 消息发送成功');
    } else {
      console.warn('⚠️ WebSocket未连接，无法发送消息');
    }
  }, []);

  // 重连
  const reconnect = useCallback(async () => {
    console.log('🔄 开始重连WebSocket');
    if (userIdRef.current) {
      disconnect();
      await connect(userIdRef.current);
    }
  }, [connect, disconnect]);

  // 启动心跳
  const startHeartbeat = useCallback(() => {
    console.log('💓 启动WebSocket心跳检测');
    heartbeatIntervalRef.current = setInterval(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        console.log('💓 发送心跳包: ping');
        wsRef.current.send('ping');
      }
    }, 30000); // 30秒发送一次心跳
  }, []);

  // 处理接收到的消息
  const handleMessage = useCallback((message: WebSocketMessage) => {
    console.log('🔍 处理WebSocket消息，类型:', message.type);
    switch (message.type) {
      case 'message_created':
      case 'message_updated': {
        // 规范为 NotificationMessage 结构，便于下游统一处理
        const rawConvId = (message as unknown as { conversationId?: number | string }).conversationId;
        const convId = typeof rawConvId === 'string' ? Number(rawConvId) : rawConvId;
        const rawTs = (message as unknown as { timestamp?: number | string }).timestamp;
        const ts = typeof rawTs === 'number' ? new Date(rawTs).toISOString() : (rawTs || new Date().toISOString());
        const notification: NotificationMessage = {
          type: message.type,
          conversationId: Number.isFinite(convId as number) ? (convId as number) : 0,
          timestamp: ts as string,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: (message as any).data,
        };
        if (messageCallbackRef.current) {
          messageCallbackRef.current(notification);
        }
        break;
      }
      case 'pong':
        console.log('💓 收到心跳响应');
        break;
      default:
        // 其他类型暂不处理
        break;
    }
  }, []);

  // 安排重连
  const scheduleReconnect = useCallback(() => {
    console.log('⏰ 安排WebSocket重连');
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    reconnectTimeoutRef.current = setTimeout(() => {
      if (userIdRef.current) {
        console.log('🔄 执行重连...');
        connect(userIdRef.current);
      }
    }, 5000); // 5秒后重连
  }, [connect]);

  // 组件卸载时清理
  useEffect(() => {
    console.log('🔌 useWebSocket hook 卸载，清理连接');
    return () => {
      disconnect();
    };
  }, [disconnect]);

  console.log('📊 WebSocket状态:', state);

  return {
    ...state,
    connect,
    disconnect,
    sendMessage,
    reconnect,
  };
};
