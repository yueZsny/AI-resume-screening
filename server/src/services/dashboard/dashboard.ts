import { db } from "../../db/index.js";
import { resumes, activities } from "../../db/schema.js";
import { eq, sql, desc } from "drizzle-orm";

export interface DashboardStats {
  total: number;
  pending: number;
  passed: number;
  rejected: number;
  todayCount: number;
  recentActivities: any[];
}

/**
 * 获取 Dashboard 统计数据
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  // 获取简历总数
  const [totalResult] = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(resumes);
  const total = Number(totalResult?.count || 0);

  // 获取待筛选数量
  const [pendingResult] = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(resumes)
    .where(eq(resumes.status, "pending"));
  const pending = Number(pendingResult?.count || 0);

  // 获取匹配成功数量
  const [passedResult] = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(resumes)
    .where(eq(resumes.status, "passed"));
  const passed = Number(passedResult?.count || 0);

  // 获取被拒绝数量
  const [rejectedResult] = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(resumes)
    .where(eq(resumes.status, "rejected"));
  const rejected = Number(rejectedResult?.count || 0);

  // 获取今天的简历数量
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [todayResult] = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(resumes)
    .where(sql`${resumes.createdAt} >= ${today.toISOString()}`);
  const todayCount = Number(todayResult?.count || 0);

  // 获取最近活动（多取一些再按「简历+类型+描述+时间」去重，避免同一操作被记多次导致重复）
  const rawActivities = await db
    .select()
    .from(activities)
    .orderBy(desc(activities.createdAt))
    .limit(20);
  const seen = new Set<string>();
  const recentActivities = rawActivities
    .filter((row: any) => {
      const key = `${row.resumeId ?? ""}-${row.type}-${row.resumeName ?? ""}-${(row.description ?? "").slice(0, 80)}-${row.createdAt?.toISOString?.() ?? row.createdAt}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 5);

  return {
    total,
    pending,
    passed,
    rejected,
    todayCount,
    recentActivities,
  };
}

/**
 * 记录活动
 */
export async function createActivity(params: {
  userId: number;
  type: "upload" | "screening" | "pass" | "reject" | "interview";
  resumeId?: number;
  resumeName?: string;
  description?: string;
}): Promise<void> {
  await db.insert(activities).values({
    userId: params.userId,
    type: params.type,
    resumeId: params.resumeId || null,
    resumeName: params.resumeName || "",
    description: params.description || "",
  });
}
