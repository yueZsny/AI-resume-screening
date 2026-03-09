import instance from "../utils/http";
import type { Resume, UploadResumeParams } from "../types/resume";

/**
 * 上传简历
 */
export const uploadResume = async (params: UploadResumeParams): Promise<Resume> => {
  const formData = new FormData();
  formData.append('file', params.file);
  if (params.name) formData.append('name', params.name);
  if (params.email) formData.append('email', params.email);
  if (params.phone) formData.append('phone', params.phone);

  const response = await instance.post<Resume>('/v1/resume/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response as unknown as Resume;
};

/**
 * 获取简历列表
 */
export const getResumes = async (): Promise<Resume[]> => {
  const response = await instance.get<Resume[]>('/v1/resumes');
  return response as unknown as Resume[];
};

/**
 * 获取简历详情
 */
export const getResume = async (id: number): Promise<Resume> => {
  const response = await instance.get<Resume>(`/v1/resume/${id}`);
  return response as unknown as Resume;
};

/**
 * 删除简历
 */
export const deleteResume = async (id: number): Promise<void> => {
  await instance.delete(`/v1/resume/${id}`);
};
