import instance from "../utils/http";
import type { AiConfig, UpdateAiConfigData, CreateAiConfigData } from "../types/ai";

/**
 * 测试 AI 配置
 */
export const testAiConfig = async (data: {
  model: string;
  apiUrl: string;
  apiKey: string;
  task?: string;
}): Promise<{ success: boolean; message: string }> => {
  return instance.post("/v1/ai/test", data);
};

/**
 * 获取 AI 配置列表
 */
export const getAiConfigs = async (): Promise<AiConfig[]> => {
  return instance.get("/v1/ai/list");
};

/**
 * 获取默认 AI 配置
 */
export const getAiConfig = async (): Promise<AiConfig> => {
  return instance.get("/v1/ai");
};

/**
 * 创建 AI 配置
 */
export const createAiConfig = async (data: CreateAiConfigData): Promise<AiConfig> => {
  return instance.post("/v1/ai", data);
};

/**
 * 更新 AI 配置
 */
export const updateAiConfig = async (id: number, data: UpdateAiConfigData): Promise<AiConfig> => {
  return instance.put(`/v1/ai/${id}`, data);
};

/**
 * 删除 AI 配置
 */
export const deleteAiConfig = async (id: number): Promise<void> => {
  return instance.delete(`/v1/ai/${id}`);
};
