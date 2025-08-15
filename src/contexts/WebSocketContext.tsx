import React, { createContext, useContext, useRef, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import type { UseWebSocketReturn } from '../hooks/useWebSocket';
import type { NotificationMessage } from '../types';
import { useUserContext } from './UserContext';

interface WebSocketContextType extends UseWebSocketReturn {
  registerMessageHandler: (handler: (notification: NotificationMessage) => void) => () => void;
}

interface WebSocketProviderProps {
  children: ReactNode;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const messageHandlersRef = useRef<Set<(notification: NotificationMessage) => void>>(new Set());
  const { userId } = useUserContext();

  // 注册消息处理器
  const registerMessageHandler = useCallback((handler: (notification: NotificationMessage) => void) => {
    messageHandlersRef.current.add(handler);
    
    // 返回取消注册函数
    return () => {
      messageHandlersRef.current.delete(handler);
    };
  }, []);

  // 处理WebSocket消息
  const handleWebSocketMessage = useCallback((notification: NotificationMessage) => {
    console.log('WebSocketContext处理消息:', notification);
    
    // 通知所有注册的处理器
    messageHandlersRef.current.forEach(handler => {
      try {
        handler(notification);
      } catch (error) {
        console.error('消息处理器执行错误:', error);
      }
    });
  }, []);

  const webSocketHook = useWebSocket(handleWebSocketMessage);

  // 在Provider层自动根据userId建立/维护连接
  useEffect(() => {
    const effectiveUserId = userId || localStorage.getItem('userId') || '1';
    if (effectiveUserId && !webSocketHook.isConnected && !webSocketHook.isConnecting) {
      webSocketHook.connect(effectiveUserId);
    }
    // 当userId变化且已连接到旧用户时，执行重连
  }, [userId, webSocketHook.isConnected, webSocketHook.isConnecting, webSocketHook.connect]);
  
  return (
    <WebSocketContext.Provider value={{ 
      ...webSocketHook, 
      registerMessageHandler 
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
};
