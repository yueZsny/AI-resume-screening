// 邮件模板相关类型

// 创建邮件模板输入
export interface EmailTemplateInput {
  name: string;
  subject: string;
  body: string;
}

// 邮件模板响应
export interface EmailTemplateResponse {
  id: number;
  userId: number;
  name: string;
  subject: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
}

// 发送邮件输入
export interface SendEmailInput {
  candidateIds: number[];
  subject: string;
  body: string;
  fromEmailId: number;
}

// 发送邮件结果
export interface SendEmailResult {
  success: boolean;
  message: string;
  sentCount: number;
  failedCount: number;
}

// 收件人类型
export interface EmailRecipient {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
}
