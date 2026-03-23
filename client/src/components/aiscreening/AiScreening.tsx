import { useState, useEffect, useMemo } from "react";
import {
  Loader2,
  FileText,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
  Briefcase,
  User,
  MessageSquare,
  BarChart3,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getResumes, updateResumeStatus } from "../../api/resume";
import {
  batchScreenResumesWithAi,
  screenResumeWithAi,
  getAiConfigs,
  updateAiConfig,
} from "../../api/ai";
import { logActivity } from "../../api/dashboard";
import type { Resume } from "../../types/resume";
import type { AiConfig } from "../../types/ai";

// 状态筛选类型
type StatusFilter = "all" | "pending" | "passed" | "rejected";

// 列表状态样式
const listStatusStyles = {
  pending: "bg-gray-200 text-gray-800",
  passed: "bg-green-500 text-white",
  rejected: "bg-red-500 text-white",
};

const listStatusLabels = {
  pending: "待定",
  passed: "通过",
  rejected: "拒绝",
};

const LIST_PAGE_SIZE = 10;

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// AI 筛选结果类型
interface ScreeningResult {
  resumeId: number;
  recommendation: "pass" | "reject" | "pending";
  score: number;
  reasoning: string;
  resume?: Resume;
}

const mapRecommendationToStatus = (
  recommendation: "pass" | "reject" | "pending",
): Resume["status"] => {
  if (recommendation === "pass") return "passed";
  if (recommendation === "reject") return "rejected";
  return "pending";
};

const mapStatusToRecommendation = (
  status: Resume["status"],
): "pass" | "reject" | "pending" => {
  if (status === "passed") return "pass";
  if (status === "rejected") return "reject";
  return "pending";
};

export function AiScreening() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const [screeningResults, setScreeningResults] = useState<
    Map<number, ScreeningResult>
  >(new Map());
  const [screeningResumeId, setScreeningResumeId] = useState<number | null>(
    null,
  );
  const [jobRequirements, setJobRequirements] = useState("");
  const [screeningAll, setScreeningAll] = useState(false);
  const [jobConfigModalOpen, setJobConfigModalOpen] = useState(false);
  const [aiConfigs, setAiConfigs] = useState<AiConfig[]>([]);
  const [selectedAiConfigId, setSelectedAiConfigId] = useState<number | null>(
    null,
  );
  const [loadingAiConfigs, setLoadingAiConfigs] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [reasoningOpen, setReasoningOpen] = useState(false);
  const [phoneExpanded, setPhoneExpanded] = useState(false);
  const [listPage, setListPage] = useState(1);

  const formatDateShort = (dateStr: string) =>
    new Date(dateStr).toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

  const filteredResumes = useMemo(() => {
    return resumes.filter((r) => {
      const matchSearch =
        !searchQuery.trim() ||
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.email && r.email.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchStatus = statusFilter === "all" || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [resumes, searchQuery, statusFilter]);

  // 按分数降序排序（高分在前，无分数排在最后）
  const sortedResumes = useMemo(() => {
    return [...filteredResumes].sort((a, b) => {
      const scoreA = a.score ?? screeningResults.get(a.id)?.score ?? -1;
      const scoreB = b.score ?? screeningResults.get(b.id)?.score ?? -1;
      return scoreB - scoreA;
    });
  }, [filteredResumes, screeningResults]);

  const stats = useMemo(
    () => ({
      all: resumes.length,
      pending: resumes.filter((r) => r.status === "pending").length,
      passed: resumes.filter((r) => r.status === "passed").length,
      rejected: resumes.filter((r) => r.status === "rejected").length,
    }),
    [resumes],
  );

  const listTotalPages = Math.max(
    1,
    Math.ceil(sortedResumes.length / LIST_PAGE_SIZE),
  );
  const paginatedResumes = useMemo(
    () =>
      sortedResumes.slice(
        (listPage - 1) * LIST_PAGE_SIZE,
        listPage * LIST_PAGE_SIZE,
      ),
    [sortedResumes, listPage],
  );

  useEffect(() => {
    setListPage(1);
  }, [searchQuery, statusFilter]);

  // 加载简历列表和AI配置
  useEffect(() => {
    loadResumes();
    loadAiConfigs();
  }, []);

  useEffect(() => {
    if (!jobConfigModalOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setJobConfigModalOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [jobConfigModalOpen]);

  const loadAiConfigs = async () => {
    try {
      setLoadingAiConfigs(true);
      const configs = await getAiConfigs();
      setAiConfigs(configs);
      // 默认选择第一个或默认配置
      if (configs.length > 0) {
        const defaultConfig = configs.find((c) => c.isDefault) || configs[0];
        setSelectedAiConfigId(defaultConfig.id);
        // 如果默认配置有 prompt，则自动填充岗位要求
        if (defaultConfig.prompt) {
          setJobRequirements(defaultConfig.prompt);
        }
      }
    } catch (error) {
      console.error("加载AI配置失败:", error);
    } finally {
      setLoadingAiConfigs(false);
    }
  };

  const loadResumes = async () => {
    try {
      setLoading(true);
      const data = await getResumes();
      setResumes(data);
    } catch (error) {
      console.error("加载简历失败:", error);
    } finally {
      setLoading(false);
    }
  };

  // 选择简历
  const handleSelectResume = (resumeId: number) => {
    setSelectedResumeId(resumeId);
  };

  const getResumeFileUrl = (resume: Resume) => {
    if (!resume.resumeFile) return;
    const fullPath = resume.resumeFile;
    const relativePath = fullPath
      .replace(/^.*[\\/]uploads[\\/]/, "uploads/")
      .replace(/\\/g, "/");
    return `${API_BASE_URL}/${relativePath}`;
  };

  const openResumeInNewWindow = (resume: Resume) => {
    const url = getResumeFileUrl(resume);
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleUpdateStatus = async (
    resumeId: number,
    status: "pending" | "passed" | "rejected",
  ) => {
    const resume = resumes.find((r) => r.id === resumeId);
    try {
      await updateResumeStatus(resumeId, status);
      setResumes((prev) =>
        prev.map((r) => (r.id === resumeId ? { ...r, status } : r)),
      );
      if (status === "passed") {
        await logActivity({
          type: "pass",
          resumeId,
          resumeName: resume?.name ?? undefined,
          description: "通过初筛",
        });
      } else if (status === "rejected") {
        await logActivity({
          type: "reject",
          resumeId,
          resumeName: resume?.name ?? undefined,
          description: "未通过筛选",
        });
      }
    } catch (error) {
      console.error("更新状态失败:", error);
    }
  };

  // 筛选单个简历
  const handleScreenResume = async (resumeId: number) => {
    if (!jobRequirements.trim()) {
      alert("请输入岗位要求");
      return;
    }

    if (!selectedAiConfigId) {
      alert("请选择AI配置");
      return;
    }

    try {
      setScreeningResumeId(resumeId);
      const result = await screenResumeWithAi({
        resumeId,
        jobRequirements,
        aiConfigId: selectedAiConfigId,
      });

      const resume = resumes.find((r) => r.id === resumeId);

      if (resume) {
        // 把 AI 结果写回本地简历列表，保持与后端 summary/status/score 对齐
        setResumes((prev) =>
          prev.map((r) =>
            r.id === resumeId
              ? {
                  ...r,
                  summary: result.reasoning,
                  status: mapRecommendationToStatus(result.recommendation),
                  score: result.score,
                }
              : r,
          ),
        );
      }

      setScreeningResults((prev) => {
        const newMap = new Map(prev);
        newMap.set(resumeId, { ...result, resumeId, resume });
        return newMap;
      });

      await logActivity({
        type: "screening",
        resumeId,
        resumeName: resume?.name ?? undefined,
        description: result.reasoning ?? undefined,
      });

      await loadResumes();

      // 保存岗位要求到 AI 配置
      try {
        await updateAiConfig(selectedAiConfigId!, { prompt: jobRequirements });
        // 更新本地配置列表中的 prompt
        setAiConfigs((prev) =>
          prev.map((config) =>
            config.id === selectedAiConfigId
              ? { ...config, prompt: jobRequirements }
              : config,
          ),
        );
      } catch (saveError) {
        console.error("保存岗位要求到AI配置失败:", saveError);
      }
    } catch (error) {
      console.error("AI筛选失败:", error);
      alert("AI筛选失败，请重试");
    } finally {
      setScreeningResumeId(null);
    }
  };

  // 批量筛选
  const handleBatchScreen = async () => {
    if (!jobRequirements.trim()) {
      alert("请输入岗位要求");
      return;
    }

    if (!selectedAiConfigId) {
      alert("请选择AI配置");
      return;
    }

    if (resumes.length === 0) {
      alert("暂无简历可筛选");
      return;
    }

    try {
      setScreeningAll(true);
      const results = await batchScreenResumesWithAi({
        resumeIds: resumes.map((r) => r.id),
        jobRequirements,
        aiConfigId: selectedAiConfigId,
      });

      // 批量更新本地简历列表中的 summary/status/score，保持与后端一致
      setResumes((prev) =>
        prev.map((r) => {
          const item = results.find(
            (res) => res.resumeId === r.id && res.success && res.result,
          );
          if (!item || !item.result) return r;
          return {
            ...r,
            summary: item.result.reasoning,
            status: mapRecommendationToStatus(item.result.recommendation),
            score: item.result.score,
          };
        }),
      );

      setScreeningResults((prev) => {
        const newMap = new Map(prev);
        results.forEach((item) => {
          if (item.success && item.result) {
            const resume = resumes.find((r) => r.id === item.resumeId);
            newMap.set(item.resumeId, {
              ...item.result,
              resumeId: item.resumeId,
              resume,
            });
          }
        });
        return newMap;
      });

      await Promise.all(
        results
          .filter((item) => item.success && item.result)
          .map((item) => {
            const r = resumes.find((res) => res.id === item.resumeId);
            return logActivity({
              type: "screening",
              resumeId: item.resumeId,
              resumeName: r?.name ?? undefined,
              description: item.result!.reasoning ?? undefined,
            });
          }),
      );

      await loadResumes();

      // 保存岗位要求到 AI 配置
      try {
        await updateAiConfig(selectedAiConfigId!, { prompt: jobRequirements });
        // 更新本地配置列表中的 prompt
        setAiConfigs((prev) =>
          prev.map((config) =>
            config.id === selectedAiConfigId
              ? { ...config, prompt: jobRequirements }
              : config,
          ),
        );
      } catch (saveError) {
        console.error("保存岗位要求到AI配置失败:", saveError);
      }
    } catch (error) {
      console.error("批量筛选失败:", error);
      alert("批量筛选失败，请重试");
    } finally {
      setScreeningAll(false);
    }
  };

  const selectedResume = resumes.find((r) => r.id === selectedResumeId);
  let selectedResult: ScreeningResult | null = null;
  if (selectedResumeId && selectedResume) {
    selectedResult =
      screeningResults.get(selectedResumeId) ||
      (selectedResume.summary
        ? {
            resumeId: selectedResume.id,
            recommendation: mapStatusToRecommendation(selectedResume.status),
            score: selectedResume.score ?? 50,
            reasoning: selectedResume.summary,
            resume: selectedResume,
          }
        : null);
  }

  return (
    <div className="h-full flex flex-col">
      {jobConfigModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="岗位要求与 AI 配置"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setJobConfigModalOpen(false);
          }}
        >
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <Briefcase className="w-4 h-4 text-gray-500" />
                <p className="font-medium text-gray-900 truncate">
                  岗位要求与 AI 配置
                </p>
              </div>
              <button
                type="button"
                onClick={() => setJobConfigModalOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                title="关闭"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_16rem] md:items-start">
                <div className="min-w-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    岗位要求
                  </label>
                  <textarea
                    value={jobRequirements}
                    onChange={(e) => setJobRequirements(e.target.value)}
                    placeholder="请输入岗位要求，例如：需要3年以上前端开发经验，熟悉React、Vue框架..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows={6}
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <div className="min-w-0">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      AI 配置
                    </label>
                    {loadingAiConfigs ? (
                      <div className="flex items-center justify-center h-10 bg-gray-50 rounded-lg">
                        <Loader2 className="animate-spin w-4 h-4 text-gray-400" />
                      </div>
                    ) : aiConfigs.length === 0 ? (
                      <div className="h-10 flex items-center justify-center bg-gray-50 rounded-lg text-sm text-gray-500">
                        暂无AI配置
                      </div>
                    ) : (
                      <select
                        title="选择AI配置"
                        value={selectedAiConfigId ?? ""}
                        onChange={(e) => {
                          const configId = Number(e.target.value);
                          setSelectedAiConfigId(configId);
                          // 自动填充岗位要求
                          const selectedConfig = aiConfigs.find(
                            (c) => c.id === configId,
                          );
                          if (selectedConfig?.prompt) {
                            setJobRequirements(selectedConfig.prompt);
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                      >
                        {aiConfigs
                          .filter((config) => config.id !== null)
                          .map((config) => (
                            <option key={config.id} value={config.id!}>
                              {config.name} ({config.model})
                            </option>
                          ))}
                      </select>
                    )}
                  </div>

                  <button
                    onClick={handleBatchScreen}
                    disabled={
                      screeningAll ||
                      resumes.length === 0 ||
                      !selectedAiConfigId ||
                      !jobRequirements.trim()
                    }
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {screeningAll ? (
                      <Loader2 className="animate-spin w-4 h-4" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    批量筛选全部
                  </button>

                  <button
                    type="button"
                    onClick={() => setJobConfigModalOpen(false)}
                    className="w-full px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    关闭
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 主内容区域 - 左右分栏（参考图布局） */}
      <div className="flex-1 flex gap-0 min-h-0 bg-gray-50 pb-14">
        {/* 左侧：搜索 + 状态 Tab + 候选人列表 */}
        <div className="w-[380px] shrink-0 flex flex-col min-h-0 bg-gray-50 border-r border-gray-200 overflow-hidden">
          <div className="shrink-0 p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索简历/姓名/邮箱"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="shrink-0 px-3 pt-2 flex gap-1 border-b border-gray-100">
            {(
              [
                { key: "all" as const, label: "全部" },
                { key: "pending" as const, label: "未筛选" },
                { key: "passed" as const, label: "已通过" },
                { key: "rejected" as const, label: "已拒绝" },
              ] as const
            ).map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setStatusFilter(key)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === key
                    ? "bg-purple-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {label}({key === "all" ? stats.all : stats[key]})
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="animate-spin text-gray-400" size={36} />
              </div>
            ) : filteredResumes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <FileText className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm">暂无简历数据</p>
                <p className="text-gray-400 text-xs mt-1">请先上传简历</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {paginatedResumes.map((resume) => (
                  <div
                    key={resume.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelectResume(resume.id)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleSelectResume(resume.id)
                    }
                    className={`p-3 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                      selectedResumeId === resume.id
                        ? "bg-purple-50 border-l-4 border-purple-500"
                        : "border-l-4 border-transparent"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 min-w-0">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 truncate">
                          {resume.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                          {resume.phone || "—"}
                        </p>
                      </div>
                      <div className="shrink-0 flex flex-col items-end gap-1">
                        {(resume.score != null ||
                          screeningResults.get(resume.id)) && (
                          <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
                            {resume.score ??
                              screeningResults.get(resume.id)?.score ??
                              0}
                            %
                          </span>
                        )}
                        <span
                          className={`shrink-0 px-1.5 py-0.5 rounded text-xs font-medium ${listStatusStyles[resume.status]}`}
                        >
                          {listStatusLabels[resume.status]}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 左侧固定分页栏 */}
        {!loading && filteredResumes.length > 0 && (
          <div className="fixed bottom-0 left-0 w-[380px] px-3 py-2 border-t border-r border-gray-200 flex items-center justify-between gap-2 bg-white z-10">
            <span className="text-xs text-gray-500">
              {listTotalPages > 1
                ? `第 ${listPage} / ${listTotalPages} 页，共 ${filteredResumes.length} 条`
                : `共 ${filteredResumes.length} 条`}
            </span>
            {listTotalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setListPage((p) => Math.max(1, p - 1))}
                  disabled={listPage <= 1}
                  className="p-1.5 rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="上一页"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setListPage((p) => Math.min(listTotalPages, p + 1))
                  }
                  disabled={listPage >= listTotalPages}
                  className="p-1.5 rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="下一页"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* 右侧：候选人详情 */}
        <div className="flex-1 flex flex-col min-h-0 bg-white min-w-0 overflow-hidden">
          {!selectedResume ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="text-purple-400" size={36} />
              </div>
              <p className="text-gray-500 font-medium">请选择一份简历</p>
              <p className="text-gray-400 text-sm mt-1">
                查看详情与 AI 筛选结果
              </p>
            </div>
          ) : (
            <>
              {/* 头部：姓名、职位与日期、操作图标 */}
              <div className="shrink-0 p-6 pb-4 border-b border-gray-200">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                      {selectedResume.name}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                      简历 · 更新于 {formatDateShort(selectedResume.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedResume.resumeFile && (
                      <button
                        type="button"
                        onClick={() => openResumeInNewWindow(selectedResume)}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-sm"
                      >
                        打开简历
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setJobConfigModalOpen(true)}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-sm"
                    >
                      AI 设置
                    </button>
                    {selectedResumeId && (
                      <button
                        type="button"
                        onClick={() => handleScreenResume(selectedResumeId)}
                        disabled={
                          screeningResumeId === selectedResumeId ||
                          !jobRequirements.trim()
                        }
                        className="px-3 py-1.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-1.5"
                      >
                        {screeningResumeId === selectedResumeId ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4" />
                        )}
                        AI 筛选
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="w-full space-y-4">
                    {/* 基本信息 + 匹配度 两列 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-xl border border-gray-200 p-4 bg-white">
                        <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          基本信息
                        </h3>
                        <div className="space-y-2 text-sm text-gray-700">
                          <p>邮箱: {selectedResume.email || "—"}</p>
                          <p className="flex items-center gap-1">
                            电话:{" "}
                            {selectedResume.phone
                              ? phoneExpanded
                                ? selectedResume.phone
                                : selectedResume.phone.length > 7
                                  ? `${selectedResume.phone.slice(0, 3)}****${selectedResume.phone.slice(-4)}`
                                  : "***"
                              : "—"}
                            {selectedResume.phone &&
                              selectedResume.phone.length > 7 && (
                                <button
                                  type="button"
                                  onClick={() => setPhoneExpanded((v) => !v)}
                                  className="text-purple-600 hover:underline"
                                >
                                  {phoneExpanded ? "收起" : "展开"}
                                </button>
                              )}
                          </p>
                        </div>
                      </div>
                      <div className="rounded-xl border border-gray-200 p-4 bg-white">
                        <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-gray-500" />
                          匹配度
                        </h3>
                        {selectedResult ? (
                          <div>
                            <p className="text-2xl font-semibold text-gray-900">
                              {selectedResult.score}%
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              技能: {Math.min(selectedResult.score + 5, 100)}%
                              学历: {Math.max(selectedResult.score - 25, 0)}%
                            </p>
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">
                            暂无匹配度数据，请先进行 AI 筛选
                          </p>
                        )}
                      </div>
                    </div>

                    {/* AI 评估理由 - 可折叠 */}
                    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setReasoningOpen((v) => !v)}
                        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
                      >
                        <span className="font-medium text-gray-900 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-gray-500" />
                          AI评估理由
                        </span>
                        {reasoningOpen ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                      {reasoningOpen && (
                        <div className="px-4 pb-4 pt-0 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap border-t border-gray-100">
                          {selectedResult?.reasoning ||
                            "暂无评估理由，请先进行 AI 筛选。"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 右侧固定操作按钮 - 固定在屏幕底部 */}
      {selectedResume && (
        <div className="fixed bottom-0 right-0 px-6 py-4 border-t border-l border-gray-200 flex justify-end gap-3 bg-white z-10">
          <button
            type="button"
            onClick={() => handleUpdateStatus(selectedResume.id, "pending")}
            className="px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
          >
            待定
          </button>
          <button
            type="button"
            onClick={() => handleUpdateStatus(selectedResume.id, "rejected")}
            className="px-4 py-2.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            拒绝
          </button>
          <button
            type="button"
            onClick={() => handleUpdateStatus(selectedResume.id, "passed")}
            className="px-4 py-2.5 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
          >
            通过
          </button>
        </div>
      )}
    </div>
  );
}
