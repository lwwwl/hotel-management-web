/**
 * 将毫秒时间戳转换为本地化的日期时间字符串
 * @param timestamp 毫秒时间戳（long型）
 * @param options 格式化选项
 * @returns 格式化后的时间字符串
 */
export const formatTimestamp = (timestamp: number, options: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false
}): string => {
  if (!timestamp) return '';
  
  return new Date(timestamp).toLocaleString(undefined, options);
};

/**
 * 格式化为短日期时间格式（适用于列表显示）
 * @param timestamp 毫秒时间戳
 * @returns 简短格式的时间字符串
 */
export const formatShortDateTime = (timestamp: number): string => {
  if (!timestamp) return '';
  
  return formatTimestamp(timestamp, {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

/**
 * 格式化为日期格式
 * @param timestamp 毫秒时间戳
 * @returns 日期字符串
 */
export const formatDate = (timestamp: number): string => {
  if (!timestamp) return '';
  
  return formatTimestamp(timestamp, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};