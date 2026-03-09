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
  status: 'pending' | 'rejected' | 'passed';
  createdAt: string;
}

// 上传简历参数
export interface UploadResumeParams {
  file: File;
  name?: string;
  email?: string;
  phone?: string;
}

// 从邮箱导入简历参数
export interface ImportFromEmailParams {
  configId: number;
  since?: string; // ISO 日期字符串
  limit?: number;
}

// 从邮箱导入简历结果
export interface ImportFromEmailResult {
  imported: number;
  resumes: Resume[];
}