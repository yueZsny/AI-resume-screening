import fs from 'fs';
import path from 'path';
import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';

interface ParseResult {
  content: string;
  error?: string;
}

/**
 * 解析 PDF 文件
 */
async function parsePdf(filePath: string): Promise<ParseResult> {
  try {
    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      console.error('PDF 文件不存在:', filePath);
      return { content: '', error: '文件不存在' };
    }

    const dataBuffer = fs.readFileSync(filePath);
    
    // 检查文件是否为空
    if (!dataBuffer || dataBuffer.length === 0) {
      console.error('PDF 文件为空');
      return { content: '', error: 'PDF 文件为空' };
    }

    console.log('PDF 文件大小:', dataBuffer.length, 'bytes');

    // 解析 PDF - 使用 v2 API
    const parser = new PDFParse({
      data: dataBuffer,
    });
    const data = await parser.getText();

    console.log('PDF 解析成功，提取文本长度:', data.text?.length || 0);

    if (!data.text || data.text.trim().length === 0) {
      return { content: '', error: 'PDF 中没有可提取的文本内容（可能是图片扫描件）' };
    }

    return { content: data.text };
  } catch (error: any) {
    console.error('PDF 解析详细错误:', error);
    const errorMessage = error?.message || 'PDF 解析失败';
    return { content: '', error: errorMessage };
  }
}

/**
 * 解析 Word 文档 (.docx, .doc)
 */
async function parseWord(filePath: string): Promise<ParseResult> {
  try {
    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      console.error('Word 文件不存在:', filePath);
      return { content: '', error: '文件不存在' };
    }

    const result = await mammoth.extractRawText({ path: filePath });
    
    if (!result.value || result.value.trim().length === 0) {
      return { content: '', error: 'Word 文档中没有可提取的文本内容' };
    }

    console.log('Word 解析成功，提取文本长度:', result.value.length);
    return { content: result.value };
  } catch (error: any) {
    console.error('Word 文档解析详细错误:', error);
    const errorMessage = error?.message || 'Word 文档解析失败';
    return { content: '', error: errorMessage };
  }
}

/**
 * 根据文件类型解析文件
 */
export async function parseDocument(
  filePath: string,
  fileName: string
): Promise<ParseResult> {
  const ext = path.extname(fileName).toLowerCase();

  console.log('开始解析文件:', fileName, '类型:', ext);

  switch (ext) {
    case '.pdf':
      return await parsePdf(filePath);
    case '.docx':
    case '.doc':
      return await parseWord(filePath);
    default:
      return { content: '', error: '不支持的文件类型' };
  }
}

/**
 * 获取文件类型
 */
export function getFileType(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  switch (ext) {
    case '.pdf':
      return 'pdf';
    case '.docx':
      return 'docx';
    case '.doc':
      return 'doc';
    default:
      return 'unknown';
  }
}
