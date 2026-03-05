import instance from "../utils/http";

// 健康检查响应类型（匹配后端实际返回的字段）
export interface HealthData {
  message: string;
  version: string;
}

// 健康检查 API（核心修正：提取 Axios 响应中的业务数据）
export const healthCheck = async (): Promise<HealthData> => {
  // 1. 发起请求，接收完整的 Axios 响应
  const response = await instance.get<HealthData>("/api/api"); // 修正接口路径
  // 2. 提取响应中的业务数据（关键！匹配 HealthData 类型）
  return response.data;
};