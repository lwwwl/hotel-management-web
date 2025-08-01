export interface Message {
  id: number;
  sender: 'guest' | 'agent';
  content: string;
  timestamp: string;
  translation?: string;
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