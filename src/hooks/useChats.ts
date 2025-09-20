import { useState, useEffect, useCallback, useRef } from 'react';
import { Chat, Message, NotificationMessage, WebSocketMessageData, LanguageCode } from '../types';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';
import api from '../api/axiosConfig';
import { useWebSocketContext } from '../contexts/WebSocketContext';
import { TranslateService } from '../services/translateService';

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
  const [isNewMessage, setIsNewMessage] = useState(false);
  
  // 翻译相关状态
  const [translateEnabled, setTranslateEnabled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('zh_CN');
  const [translatingMessages, setTranslatingMessages] = useState<Set<number>>(new Set());
  const [translationLoading, setTranslationLoading] = useState(false);

  // 获取WebSocket上下文，仅用于消息注册
  const { registerMessageHandler } = useWebSocketContext();

  const translateMessages = useCallback(async (messageIds: number[], language: LanguageCode) => {
    if (!currentConversationId || !translateEnabled || messageIds.length === 0) {
      return;
    }

    // 从当前消息列表中筛选出需要翻译的消息
    const messagesToTranslate = messages.filter(msg => messageIds.includes(msg.id));
    if (messagesToTranslate.length === 0) {
      return;
    }

    setTranslationLoading(true);
    // 标记消息为翻译中
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        messageIds.includes(msg.id)
          ? { ...msg, translationLoading: true, translationError: false }
          : msg
      )
    );

    // 添加到翻译中集合
    setTranslatingMessages(prev => new Set([...prev, ...messageIds]));

    try {
      const translations = await TranslateService.translateMessages(
        currentConversationId,
        messagesToTranslate,
        language
      );

      // 更新消息翻译结果
      setMessages(prevMessages =>
        prevMessages.map(msg => {
          if (messageIds.includes(msg.id)) {
            const translation = translations[msg.id];
            return {
              ...msg,
              translation: translation || undefined,
              translationLoading: false,
              translationError: !translation
            };
          }
          return msg;
        })
      );
    } catch (error) {
      console.error('翻译失败:', error);

      // 标记翻译失败
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          messageIds.includes(msg.id)
            ? { ...msg, translationLoading: false, translationError: true }
            : msg
        )
      );
    } finally {
      // 从翻译中集合移除
      setTranslatingMessages(prev => {
        const newSet = new Set(prev);
        messageIds.forEach(id => newSet.delete(id));
        return newSet;
      });
    }
    setTranslationLoading(false);
  }, [currentConversationId, translateEnabled, messages]);

  const translateNewMessage = useCallback(async (newMessage: Message) => {
    if (!translateEnabled || !currentConversationId) return;

    // 1. 将这条特定消息标记为加载中
    setMessages(prev => prev.map(m => m.id === newMessage.id ? { ...m, translationLoading: true, translationError: false } : m));

    try {
      // 2. 为这条新消息调用翻译服务
      const translations = await TranslateService.translateMessages(currentConversationId, [newMessage], selectedLanguage);
      const translation = translations[newMessage.id];

      // 3. 用翻译结果更新消息
      setMessages(prev => prev.map(m => m.id === newMessage.id ? {
        ...m,
        translation: translation || undefined,
        translationLoading: false,
        translationError: !translation,
      } : m));

    } catch (error) {
      console.error('新消息翻译失败:', error);
      // 4. 将消息更新为错误状态
      setMessages(prev => prev.map(m => m.id === newMessage.id ? { ...m, translationLoading: false, translationError: true } : m));
    }
  }, [translateEnabled, currentConversationId, selectedLanguage]);


  // 处理WebSocket消息
  const handleWebSocketMessage = useCallback((notification: NotificationMessage) => {
    console.log('useChats收到WebSocket消息:', notification);
    
    if (notification.type === 'message_created' && notification.data) {
      const newMessageData: WebSocketMessageData = notification.data;
      const conversationIdNum = Number(notification.conversationId);
      
      // 更新当前会话的消息列表
      if (currentConversationId === conversationIdNum) {
        setMessages(prevMessages => {
          // 检查消息是否已存在
          const exists = prevMessages.some(msg => msg.id === newMessageData.id);
          if (!exists) {
            const formattedMessage: Message = {
              id: newMessageData.id,
              sender: newMessageData.message_type === 0 ? 'guest' : 'agent',
              content: newMessageData.content,
              timestamp: dayjs.unix(newMessageData.created_at).format('HH:mm'),
            };
            
            setIsNewMessage(true);
            return [...prevMessages, formattedMessage];
          }
          return prevMessages;
        });
      }
      
      // 更新会话列表中的最后一条消息
      setChats(prevChats => {
        return prevChats.map(chat => {
          if (chat.id === conversationIdNum) {
            return {
              ...chat,
              lastMessage: newMessageData.content,
              lastTime: dayjs.unix(newMessageData.created_at).fromNow(),
            };
          }
          return chat;
        });
      });
    }
  }, [currentConversationId]);

  // 注册WebSocket消息处理器（组件装载期间有效）
  useEffect(() => {
    const unregister = registerMessageHandler(handleWebSocketMessage);
    return unregister;
  }, [registerMessageHandler, handleWebSocketMessage]);

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
        setIsNewMessage(false);
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
      if (!messageData) return null;

      const message: Message = {
        id: messageData.id,
        sender: 'agent',
        content: messageData.content,
        timestamp: formatMessageTime(messageData.created_at),
      };

      setIsNewMessage(true);
      setMessages(prev => [...prev, message]);

      // 如果翻译功能已开启，则翻译这条新消息
      if (translateEnabled) {
        // 使用 setTimeout 确保状态更新已处理完毕再进行翻译
        setTimeout(() => translateNewMessage(message), 0);
      }
      
      return message;
    } catch (error) {
      console.error('发送消息失败:', error);
      return null;
    } finally {
      setSendingMessage(false);
    }
  }, [translateEnabled, translateNewMessage]);

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

  // 翻译相关函数

  const toggleTranslate = useCallback((enabled: boolean) => {
    setTranslateEnabled(enabled);

    // 如果是关闭翻译，则立即清除已有的翻译结果
    if (!enabled) {
      setMessages(prevMessages =>
        prevMessages.map(msg => ({
          ...msg,
          translation: undefined,
          translationLoading: false,
          translationError: false,
        }))
      );
    }
  }, []);

  const changeTranslateLanguage = useCallback((language: LanguageCode) => {
    setSelectedLanguage(language);
  }, []);

  // 这个 effect 是批量翻译的唯一触发源
  // 当开关被打开时，或者当语言/会话在开关为打开状态时发生变化，它就会运行
  const prevLangRef = useRef<LanguageCode>();
  useEffect(() => {
      const hasLanguageChanged = prevLangRef.current !== undefined && prevLangRef.current !== selectedLanguage;

      if (translateEnabled && currentConversationId) {
          let messagesToTranslate;
          if (hasLanguageChanged) {
              // 如果语言已更改，则重新翻译所有消息
              messagesToTranslate = messages;
          } else {
              // 否则，仅翻译尚无翻译的消息
              messagesToTranslate = messages.filter(msg => !msg.translation && !msg.translationLoading);
          }

          if (messagesToTranslate.length > 0) {
              const messageIds = messagesToTranslate.map(msg => msg.id);
              translateMessages(messageIds, selectedLanguage);
          }
      }
      // 在 effect 执行后更新 ref
      prevLangRef.current = selectedLanguage;

      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [translateEnabled, selectedLanguage, currentConversationId, messages]);


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
    isNewMessage,
    translationLoading,
    // 翻译相关
    translateEnabled,
    selectedLanguage,
    toggleTranslate,
    changeTranslateLanguage,
    translateMessages,
    translateNewMessage,
  };
} 