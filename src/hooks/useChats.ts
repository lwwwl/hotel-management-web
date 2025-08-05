import { useState, useEffect, useCallback } from 'react';
import { Chat, Message } from '../types';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';
import api from '../api/axiosConfig';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

const CONVERSATION_API_URL = '/chat-user/conversation-list';
const MESSAGE_API_URL = '/chat-user/message-list';
const SEND_MESSAGE_API_URL = '/chat-user/message-create';

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [stats, setStats] = useState({ activeChats: 0, resolvedToday: 0 });
  const [loading, setLoading] = useState(false);
  const [activeQueue, setActiveQueue] = useState<'verified' | 'unverified'>('unverified');
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const [sendingMessage, setSendingMessage] = useState(false);

  // 获取会话列表
  const fetchChats = useCallback(async (label: 'verified' | 'unverified') => {
    setLoading(true);
    try {
      const res = await api.post(CONVERSATION_API_URL, {
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
          meta?: {
            sender?: {
              name?: string;
            };
          };
        };
        const lastMsg = conv.messages && conv.messages.length > 0 ? conv.messages[conv.messages.length - 1] : null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const lastMessage = lastMsg as any;
        return {
          id: conv.id,
          roomNumber: conv.contact_inbox?.source_id || conv.uuid || '',
          guestName: conv.meta?.sender?.name || '',
          lastMessage: lastMessage?.content || '',
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

  // 获取消息列表
  const fetchMessages = useCallback(async (conversationId: number, before?: number) => {
    setMessagesLoading(true);
    try {
      const res = await api.post(MESSAGE_API_URL, {
        conversationId,
        before: before || null,
      });
      
      const payload = res.data?.payload || [];
      
      // 过滤并映射消息
      const filteredMessages: Message[] = [];
      let firstMessageId: number | undefined;
      
      payload.forEach((msg: unknown) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const messageData = msg as any;
        // 记录第一条消息ID用于分页
        if (firstMessageId === undefined) {
          firstMessageId = messageData.id;
        }
        
        // 只处理 message_type 为 0(incoming) 或 1(outgoing) 的消息
        if (messageData.message_type === 0 || messageData.message_type === 1) {
          const message: Message = {
            id: messageData.id,
            sender: messageData.message_type === 0 ? 'guest' : 'agent',
            content: messageData.content || '',
            timestamp: formatMessageTime(messageData.created_at),
          };
          filteredMessages.push(message);
        }
      });
      
      // 如果是第一次加载，直接设置消息
      if (before === undefined) {
        setMessages(filteredMessages);
      } else {
        // 如果是加载更多，添加到现有消息前面
        setMessages(prev => [...filteredMessages, ...prev]);
      }
      
      // 如果返回的payload为空，说明没有更多消息了
      setHasMoreMessages(payload.length > 0);
      
    } catch (error) {
      console.error('获取消息列表失败:', error);
      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  // 发送消息
  const sendMessage = useCallback(async (conversationId: number, content: string) => {
    if (!content.trim() || !conversationId) return null;
    
    setSendingMessage(true);
    try {
      const res = await api.post(SEND_MESSAGE_API_URL, {
        conversation_id: conversationId,
        content: content.trim(),
        message_type: 'outgoing',
        content_type: 'text',
        content_attributes: {},
        campaign_id: null,
        template_params: {},
      });
      
      const messageData = res.data;
      
      // 将新消息添加到当前消息列表
      const newMessage: Message = {
        id: messageData.id,
        sender: 'agent',
        content: messageData.content,
        timestamp: formatMessageTime(messageData.created_at),
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      // 更新会话列表中的最后消息
      setChats(prev => prev.map(chat => 
        chat.id === conversationId 
          ? { ...chat, lastMessage: content.trim(), lastTime: '刚刚' }
          : chat
      ));
      
      return newMessage;
    } catch (error) {
      console.error('发送消息失败:', error);
      return null;
    } finally {
      setSendingMessage(false);
    }
  }, []);

  // 格式化消息时间
  const formatMessageTime = (timestamp: number): string => {
    const messageTime = dayjs.unix(timestamp);
    const now = dayjs();
    const today = now.startOf('day');
    
    if (messageTime.isAfter(today)) {
      // 今日消息，显示 HH:mm:ss
      return messageTime.format('HH:mm:ss');
    } else {
      // 今日之前的消息，显示 MM-dd HH:mm:ss
      return messageTime.locale('en').format('MM-DD HH:mm:ss');
    }
  };

  // 加载更多消息
  const loadMoreMessages = useCallback(() => {
    if (currentConversationId && hasMoreMessages && !messagesLoading) {
      const firstMessageId = messages[0]?.id;
      if (firstMessageId) {
        fetchMessages(currentConversationId, firstMessageId);
      }
    }
  }, [currentConversationId, hasMoreMessages, messagesLoading, messages, fetchMessages]);

  // 选择会话时加载消息
  const selectChat = useCallback((chat: Chat) => {
    setCurrentConversationId(chat.id);
    setMessages([]);
    setHasMoreMessages(true);
    fetchMessages(chat.id);
  }, [fetchMessages]);

  // 队列切换时拉取
  useEffect(() => {
    fetchChats(activeQueue);
  }, [activeQueue, fetchChats]);

  const getQueueCount = (queueType: 'verified' | 'unverified') => {
    return chats.filter(chat => chat.verified === (queueType === 'verified')).length;
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
    messages,
    messagesLoading,
    hasMoreMessages,
    loadMoreMessages,
    selectChat,
    sendingMessage,
  };
} 