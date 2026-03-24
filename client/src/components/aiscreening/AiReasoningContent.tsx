import { useMemo } from "react";

/** 常见 AI 评估小节标题，用于在缺少换行时切分段落 */
const SECTION_HEADS =
  "技术面试需重点考察|教育背景评分|工作经历评分|技能匹配度评分|技能匹配评分|项目经验评分|综合评分|候选人评级|招聘建议|风险点";

function normalizeSections(raw: string): string {
  let t = raw.trim();
  if (!t) return "";
  const headAlt = SECTION_HEADS;
  t = t.replace(new RegExp(`([。；])\\s*(?=(${headAlt})[：:])`, "g"), "$1\n\n");
  t = t.replace(new RegExp(`(?<!^)\\s+(?=(${headAlt})[：:])`, "g"), "\n\n");
  return t.replace(/\n{3,}/g, "\n\n").trim();
}

const SCORE_LINE = /^(.+?)[：:]\s*(\d+)\s*\/\s*(\d+)\s*(.*)$/;

type ParsedBlock =
  | {
      kind: "score";
      title: string;
      num: number;
      den: number;
      body: string;
    }
  | { kind: "labeled"; title: string; value: string; rest: string }
  | { kind: "text"; content: string };

function parseOneBlock(paragraph: string): ParsedBlock {
  const lines = paragraph
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const first = lines[0] ?? "";

  const scoreM = first.match(SCORE_LINE);
  if (scoreM) {
    const tail = scoreM[4]?.trim() ?? "";
    const body = [tail, ...lines.slice(1)].filter(Boolean).join("\n");
    return {
      kind: "score",
      title: scoreM[1].trim(),
      num: Number(scoreM[2]),
      den: Math.max(1, Number(scoreM[3])),
      body,
    };
  }

  const labelM = first.match(/^(.+?)[：:]\s*(.+)$/);
  if (labelM) {
    const value = labelM[2].trim();
    const rest = lines.slice(1).join("\n");
    if (value.length <= 160) {
      return {
        kind: "labeled",
        title: labelM[1].trim(),
        value,
        rest,
      };
    }
  }

  return { kind: "text", content: paragraph };
}

function parseBlocks(raw: string): ParsedBlock[] {
  const normalized = normalizeSections(raw);
  return normalized
    .split(/\n\s*\n+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map(parseOneBlock);
}

function ScoreSection({
  title,
  num,
  den,
  body,
}: {
  title: string;
  num: number;
  den: number;
  body: string;
}) {
  const pct = Math.min(100, Math.max(0, Math.round((num / den) * 100)));
  return (
    <section className="rounded-xl border border-zinc-200/80 bg-white px-4 py-3 shadow-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h4 className="text-sm font-semibold text-zinc-900">{title}</h4>
        <span className="tabular-nums text-sm font-medium text-violet-600">
          {num}/{den}
        </span>
      </div>
      <div
        className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-100"
        aria-hidden
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      {body ? <ReasoningBody text={body} /> : null}
    </section>
  );
}

function LabeledRow({
  title,
  value,
  rest,
}: {
  title: string;
  value: string;
  rest: string;
}) {
  return (
    <section className="rounded-xl border border-zinc-200/80 bg-white px-4 py-3 shadow-sm">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <h4 className="text-sm font-semibold text-zinc-900">{title}</h4>
        <span className="text-sm font-medium text-zinc-800">{value}</span>
      </div>
      {rest ? <ReasoningBody text={rest} /> : null}
    </section>
  );
}

function ReasoningBody({ text }: { text: string }) {
  const clauses = text
    .split(/[；;]/)
    .map((c) => c.trim())
    .filter(Boolean);

  if (clauses.length >= 3) {
    return (
      <ul className="mt-3 list-inside list-disc space-y-1.5 text-sm leading-relaxed text-zinc-600 marker:text-zinc-400">
        {clauses.map((c, i) => (
          <li key={i} className="pl-0.5">
            {c}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p className="mt-3 text-sm leading-relaxed text-zinc-600 whitespace-pre-wrap">
      {text}
    </p>
  );
}

function TextBlock({ content }: { content: string }) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-200/90 bg-zinc-50/50 px-4 py-3">
      <p className="text-sm leading-relaxed text-zinc-700 whitespace-pre-wrap">
        {content}
      </p>
    </div>
  );
}

export function AiReasoningContent({ text }: { text: string }) {
  const blocks = useMemo(() => parseBlocks(text), [text]);

  if (blocks.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        暂无评估内容。完成 AI 筛选后将在此展示模型结论。
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {blocks.map((b, i) => {
        if (b.kind === "score") {
          return (
            <ScoreSection
              key={i}
              title={b.title}
              num={b.num}
              den={b.den}
              body={b.body}
            />
          );
        }
        if (b.kind === "labeled") {
          return (
            <LabeledRow key={i} title={b.title} value={b.value} rest={b.rest} />
          );
        }
        return <TextBlock key={i} content={b.content} />;
      })}
    </div>
  );
}
