import { db } from '../../db/index.js';
import { users } from '../../db/schema.js';
import { eq } from 'drizzle-orm';

interface Profile {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// 获取用户信息
export async function getProfile(userId: number): Promise<Profile> {
  const [user] = await db.select({
    id: users.id,
    username: users.username,
    email: users.email,
    avatar: users.avatar,
    createdAt: users.createdAt,
    updatedAt: users.updatedAt,
  }).from(users).where(eq(users.id, userId));

  if (!user) {
    throw new Error('用户不存在');
  }

  return user;
}

// 更新用户信息
export async function updateProfile(
  userId: number,
  data: { username?: string; avatar?: string }
): Promise<Profile> {
  const [user] = await db
    .update(users)
    .set({
      username: data.username,
      avatar: data.avatar,
    })
    .where(eq(users.id, userId))
    .returning({
      id: users.id,
      username: users.username,
      email: users.email,
      avatar: users.avatar,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    });

  if (!user) {
    throw new Error('用户不存在');
  }

  return user;
}
