# Vercel 部署指南

本项目支持前后端分离部署到 Vercel。

## 前置准备

1. **远程 MySQL 数据库**（Vercel Serverless 无法连接 localhost）
   - 推荐使用云数据库：阿里云RDS、腾讯云CDB、PlanetScale、Turso 等
   - 确保数据库允许外部连接（设置白名单）

2. **Vercel 账号**：https://vercel.com

3. **安装 Vercel CLI**（可选）：
```bash
npm i -g vercel
```

## 部署步骤

### 方式一：使用 Vercel Dashboard（推荐）

#### 1. 部署后端

1. 在 Vercel Dashboard 点击 "New Project"
2. 导入 `server` 目录
3. 配置环境变量：

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `DB_HOST` | 数据库主机 | `rm-xxx.mysql.rds.aliyuncs.com` |
| `DB_PORT` | 数据库端口 | `3306` |
| `DB_USER` | 数据库用户名 | `root` |
| `DB_PASSWORD` | 数据库密码 | `your_password` |
| `DB_NAME` | 数据库名称 | `resume_screening` |
| `JWT_SECRET` | JWT 密钥 | `your-secret-key` |
| `ENCRYPTION_KEY` | 加密密钥 | 32字节十六进制字符串 |

4. 点击 "Deploy"

#### 2. 部署前端

1. 在 Vercel Dashboard 点击 "New Project"
2. 导入 `client` 目录
3. 配置环境变量：

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `VITE_SERVER_URL` | 后端API地址 | `https://your-server.vercel.app` |

4. 点击 "Deploy"

### 方式二：使用 GitHub 集成（推荐）

1. 将代码推送到 GitHub 仓库
2. 在 Vercel Dashboard 导入仓库
3. 配置同上

### 方式三：使用 CLI

```bash
# 登录 Vercel
vercel login

# 部署后端
cd server
vercel --prod

# 部署前端
cd ../client
VITE_SERVER_URL=https://your-server.vercel.app vercel --prod
```

## 数据库迁移

部署前需要运行数据库迁移：

```bash
cd server

# 使用 MySQL 客户端连接远程数据库执行以下SQL：

-- 创建数据库
CREATE DATABASE IF NOT EXISTS resume_screening CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建 activities 表
CREATE TABLE IF NOT EXISTS `activities` (
  `id` serial AUTO_INCREMENT NOT NULL,
  `user_id` int NOT NULL,
  `type` varchar(50) NOT NULL,
  `resume_id` int,
  `resume_name` varchar(255),
  `description` longtext,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `activity_user_id_idx` (`user_id`),
  KEY `activity_created_at_idx` (`created_at`),
  CONSTRAINT `activities_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 其他表结构（使用 drizzle-kit generate 生成）
```

## 注意事项

### 冷启动
Vercel Serverless Functions 有冷启动延迟，首次请求可能较慢。

### 超时限制
Vercel 免费版函数超时限制为 10 秒，专业版为 60 秒。AI 筛选简历等长时间操作可能需要：
- 使用异步处理
- 升级到专业版
- 考虑使用 Queue 等后台任务

### 地区选择
建议后端部署区域与数据库区域一致，减少延迟。

### 文件上传
当前实现使用本地文件系统存储上传文件。Vercel Serverless 无法持久化本地文件，建议：
- 使用云存储（阿里云OSS、AWS S3等）
- 或使用 Vercel Blob Storage

如需修改，请修改 `server/src/services/resume/fetcher.ts` 中的上传逻辑。
