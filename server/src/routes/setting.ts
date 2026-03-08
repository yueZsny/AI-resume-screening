import { Router, Request, Response } from 'express';
import type { Router as RouterType } from 'express';
import { authenticate } from '../middleware/auth.js';
import { getProfile, updateProfile } from '../services/setting/profile.js';

const router: RouterType = Router();

// 获取个人信息
router.get('/profile', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const profile = await getProfile(userId);
    
    res.status(200).json({
      code: 200,
      data: profile,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : '获取个人信息失败';
    res.status(400).json({
      code: 400,
      message,
    });
  }
});

// 更新个人信息
router.put('/profile', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { username, avatar } = req.body;
    
    const profile = await updateProfile(userId, { username, avatar });
    
    res.status(200).json({
      code: 200,
      data: profile,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : '更新个人信息失败';
    res.status(400).json({
      code: 400,
      message,
    });
  }
});

export default router;
