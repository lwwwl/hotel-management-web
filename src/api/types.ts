export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  code: number;
  message: string;
  data: {
    total: number;
    records: T[];
  };
}

// Task API types
export interface TaskColumn {
  status: string;
  count: number;
  tasks: TaskListItem[];
}

export interface TaskListItem {
  id: number;
  roomNumber: string;
  title: string;
  description: string;
  department: string;
  priority: string;
  status: string;
  createdAt: string;
}

export interface TaskDetail {
  id: number;
  roomNumber: string;
  title: string;
  description: string;
  department: string;
  priority: string;
  status: string;
  createdAt: string;
  creator: string;
  executor?: string;
  operateRecords: TaskOperateRecord[];
}

export interface TaskOperateRecord {
  id: number;
  taskId: number;
  operateType: string;
  operateUser: string;
  operateTime: string;
  operateContent: string;
}

// Task request types
export interface TaskCreateRequest {
  roomNumber: string;
  title: string;
  description: string;
  department: string;
  priority: string;
}

export interface TaskUpdateRequest {
  id: number;
  title: string;
  description: string;
  priority: string;
}

export interface TaskChangeStatusRequest {
  id: number;
  status: string;
}

// Chat API types
export interface ChatMessage {
  id: number;
  sender: 'guest' | 'agent';
  content: string;
  timestamp: string;
  translation?: string;
}

export interface ChatConversation {
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
  messages: ChatMessage[];
} 