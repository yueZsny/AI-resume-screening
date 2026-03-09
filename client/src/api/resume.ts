import instance from "../utils/http";

// 简历类型
export interface Resume {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  resumeFile: string | null;
  originalFileName: string | null;
  fileType: string | null;
  fileSize: number | null;
  summary: string | null;
  parsedContent: string | null;
  createdAt: string;
}

// 上传简历参数
export interface UploadResumeParams {
  file: File;
  name?: string;
  email?: string;
  phone?: string;
}

/**
 * 上传简历
 */
export const uploadResume = async (params: UploadResumeParams): Promise<Resume> => {
  const formData = new FormData();
  formData.append('file', params.file);
  if (params.name) formData.append('name', params.name);
  if (params.email) formData.append('email', params.email);
  if (params.phone) formData.append('phone', params.phone);

  const response = await instance.post('/v1/resume/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};

/**
 * 获取简历列表
 */
export const getResumes = async (): Promise<Resume[]> => {
  const response = await instance.get('/v1/resumes');
  return response;
};

/**
 * 获取简历详情
 */
export const getResume = async (id: number): Promise<Resume> => {
  const response = await instance.get(`/v1/resume/${id}`);
  return response;
};

/**
 * 删除简历
 */
export const deleteResume = async (id: number): Promise<void> => {
  await instance.delete(`/v1/resume/${id}`);
};
