/// <reference types="node" />
import { defineConfig } from 'drizzle-kit';
// 如果你用了 .env 文件，需要引入 dotenv 读取环境变量
import * as dotenv from 'dotenv';
dotenv.config(); // 加载 .env 中的数据库配置

export default defineConfig({
  dialect: 'mysql', // 确认是 MySQL 方言（你的 schema 也是 MySQL 格式）
  schema: './src/db/schema.ts', // schema 文件路径（保持不变，确认路径正确）
  out: './drizzle', // 迁移文件输出目录（保持不变）
  dbCredentials: {
    // MySQL 连接配置（替换成你的实际数据库信息）
    host: process.env.DB_HOST || 'localhost', // 数据库地址，本地默认 localhost
    user: process.env.DB_USER || 'root', // 数据库账号，默认 root
    password: process.env.DB_PASSWORD || '123456', // 数据库密码（必填，改回你的实际密码）
    database: process.env.DB_NAME || 'ai_resume_db', // 数据库名（需提前创建好）
    port: Number(process.env.DB_PORT) || 3306, // MySQL 默认端口 3306（可选）
  },
  // 可选：开启调试模式，方便排查连接问题
  verbose: true,
  strict: true,
});