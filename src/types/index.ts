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
  id: number;
  roomNumber: string;
  title: string;
  description: string;
  department: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'review' | 'completed';
  createdAt: string;
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