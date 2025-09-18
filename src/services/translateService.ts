import api from '../api/axiosConfig';
import { TranslateRequest, TranslateResponse, LanguageCode } from '../types';

const TRANSLATE_API_URL = '/translate/get-translate-result';

export class TranslateService {
  /**
   * 获取消息翻译结果
   */
  static async getTranslateResult(request: TranslateRequest): Promise<TranslateResponse> {
    try {
      const response = await api.post(TRANSLATE_API_URL, request);
      return response.data;
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
    messageIds: number[],
    language: LanguageCode
  ): Promise<Record<number, string>> {
    if (messageIds.length === 0) {
      return {};
    }

    try {
      const response = await this.getTranslateResult({
        conversationId,
        messageIdList: messageIds,
        language
      });

      // 将翻译结果转换为以messageId为key的对象
      const translations: Record<number, string> = {};
      if (response.data && Array.isArray(response.data)) {
        response.data.forEach((item) => {
          translations[item.messageId] = item.content;
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
    messageId: number,
    language: LanguageCode
  ): Promise<string | null> {
    try {
      const translations = await this.translateMessages(conversationId, [messageId], language);
      return translations[messageId] || null;
    } catch (error) {
      console.error('单条消息翻译失败:', error);
      return null;
    }
  }
}
