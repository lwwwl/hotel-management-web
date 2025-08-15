export interface Message {
  id: number;
  sender: 'guest' | 'agent';
  content: string;
  timestamp: string;
  translation?: string;
}

// WebSocket消息类型（与后端API返回的消息结构匹配）
export interface WebSocketMessageData {
  id: number;
  content: string;
  message_type: number; // 0: guest, 1: agent
  content_type: string; // 'text' for now
  content_attributes: Record<string, any>;
  created_at: number; // timestamp in seconds
  conversation_id: number;
  sender: {
    id: number;
    name: string;
    type: 'user' | 'contact';
    [key: string]: any;
  };
}

export interface Chat {
  id: number;
  roomNumber: string;
  guestName: string;
  lastMessage: string;
  lastTime: string;
  verified: boolean;
  language: string;
  checkInDate: string;
  checkOutDate: string;
  statusText: string;
  messages: Message[];
}

// WebSocket通知消息类型
export interface NotificationMessage {
  type: string; // 'message_created' | 'message_updated' | 'conversation_created' | 'conversation_updated' | 'conversation_resolved'
  data: WebSocketMessageData | null; // 消息体，对于非消息类型可能为null
  timestamp: string;
  conversationId: number;
}

// WebSocket消息类型
export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

// WebSocket连接响应类型
export interface WebSocketConnectionResponse {
  success: boolean;
  message: string;
  wsUrl: string;
  wsToken: string;
  userId: string;
  userType: string;
}

export interface Task {
  taskId: number;
  roomId: number;
  roomName: string;
  title: string;
  description: string;
  deptId: number;
  deptName: string;
  guestId: number;
  guestName: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  priorityDisplayName: string; // 优先级显示名称
  status: 'pending' | 'in_progress' | 'review' | 'completed';
  statusDisplayName: string; // 状态显示名称
  createdAt: number; // 使用毫秒时间戳
}

export interface TaskForm {
  title: string;
  department: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
}

export interface QuickReply {
  id: number;
  text: string;
  content: string;
} 