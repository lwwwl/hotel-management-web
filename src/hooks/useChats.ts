import { useState, useEffect, useCallback } from 'react';
import { Chat, Message } from '../types';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';
import api from '../api/axiosConfig';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

const API_URL = '/chat-user/conversation/list';

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [stats, setStats] = useState({ activeChats: 0, resolvedToday: 0 });
  const [loading, setLoading] = useState(false);
  const [activeQueue, setActiveQueue] = useState<'verified' | 'unverified'>('unverified');

  // 获取会话列表
  const fetchChats = useCallback(async (label: 'verified' | 'unverified') => {
    setLoading(true);
    try {
      const res = await api.post(API_URL, {
        label,
        assigneeType: 'me',
      });
      const payload = res.data?.data?.payload || [];
      // meta统计
      const meta = res.data?.data?.meta || {};
      setStats({
        activeChats: meta.all_count || 0,
        resolvedToday: meta.assigned_count || 0,
      });
      // 映射为Chat类型
      const mappedChats: Chat[] = payload.map((item: unknown) => {
        const conv = item as {
          id: number;
          messages: unknown[];
          contact_inbox?: { source_id?: string };
          uuid?: string;
          labels?: string[];
          status?: string;
          timestamp?: string | number;
        };
        const lastMsg = conv.messages && conv.messages.length > 0 ? conv.messages[conv.messages.length - 1] : null;
        return {
          id: conv.id,
          roomNumber: conv.contact_inbox?.source_id || conv.uuid || '',
          guestName: lastMsg?.sender?.name || '',
          lastMessage: lastMsg?.content || '',
          lastTime: conv.timestamp ? dayjs.unix(Number(conv.timestamp)).fromNow() : '',
          verified: (conv.labels || []).includes('verified'),
          language: '中文', // 后端暂未返回
          checkInDate: '', // 后端暂未返回
          checkOutDate: '', // 后端暂未返回
          statusText: conv.status === 'open' ? (conv.labels?.includes('verified') ? '活跃' : '待验证') : '已关闭',
          messages: (conv.messages || []).map((msg: unknown) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const m = msg as any;
            return {
              id: m.id,
              sender: m.sender?.type === 'user' ? 'agent' : 'guest',
              content: m.content || '',
              timestamp: m.createdAt ? dayjs(m.createdAt).format('HH:mm') : '',
            };
          }),
        };
      });
      setChats(mappedChats);
    } catch {
      setChats([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 队列切换时拉取
  useEffect(() => {
    fetchChats(activeQueue);
  }, [activeQueue, fetchChats]);

  const getQueueCount = (queueType: 'verified' | 'unverified') => {
    return chats.filter(chat => chat.verified === (queueType === 'verified')).length;
  };

  // 本地模拟发送消息
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

  // 本地模拟验证
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
    resolveChat,
    loading,
    activeQueue,
    setActiveQueue,
  };
} 