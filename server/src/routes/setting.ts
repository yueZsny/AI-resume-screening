import { Router, Request, Response } from 'express';
import type { Router as RouterType } from 'express';
import { authenticate } from '../middleware/auth.js';
import { getProfile, updateProfile } from '../services/setting/profile.js';
import {
  getEmailConfigs,
  getEmailConfigById,
  createEmailConfig,
  updateEmailConfig,
  deleteEmailConfig,
  testEmailConfig,
} from '../services/setting/email.js';

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

// ============ 邮箱配置相关接口 ============

// 获取邮箱配置列表
router.get('/emails', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const configs = await getEmailConfigs(userId);
    
    res.status(200).json({
      code: 200,
      data: configs,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : '获取邮箱配置失败';
    res.status(400).json({
      code: 400,
      message,
    });
  }
});

// 获取单个邮箱配置
router.get('/emails/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const configId = parseInt(req.params.id as string, 10);
    
    if (isNaN(configId)) {
      return res.status(400).json({
        code: 400,
        message: '无效的配置ID',
      });
    }
    
    const config = await getEmailConfigById(userId, configId);
    
    if (!config) {
      return res.status(404).json({
        code: 404,
        message: '邮箱配置不存在',
      });
    }
    
    res.status(200).json({
      code: 200,
      data: config,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : '获取邮箱配置失败';
    res.status(400).json({
      code: 400,
      message,
    });
  }
});

// 创建邮箱配置
router.post('/emails', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { email, authCode, imapHost, imapPort, smtpHost, smtpPort, isDefault } = req.body;
    
    if (!email || !authCode) {
      return res.status(400).json({
        code: 400,
        message: '邮箱地址和授权码不能为空',
      });
    }
    
    const config = await createEmailConfig(userId, {
      email,
      authCode,
      imapHost,
      imapPort,
      smtpHost,
      smtpPort,
      isDefault,
    });
    
    res.status(201).json({
      code: 201,
      data: config,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : '创建邮箱配置失败';
    res.status(400).json({
      code: 400,
      message,
    });
  }
});

// 更新邮箱配置
router.put('/emails/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const configId = parseInt(req.params.id as string, 10);
    
    if (isNaN(configId)) {
      return res.status(400).json({
        code: 400,
        message: '无效的配置ID',
      });
    }
    
    const { email, authCode, imapHost, imapPort, smtpHost, smtpPort, isDefault } = req.body;
    
    const config = await updateEmailConfig(userId, configId, {
      email,
      authCode,
      imapHost,
      imapPort,
      smtpHost,
      smtpPort,
      isDefault,
    });
    
    res.status(200).json({
      code: 200,
      data: config,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : '更新邮箱配置失败';
    res.status(400).json({
      code: 400,
      message,
    });
  }
});

// 删除邮箱配置
router.delete('/emails/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const configId = parseInt(req.params.id as string, 10);
    
    if (isNaN(configId)) {
      return res.status(400).json({
        code: 400,
        message: '无效的配置ID',
      });
    }
    
    await deleteEmailConfig(userId, configId);
    
    res.status(200).json({
      code: 200,
      message: '删除成功',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : '删除邮箱配置失败';
    res.status(400).json({
      code: 400,
      message,
    });
  }
});

// 测试邮箱配置
router.post('/emails/:id/test', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const configId = parseInt(req.params.id as string, 10);
    
    if (isNaN(configId)) {
      return res.status(400).json({
        code: 400,
        message: '无效的配置ID',
      });
    }
    
    const result = await testEmailConfig(userId, configId);
    
    res.status(200).json({
      code: result.success ? 200 : 400,
      data: result,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : '测试邮箱配置失败';
    res.status(400).json({
      code: 400,
      message,
    });
  }
});

export default router;
