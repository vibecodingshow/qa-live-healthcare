/**
 * 全局异常处理工具
 */

import { notification } from 'ant-design-vue';
import { AppointmentErrorCode, ErrorMessages, isAppointmentError } from './errors';

// 防抖函数
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
}

// 防抖 Hook (用于 Vue 组合式 API)
export function useDebounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number = 300
) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let pending = false;
  
  const handler = (...args: Parameters<T>) => {
    if (pending) {
      console.warn('Debounce: request pending, ignored');
      return;
    }
    
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    pending = true;
    
    timeoutId = setTimeout(() => {
      try {
        fn(...args);
      } catch (error) {
        console.error('Debounced function error:', error);
      } finally {
        timeoutId = null;
        pending = false;
      }
    }, delay);
  };
  
  const cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
      pending = false;
    }
  };
  
  const reset = () => {
    pending = false;
  };
  
  return { handler, cancel, reset, isPending: () => pending };
}

// 处理预约错误
export function handleAppointmentError(error: unknown): void {
  // 开发环境打印详细错误
  if (import.meta.env.DEV) {
    console.error('Appointment Error:', error);
  }
  
  let errorCode: AppointmentErrorCode;
  let errorMessage: string;
  let duration = 3; // 默认 3 秒自动关闭
  
  if (isAppointmentError(error)) {
    errorCode = error.code;
    errorMessage = error.message;
    
    // 网络错误不自动关闭
    if (errorCode === AppointmentErrorCode.NETWORK_ERROR || 
        errorCode === AppointmentErrorCode.TIMEOUT_ERROR) {
      duration = 0;
    }
  } else if (error instanceof Error) {
    errorCode = AppointmentErrorCode.UNKNOWN_ERROR;
    errorMessage = error.message || ErrorMessages[AppointmentErrorCode.UNKNOWN_ERROR];
    
    // 生产环境不暴露详细错误
    if (!import.meta.env.DEV) {
      errorMessage = ErrorMessages[AppointmentErrorCode.UNKNOWN_ERROR];
    }
  } else {
    errorCode = AppointmentErrorCode.UNKNOWN_ERROR;
    errorMessage = ErrorMessages[AppointmentErrorCode.UNKNOWN_ERROR];
  }
  
  // 根据错误码确定通知类型
  const type = getNotificationType(errorCode);
  
  notification[type]({
    message: getErrorTitle(errorCode),
    description: errorMessage,
    duration,
  });
}

// 获取通知类型
function getNotificationType(code: AppointmentErrorCode): 'success' | 'info' | 'warning' | 'error' {
  const warningCodes: AppointmentErrorCode[] = [
    AppointmentErrorCode.TOO_LATE_TO_CANCEL,
    AppointmentErrorCode.DUPLICATE_BOOKING,
    AppointmentErrorCode.PAST_SLOT,
  ];
  
  if (warningCodes.includes(code)) return 'warning';
  return 'error';
}

// 获取错误标题
function getErrorTitle(code: AppointmentErrorCode): string {
  const titles: Record<AppointmentErrorCode, string> = {
    [AppointmentErrorCode.SLOT_UNAVAILABLE]: '预约失败',
    [AppointmentErrorCode.SLOT_NOT_FOUND]: '系统错误',
    [AppointmentErrorCode.PAST_SLOT]: '无法预约',
    
    [AppointmentErrorCode.NETWORK_ERROR]: '网络异常',
    [AppointmentErrorCode.TIMEOUT_ERROR]: '请求超时',
    
    [AppointmentErrorCode.VALIDATION_ERROR]: '验证失败',
    [AppointmentErrorCode.PHONE_INVALID]: '手机号错误',
    [AppointmentErrorCode.NAME_INVALID]: '姓名错误',
    
    [AppointmentErrorCode.STORAGE_ERROR]: '保存失败',
    [AppointmentErrorCode.STORAGE_FULL]: '存储空间不足',
    
    [AppointmentErrorCode.DUPLICATE_BOOKING]: '重复预约',
    [AppointmentErrorCode.APPOINTMENT_NOT_FOUND]: '预约不存在',
    [AppointmentErrorCode.APPOINTMENT_CANCELLED]: '预约已取消',
    [AppointmentErrorCode.ALREADY_COMPLETED]: '操作失败',
    [AppointmentErrorCode.TOO_LATE_TO_CANCEL]: '取消失败',
    
    [AppointmentErrorCode.AUTH_ERROR]: '认证失败',
    [AppointmentErrorCode.UNAUTHORIZED]: '权限不足',
    
    [AppointmentErrorCode.UNKNOWN_ERROR]: '操作失败',
  };
  
  return titles[code] || '操作失败';
}

// 通用错误处理包装器
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  options?: {
    onError?: (error: unknown) => void;
    onSuccess?: () => void;
  }
): Promise<T | null> {
  try {
    const result = await fn();
    options?.onSuccess?.();
    return result;
  } catch (error) {
    handleAppointmentError(error);
    options?.onError?.(error);
    return null;
  }
}

// 带重试的错误处理
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  retryDelay: number = 1000
): Promise<T> {
  let lastError: unknown;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // 如果是业务错误（不是网络/超时），不重试
      if (isAppointmentError(error)) {
        const nonRetryableCodes: AppointmentErrorCode[] = [
          AppointmentErrorCode.VALIDATION_ERROR,
          AppointmentErrorCode.DUPLICATE_BOOKING,
          AppointmentErrorCode.TOO_LATE_TO_CANCEL,
          AppointmentErrorCode.ALREADY_COMPLETED,
        ];
        
        if (nonRetryableCodes.includes(error.code)) {
          throw error;
        }
      }
      
      // 等待后重试
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * (i + 1)));
      }
    }
  }
  
  throw lastError;
}

// 加载状态管理
const loadingStates = new Map<string, boolean>();

export function setLoading(key: string, loading: boolean): void {
  loadingStates.set(key, loading);
}

export function isLoading(key: string): boolean {
  return loadingStates.get(key) || false;
}

// 带加载状态的错误处理
export async function withLoading<T>(
  key: string,
  fn: () => Promise<T>
): Promise<T | null> {
  if (isLoading(key)) {
    return null;
  }
  
  setLoading(key, true);
  
  try {
    return await fn();
  } catch (error) {
    handleAppointmentError(error);
    return null;
  } finally {
    setLoading(key, false);
  }
}

// 确认对话框包装
export function showConfirm(options: {
  title: string;
  content: string;
  onOk?: () => void;
  onCancel?: () => void;
}): void {
  // 使用 Ant Design 的 Modal.confirm
  import('ant-design-vue').then(({ Modal }) => {
    Modal.confirm({
      title: options.title,
      content: options.content,
      okText: '确认',
      cancelText: '取消',
      okType: 'danger',
      onOk: options.onOk,
      onCancel: options.onCancel,
    });
  });
}

// 导出所有工具
export const errorHandler = {
  handle: handleAppointmentError,
  withErrorHandling,
  withRetry,
  withLoading,
  useDebounce,
  debounce,
  showConfirm,
};

export default errorHandler;
