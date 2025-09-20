import api from '../api/axiosConfig';
import {
  TranslateRequest,
  TranslateResponse,
  LanguageCode,
  MessageContentInfo,
  Message
} from '../types';

const TRANSLATE_API_URL = '/translate/get-translate-result';

export class TranslateService {
  /**
   * 获取消息翻译结果
   */
  static async getTranslateResult(request: TranslateRequest): Promise<TranslateResponse> {
    try {
      const response = await api.post<TranslateResponse>(TRANSLATE_API_URL, request);
      // 检查响应体中的状态码
      if (response.data && response.data.statusCode === 200) {
        return response.data;
      }
      throw new Error(response.data?.message || '翻译API返回了错误状态');
    } catch (error) {
      console.error('翻译请求失败:', error);
      throw error;
    }
  }

  /**
   * 批量翻译消息
   */
  static async translateMessages(
    conversationId: number,
    messagesToTranslate: Message[],
    language: LanguageCode
  ): Promise<Record<number, string>> {
    if (messagesToTranslate.length === 0) {
      return {};
    }

    try {
      const messages: MessageContentInfo[] = messagesToTranslate.map(m => ({
        messageId: m.id,
        content: m.content
      }));

      const response = await this.getTranslateResult({
        conversationId,
        messages,
        language
      });

      // 将翻译结果转换为以messageId为key的对象
      const translations: Record<number, string> = {};
      // response.data now correctly refers to the `data` property of the TranslateResponse object
      if (response.data && Array.isArray(response.data)) {
        response.data.forEach((item) => {
          translations[item.messageId] = item.result;
        });
      }

      return translations;
    } catch (error) {
      console.error('批量翻译失败:', error);
      throw error;
    }
  }

  /**
   * 翻译单条消息
   */
  static async translateMessage(
    conversationId: number,
    messageToTranslate: Message,
    language: LanguageCode
  ): Promise<string | null> {
    try {
      const translations = await this.translateMessages(conversationId, [messageToTranslate], language);
      return translations[messageToTranslate.id] || null;
    } catch (error) {
      console.error('单条消息翻译失败:', error);
      return null;
    }
  }
}
