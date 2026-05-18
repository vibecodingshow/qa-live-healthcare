/**
 * 请求工具模块
 *
 * 提供统一的 HTTP 请求封装，包括：
 * - 响应类型定义
 * - 错误类型定义
 * - 基础请求函数
 * - 请求/响应拦截器
 * - 服务创建函数
 *
 * @version 1.0.0
 * @created 2026-04-22
 */

/**
 * API 基础配置
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const API_TIMEOUT = 10000;

/**
 * API 响应通用类型
 */
export interface ApiResponse<T = unknown> {
  /** 是否成功 */
  success: boolean;
  /** 响应数据 */
  data: T;
  /** 错误消息 */
  message?: string;
  /** 错误码 */
  errorCode?: string;
  /** 时间戳 */
  timestamp: number;
}

/**
 * 分页响应类型
 */
export interface PaginatedResponse<T> {
  /** 数据列表 */
  list: T[];
  /** 总数 */
  total: number;
  /** 当前页 */
  currentPage: number;
  /** 每页数量 */
  pageSize: number;
  /** 总页数 */
  totalPages: number;
}

/**
 * API 错误类
 */
export class ApiError extends Error {
  /** 错误码 */
  code: string;
  /** HTTP 状态码 */
  statusCode: number;
  /** 原始响应 */
  detail?: unknown;

  constructor(
    message: string,
    code: string = 'UNKNOWN_ERROR',
    statusCode: number = 500,
    detail?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = statusCode;
    this.detail = detail;
  }
}

/**
 * HTTP 请求方法类型
 */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

/**
 * 请求配置类型
 */
interface RequestConfig {
  /** 请求方法 */
  method: HttpMethod;
  /** 请求路径 */
  url: string;
  /** 请求参数（GET 时作为 query string） */
  params?: Record<string, unknown>;
  /** 请求体 */
  data?: unknown;
  /** 自定义请求头 */
  headers?: Record<string, string>;
  /** 超时时间（毫秒） */
  timeout?: number;
  /** 是否携带认证 token */
  withAuth?: boolean;
}

/**
 * 获取认证 Token
 * @returns token 字符串或 null
 */
function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

/**
 * 构建查询字符串
 * @param params - 参数对象
 * @returns 查询字符串
 */
function buildQueryString(params: Record<string, unknown>): string {
  const entries = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  return entries.length > 0 ? `?${entries.join('&')}` : '';
}

/**
 * 请求拦截器 - 添加认证 token 和通用头
 */
function requestInterceptor(config: RequestConfig): RequestConfig {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...config.headers,
  };

  // 添加认证 token
  if (config.withAuth !== false) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return { ...config, headers };
}

/**
 * 响应拦截器 - 统一错误处理
 * @param response - fetch Response 对象
 * @param url - 请求 URL
 */
async function responseInterceptor<T>(response: Response, _url: string): Promise<ApiResponse<T>> {
  // HTTP 状态码错误处理
  if (!response.ok) {
    const errorMessages: Record<number, string> = {
      400: '请求参数错误',
      401: '未授权，请重新登录',
      403: '拒绝访问',
      404: '请求的资源不存在',
      500: '服务器内部错误',
      502: '网关错误',
      503: '服务不可用',
    };

    const message = errorMessages[response.status] || `请求失败 (${response.status})`;
    throw new ApiError(message, `HTTP_${response.status}`, response.status);
  }

  // 解析响应体
  let result: ApiResponse<T>;
  try {
    result = await response.json();
  } catch {
    throw new ApiError('响应数据解析失败', 'PARSE_ERROR', response.status);
  }

  // 业务逻辑错误处理
  if (!result.success) {
    // 401 未授权 - 清除 token
    if (result.errorCode === 'UNAUTHORIZED' || result.errorCode === 'TOKEN_EXPIRED') {
      localStorage.removeItem('auth_token');
    }
    throw new ApiError(
      result.message || '业务处理失败',
      result.errorCode || 'BIZ_ERROR',
      response.status,
      result
    );
  }

  return result;
}

/**
 * 基础请求函数
 *
 * @param config - 请求配置
 * @returns API 响应数据
 *
 * @example
 * ```typescript
 * // GET 请求
 * const res = await request<{ id: string }>({
 *   method: 'GET',
 *   url: '/doctors',
 *   params: { department: '内科' }
 * });
 *
 * // POST 请求
 * const res = await request<Appointment>({
 *   method: 'POST',
 *   url: '/appointments',
 *   data: { doctorId: '1', patientId: '2', ... }
 * });
 * ```
 */
export async function request<T = unknown>(config: RequestConfig): Promise<T> {
  // 请求拦截
  const interceptedConfig = requestInterceptor(config);

  // 构建 URL
  let url = `${API_BASE_URL}${interceptedConfig.url}`;
  if (interceptedConfig.method === 'GET' && interceptedConfig.params) {
    url += buildQueryString(interceptedConfig.params);
  }

  // 构建请求选项
  const fetchOptions: RequestInit = {
    method: interceptedConfig.method,
    headers: interceptedConfig.headers,
  };

  // 非 GET 请求添加 body
  if (interceptedConfig.method !== 'GET' && interceptedConfig.data !== undefined) {
    fetchOptions.body = JSON.stringify(interceptedConfig.data);
  }

  // 超时控制
  const timeout = interceptedConfig.timeout || API_TIMEOUT;
  const controller = new AbortController();
  fetchOptions.signal = controller.signal;

  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, fetchOptions);
    const result = await responseInterceptor<T>(response, url);
    return result.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError('请求超时', 'TIMEOUT', 408);
    }
    if (error instanceof TypeError) {
      throw new ApiError('网络连接失败', 'NETWORK_ERROR', 0);
    }
    throw new ApiError(
      error instanceof Error ? error.message : '未知错误',
      'UNKNOWN_ERROR',
      500
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * API 服务方法类型
 */
interface ApiServiceMethods {
  get<T = unknown>(url: string, params?: Record<string, unknown>): Promise<T>;
  post<T = unknown>(url: string, data?: unknown): Promise<T>;
  put<T = unknown>(url: string, data?: unknown): Promise<T>;
  del<T = unknown>(url: string, params?: Record<string, unknown>): Promise<T>;
}

/**
 * 创建 API 服务
 *
 * @param baseUrl - 服务基础路径
 * @returns API 服务对象
 *
 * @example
 * ```typescript
 * const appointmentApi = createApiService('/appointments');
 *
 * // GET /api/appointments?patientId=123
 * const list = await appointmentApi.get<AppointmentListResponse>('/', { patientId: '123' });
 *
 * // POST /api/appointments
 * const appointment = await appointmentApi.post<Appointment>('/', createData);
 *
 * // DELETE /api/appointments/456
 * await appointmentApi.del('/456');
 * ```
 */
export function createApiService(baseUrl: string): ApiServiceMethods {
  return {
    get<T = unknown>(url: string, params?: Record<string, unknown>): Promise<T> {
      return request<T>({ method: 'GET', url: `${baseUrl}${url}`, params });
    },

    post<T = unknown>(url: string, data?: unknown): Promise<T> {
      return request<T>({ method: 'POST', url: `${baseUrl}${url}`, data });
    },

    put<T = unknown>(url: string, data?: unknown): Promise<T> {
      return request<T>({ method: 'PUT', url: `${baseUrl}${url}`, data });
    },

    del<T = unknown>(url: string, params?: Record<string, unknown>): Promise<T> {
      return request<T>({ method: 'DELETE', url: `${baseUrl}${url}`, params });
    },
  };
}
