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
