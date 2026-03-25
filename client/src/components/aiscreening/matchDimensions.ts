import type { AiDimensionScores } from "../../types/ai";

const RADAR_ORDER: { key: keyof AiDimensionScores; label: string }[] = [
  { key: "skills", label: "技能" },
  { key: "projects", label: "项目" },
  { key: "experience", label: "经历" },
  { key: "education", label: "学历" },
  { key: "fit", label: "契合" },
  { key: "communication", label: "沟通" },
  { key: "stability", label: "稳定" },
];

function clampPercent(n: number): number {
  return Math.min(100, Math.max(0, Math.round(n)));
}

function isCompleteDimensions(o: Record<string, unknown>): boolean {
  return RADAR_ORDER.every(({ key }) => {
    const v = o[key];
    return typeof v === "number" && !Number.isNaN(v);
  });
}

/** 解析接口/库表中的 dimensionScores（对象或 JSON 字符串） */
export function parseStoredDimensionScores(
  raw: unknown,
): AiDimensionScores | undefined {
  if (raw == null) return undefined;
  if (typeof raw === "string") {
    try {
      const o = JSON.parse(raw) as unknown;
      return parseStoredDimensionScores(o);
    } catch {
      return undefined;
    }
  }
  if (typeof raw !== "object" || Array.isArray(raw)) return undefined;
  const o = raw as Record<string, unknown>;
  if (!isCompleteDimensions(o)) return undefined;
  return {
    skills: clampPercent(Number(o.skills)),
    projects: clampPercent(Number(o.projects)),
    experience: clampPercent(Number(o.experience)),
    education: clampPercent(Number(o.education)),
    fit: clampPercent(Number(o.fit)),
    communication: clampPercent(Number(o.communication)),
    stability: clampPercent(Number(o.stability)),
  };
}

export type MatchRadarRow = { dimension: string; value: number };

/** 模型或库表中的真实分项 → 雷达数据 */
export function radarRowsFromDimensions(d: AiDimensionScores): MatchRadarRow[] {
  return RADAR_ORDER.map(({ key, label }) => ({
    dimension: label,
    value: clampPercent(d[key]),
  }));
}

/** 无分项时的兜底（与综合分相关的示意分布） */
export function buildFallbackRadarRows(overallScore: number): MatchRadarRow[] {
  const s = Math.min(100, Math.max(0, overallScore));
  return [
    { dimension: "技能", value: clampPercent(s + 6) },
    { dimension: "项目", value: clampPercent(s - 2) },
    { dimension: "经历", value: clampPercent(s - 5) },
    { dimension: "学历", value: clampPercent(s - 18) },
    { dimension: "契合", value: clampPercent(s + 3) },
    { dimension: "沟通", value: clampPercent(s - 10) },
    { dimension: "稳定", value: clampPercent(s - 7) },
  ];
}
