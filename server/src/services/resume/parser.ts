import fs from 'fs';
import path from 'path';
import { getDocument } from 'pdfjs-dist/build/pdf.mjs';
import mammoth from 'mammoth';

interface ParseResult {
  content: string;
  error?: string;
}

/**
 * 解析 PDF 文件（纯 JS 实现，兼容 Serverless）
 */
async function parsePdf(filePath: string): Promise<ParseResult> {
  try {
    if (!fs.existsSync(filePath)) {
      return { content: '', error: '文件不存在' };
    }

    const dataBuffer = fs.readFileSync(filePath);
    if (!dataBuffer || dataBuffer.length === 0) {
      return { content: '', error: 'PDF 文件为空' };
    }

    const loadingTask = getDocument({
      data: new Uint8Array(dataBuffer),
      useSystemFonts: true,
    });
    const pdfDocument = await loadingTask.promise;

    const textParts: string[] = [];
    const numPages = pdfDocument.numPages;

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: { str?: string }) => item.str || '')
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
      if (pageText) {
        textParts.push(pageText);
      }
    }

    const fullText = textParts.join('\n');

    if (!fullText || fullText.trim().length === 0) {
      return { content: '', error: 'PDF 中没有可提取的文本内容（可能是图片扫描件）' };
    }

    return { content: fullText };
  } catch (error: any) {
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
      return { content: '', error: '文件不存在' };
    }

    const result = await mammoth.extractRawText({ path: filePath });
    
    if (!result.value || result.value.trim().length === 0) {
      return { content: '', error: 'Word 文档中没有可提取的文本内容' };
    }

    return { content: result.value };
  } catch (error: any) {
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
