import React, { useRef, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import type { UseWebSocketReturn } from '../hooks/useWebSocket';
import type { NotificationMessage } from '../types';
import { useUserContext } from './UserContext';
import { WebSocketContext } from './WebSocketContext';

export interface WebSocketContextType extends UseWebSocketReturn {
  registerMessageHandler: (handler: (notification: NotificationMessage) => void) => () => void;
}

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const { user } = useUserContext();
  const { socket, sendMessage, registerMessageHandler } = useWebSocket(user?.id);

  const messageHandlers = useRef<((notification: NotificationMessage) => void)[]>([]);

  const handleMessage = useCallback((notification: NotificationMessage) => {
    messageHandlers.current.forEach(handler => handler(notification));
  }, []);

  useEffect(() => {
    registerMessageHandler(handleMessage);
    return () => {
      messageHandlers.current.forEach(handler => {
        // This is a placeholder for unregistering handlers.
        // In a real scenario, you would store the unregister function returned by registerMessageHandler.
      });
    };
  }, [registerMessageHandler, handleMessage]);

  return (
    <WebSocketContext.Provider value={{ socket, sendMessage, registerMessageHandler }}>
      {children}
    </WebSocketContext.Provider>
  );
};
