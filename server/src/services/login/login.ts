import { pool } from '../../db/index.js';
import { users } from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../../db/index.js';

interface LoginParams {
  email: string;
  password: string;
}

interface LoginResult {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
  token: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export async function loginUser({ email, password }: LoginParams): Promise<LoginResult> {
  // 1. 查找用户
  const [user] = await db.select({
    id: users.id,
    username: users.username,
    email: users.email,
    password: users.password,
    avatar: users.avatar,
  }).from(users).where(eq(users.email, email));
  
  if (!user) {
    throw new Error('邮箱或密码错误');
  }

  // 2. 验证密码
  const isValid = await bcrypt.compare(password, user.password);
  
  if (!isValid) {
    throw new Error('邮箱或密码错误');
  }

  // 3. 生成 JWT token
  const token = jwt.sign(
    { id: user.id, email: user.email, username: user.username },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN as any }
  );

  // 4. 返回用户信息（不含密码）
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    token,
  };
}
