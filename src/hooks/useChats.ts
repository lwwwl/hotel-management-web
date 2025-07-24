import { useState } from 'react';
import { Chat, Message } from '../types';

// 初始聊天数据
const initialChats: Chat[] = [
  { 
    id: 1, 
    roomNumber: '301', 
    guestName: '张先生', 
    lastMessage: '需要加毛巾', 
    lastTime: '2分钟前', 
    verified: true,
    language: '中文',
    checkInDate: '2024-01-15',
    checkOutDate: '2024-01-18',
    statusText: '活跃',
    messages: [
      { id: 1, sender: 'guest', content: '你好，我需要加几条毛巾', timestamp: '14:30' },
      { id: 2, sender: 'agent', content: '好的，我马上为您安排客房部送毛巾过去', timestamp: '14:31' },
      { id: 3, sender: 'guest', content: '谢谢，大概多久能到？', timestamp: '14:32' },
      { id: 4, sender: 'agent', content: '大约10-15分钟内就能送到您的房间', timestamp: '14:33' },
      { id: 5, sender: 'guest', content: '需要加毛巾', timestamp: '14:35' },
    ]
  },
  { 
    id: 2, 
    roomNumber: '205', 
    guestName: '李女士', 
    lastMessage: '空调不制冷', 
    lastTime: '5分钟前', 
    verified: true,
    language: '中文',
    checkInDate: '2024-01-14',
    checkOutDate: '2024-01-17',
    statusText: '活跃',
    messages: [
      { id: 1, sender: 'guest', content: '房间的空调好像不制冷，温度调到最低还是很热', timestamp: '14:20' },
      { id: 2, sender: 'agent', content: '您好，我立即安排维修人员过去检查空调', timestamp: '14:21' },
      { id: 3, sender: 'guest', content: '好的，我现在在房间里', timestamp: '14:22' },
      { id: 4, sender: 'agent', content: '维修师傅大约5分钟内到达，请稍等', timestamp: '14:23' },
      { id: 5, sender: 'guest', content: '空调不制冷', timestamp: '14:32' },
    ]
  },
  { 
    id: 3, 
    roomNumber: '408', 
    guestName: 'Smith', 
    lastMessage: 'WiFi问题', 
    lastTime: '15分钟前', 
    verified: false,
    language: '英语',
    checkInDate: '2024-01-15',
    checkOutDate: '2024-01-19',
    statusText: '等待验证',
    messages: [
      { id: 1, sender: 'guest', content: 'Hello, I cannot connect to the WiFi', timestamp: '14:10', translation: '你好，我无法连接WiFi' },
      { id: 2, sender: 'guest', content: 'Can you help me with the WiFi password?', timestamp: '14:12', translation: '你能帮我解决WiFi密码问题吗？' },
      { id: 3, sender: 'guest', content: 'WiFi问题', timestamp: '14:22' },
    ]
  },
  { 
    id: 4, 
    roomNumber: '509', 
    guestName: 'Johnson', 
    lastMessage: '电视问题', 
    lastTime: '8分钟前', 
    verified: false,
    language: '英语',
    checkInDate: '2024-01-16',
    checkOutDate: '2024-01-20',
    statusText: '等待验证',
    messages: [
      { id: 1, sender: 'guest', content: 'The TV in my room is not working', timestamp: '14:18', translation: '我房间的电视不工作' },
      { id: 2, sender: 'guest', content: 'I tried changing channels but nothing works', timestamp: '14:20', translation: '我尝试换台但都不行' },
      { id: 3, sender: 'guest', content: '电视问题', timestamp: '14:29' },
    ]
  },
];

export function useChats() {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [stats] = useState({
    activeChats: 6,
    resolvedToday: 8,
  });

  const getQueueCount = (queueType: 'verified' | 'unverified') => {
    return chats.filter(chat => chat.verified === (queueType === 'verified')).length;
  };

  const sendMessage = (chat: Chat, content: string) => {
    if (!content.trim()) return chat;
    
    const message: Message = {
      id: Date.now(),
      sender: 'agent',
      content: content,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    };
    
    const updatedChat = {
      ...chat,
      messages: [...chat.messages, message],
      lastMessage: content,
      lastTime: '刚刚',
    };

    setChats(chats.map(c => c.id === chat.id ? updatedChat : c));
    return updatedChat;
  };

  const verifyChat = (chat: Chat) => {
    if (chat.verified) return chat;
    
    const updatedChat = {
      ...chat,
      verified: true,
      statusText: '活跃',
    };
    
    setChats(chats.map(c => c.id === chat.id ? updatedChat : c));
    return updatedChat;
  };

  const rejectChat = (chat: Chat) => {
    const updatedChat = {
      ...chat,
      statusText: '已拒绝',
    };
    
    setChats(chats.map(c => c.id === chat.id ? updatedChat : c));
    return updatedChat;
  };

  const resolveChat = (chat: Chat) => {
    const updatedChat = {
      ...chat,
      statusText: '已解决',
    };
    
    setChats(chats.map(c => c.id === chat.id ? updatedChat : c));
    return updatedChat;
  };

  return {
    chats,
    stats,
    getQueueCount,
    sendMessage,
    verifyChat,
    rejectChat,
    resolveChat
  };
} 