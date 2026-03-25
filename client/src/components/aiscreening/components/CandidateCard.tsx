import { SCREENING_STATUS_META } from "../screeningConstants";

export interface CandidateInfo {
  id: number;
  name: string;
  phone?: string | null;
  score?: number | null;
  status: "pending" | "passed" | "rejected";
}

interface CandidateCardProps {
  candidate: CandidateInfo;
  isSelected: boolean;
  screeningResultScore?: number | null;
  onClick: () => void;
  /** 用于锚点或自动化，对应 `candidate-${id}` */
  itemId?: string;
}

function getInitials(name: string) {
  const t = name.trim();
  if (!t) return "?";
  return t.slice(0, 1).toUpperCase();
}

function scoreChipClass(score: number) {
  if (score >= 80) return "bg-blue-600 text-white";
  if (score >= 60) return "bg-blue-100 text-blue-700";
  return "bg-blue-50 text-blue-400";
}

export function CandidateCard({
  candidate,
  isSelected,
  screeningResultScore,
  onClick,
  itemId,
}: CandidateCardProps) {
  const meta = SCREENING_STATUS_META[candidate.status];
  const scoreVal = candidate.score ?? screeningResultScore ?? null;

  return (
    <li
      id={itemId}
      role="option"
      tabIndex={0}
      aria-selected={isSelected ? true : false}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={`group relative flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 ${
        isSelected
          ? "border-blue-200 bg-white shadow-md shadow-blue-900/5 ring-1 ring-blue-100"
          : "border-transparent bg-white/70 hover:border-blue-100/90 hover:bg-white hover:shadow-sm"
      }`}
    >
      {isSelected && (
        <span
          className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-blue-500"
          aria-hidden
        />
      )}
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black transition-colors ${
          isSelected
            ? "bg-blue-600 text-white"
            : "bg-blue-50 text-blue-700 ring-1 ring-blue-100/80 group-hover:bg-blue-100"
        }`}
        aria-hidden
      >
        {getInitials(candidate.name)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-blue-950">{candidate.name}</p>
        <div className="mt-0.5 flex min-w-0 items-center gap-1.5">
          <span
            className={`inline-flex shrink-0 items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${meta.badge}`}
          >
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${meta.dot}`} />
            {meta.label}
          </span>
          {candidate.phone && (
            <span className="min-w-0 truncate text-[11px] text-blue-900/40">
              {candidate.phone.slice(0, 3)}···
            </span>
          )}
        </div>
      </div>
      {scoreVal != null && (
        <span
          className={`shrink-0 rounded-lg px-2 py-1 text-xs font-black tabular-nums ${scoreChipClass(scoreVal)}`}
        >
          {scoreVal}
        </span>
      )}
    </li>
  );
}
