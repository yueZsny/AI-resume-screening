import express, { Request, Response, Router } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { db } from '../db/index.js';
import { resumes } from '../db/schema.js';
import { parseDocument, getFileType } from '../services/resume/parser.js';
import { eq, desc } from 'drizzle-orm';

const router: Router = express.Router();

/**
 * 从解析内容中提取姓名、邮箱和电话
 */
function extractContactInfo(content: string): { name: string; email: string; phone: string } {
  let name = '';
  let email = '';
  let phone = '';

  // 提取邮箱
  const emailMatch = content.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    email = emailMatch[0];
  }

  // 提取电话 - 匹配各种格式的电话号码
  const phoneMatch = content.match(/1[3-9]\d{9,10}/);
  if (phoneMatch) {
    phone = phoneMatch[0];
  }

  // 提取姓名 - 通常在文件开头的前几行
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length > 0) {
    // 第一行通常是姓名
    const firstLine = lines[0].trim();
    // 检查第一行是否像名字（不包含特殊字符，长度2-20个字符）
    if (/^[\u4e00-\u9fa5]{2,20}$/.test(firstLine) || /^[a-zA-Z\s]{2,20}$/.test(firstLine)) {
      name = firstLine;
    }
  }

  return { name, email, phone };
}

// 确保上传目录存在
const uploadDir = path.join(process.cwd(), 'uploads', 'resumes');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置 multer 存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

// 文件过滤器
const fileFilter = (req: express.Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedTypes = ['.pdf', '.docx', '.doc'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('只支持 PDF、Word 文档上传'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB 限制
  }
});

/**
 * 上传简历
 */
router.post('/resume/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        code: 400,
        message: '请选择要上传的文件'
      });
    }

    const file = req.file;
    const originalFileName = file.originalname;
    const fileType = getFileType(originalFileName);
    const fileSize = file.size;
    const filePath = file.path;

    console.log('收到上传文件:', {
      originalFileName,
      fileType,
      fileSize,
      filePath
    });

    // 解析文档内容
    const parseResult = await parseDocument(filePath, originalFileName);
    
    if (parseResult.error) {
      // 删除上传的文件
      fs.unlinkSync(filePath);
      console.error('文档解析失败:', parseResult.error);
      return res.status(400).json({
        code: 400,
        message: parseResult.error
      });
    }

    // 从解析内容中提取联系信息
    const extractedInfo = extractContactInfo(parseResult.content);
    
    // 优先使用表单数据，否则使用提取的信息
    const name = req.body.name || extractedInfo.name || originalFileName.replace(/\.(pdf|docx|doc)$/i, '');
    const email = req.body.email || extractedInfo.email || '';
    const phone = req.body.phone || extractedInfo.phone || '';

    // 获取用户ID
    const userId = Number((req as any).user?.id) || 1;

    // 插入数据库
    await db.insert(resumes).values({
      userId,
      name,
      email,
      phone,
      resumeFile: filePath,
      originalFileName,
      fileType,
      fileSize,
      summary: parseResult.content.substring(0, 500), // 取前500字符作为摘要
      parsedContent: parseResult.content
    });

    // 获取刚插入的记录（按创建时间排序取最新的）
    const [newResume] = await db.select().from(resumes)
      .orderBy(desc(resumes.id))
      .limit(1);

    res.json({
      code: 200,
      message: '简历上传成功',
      data: newResume
    });
  } catch (error: any) {
    console.error('上传简历失败:', error);
    res.status(500).json({
      code: 500,
      message: error.message || '上传失败'
    });
  }
});

/**
 * 获取简历列表
 */
router.get('/resumes', async (req: Request, res: Response) => {
  try {
    const resumeList = await db.select().from(resumes).orderBy(desc(resumes.createdAt));
    
    res.json({
      code: 200,
      data: resumeList
    });
  } catch (error: any) {
    console.error('获取简历列表失败:', error);
    res.status(500).json({
      code: 500,
      message: error.message || '获取失败'
    });
  }
});

/**
 * 获取简历详情
 */
router.get('/resume/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const [resume] = await db.select().from(resumes).where(eq(resumes.id, id));
    
    if (!resume) {
      return res.status(404).json({
        code: 404,
        message: '简历不存在'
      });
    }

    res.json({
      code: 200,
      data: resume
    });
  } catch (error: any) {
    console.error('获取简历详情失败:', error);
    res.status(500).json({
      code: 500,
      message: error.message || '获取失败'
    });
  }
});

/**
 * 删除简历
 */
router.delete('/resume/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const [resume] = await db.select().from(resumes).where(eq(resumes.id, id));
    
    if (!resume) {
      return res.status(404).json({
        code: 404,
        message: '简历不存在'
      });
    }

    // 删除文件
    if (resume.resumeFile && fs.existsSync(resume.resumeFile)) {
      fs.unlinkSync(resume.resumeFile);
    }

    // 删除数据库记录
    await db.delete(resumes).where(eq(resumes.id, id));

    res.json({
      code: 200,
      message: '删除成功'
    });
  } catch (error: any) {
    console.error('删除简历失败:', error);
    res.status(500).json({
      code: 500,
      message: error.message || '删除失败'
    });
  }
});

export default router;
