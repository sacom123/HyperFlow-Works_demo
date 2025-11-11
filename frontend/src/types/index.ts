// 공통 타입 정의
export interface ApiResponse<T = any> {
  data: T
  message?: string
  status?: string
}

export interface HealthCheckResponse {
  status: string
  message: string
  timestamp: string
}

