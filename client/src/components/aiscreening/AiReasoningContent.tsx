import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * 豆包式阅读：白底卡片感、柔和分区、略大字重与行高，便于长文评估
 */
const mdComponents: Components = {
  h1: ({ children, ...props }) => (
    <h2
      className="mb-4 mt-0 text-lg font-semibold tracking-tight text-slate-900 first:mt-0"
      {...props}
    >
      {children}
    </h2>
  ),
  h2: ({ children, ...props }) => (
    <h3
      className="mb-3 mt-8 flex scroll-mt-4 flex-wrap items-center gap-2 rounded-xl bg-linear-to-r from-slate-50 to-blue-50/70 px-3.5 py-2.5 text-[15px] font-semibold text-slate-900 shadow-sm ring-1 ring-slate-100/90 first:mt-0"
      {...props}
    >
      {children}
    </h3>
  ),
  h3: ({ children, ...props }) => (
    <h4
      className="mb-2 mt-6 text-[15px] font-semibold text-slate-800 first:mt-2"
      {...props}
    >
      {children}
    </h4>
  ),
  h4: ({ children, ...props }) => (
    <h5 className="mb-2 mt-4 text-sm font-semibold text-slate-800" {...props}>
      {children}
    </h5>
  ),
  p: ({ children, ...props }) => (
    <p
      className="mb-4 text-[15px] leading-[1.75] text-slate-600 last:mb-0 [&+p]:mt-0"
      {...props}
    >
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul
      className="mb-4 space-y-2.5 pl-1 text-[15px] leading-[1.75] text-slate-600 marker:text-blue-400/90"
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol
      className="mb-4 list-decimal space-y-2.5 pl-6 text-[15px] leading-[1.75] text-slate-600 marker:font-medium marker:text-blue-500/80"
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="pl-1 [&>p]:mb-1.5 [&>p]:last:mb-0" {...props}>
      {children}
    </li>
  ),
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-slate-900" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }) => (
    <em className="text-slate-700 italic" {...props}>
      {children}
    </em>
  ),
  code: ({ className, children, ...props }) => {
    const isFenced = Boolean(className?.startsWith("language-"));
    if (isFenced) {
      return (
        <code
          className={`block font-mono text-[13px] leading-relaxed text-slate-100 ${className ?? ""}`}
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code
        className="rounded-md bg-slate-100/90 px-1.5 py-0.5 font-mono text-[0.8125rem] text-indigo-800 ring-1 ring-slate-200/80"
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ children, ...props }) => (
    <pre
      className="mb-4 overflow-x-auto rounded-xl border border-slate-200/90 bg-slate-900 p-4 shadow-inner"
      {...props}
    >
      {children}
    </pre>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="my-4 rounded-xl border border-violet-100/90 bg-linear-to-br from-violet-50/60 via-white to-slate-50/80 px-4 py-3.5 text-[15px] leading-relaxed text-slate-600 shadow-sm"
      {...props}
    >
      {children}
    </blockquote>
  ),
  a: ({ href, children, ...props }) => (
    <a
      href={href}
      className="font-medium text-blue-600 underline decoration-blue-200 underline-offset-[3px] transition-colors hover:text-blue-700 hover:decoration-blue-400"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  ),
  hr: () => (
    <hr className="my-8 border-0 border-t border-slate-200/90" />
  ),
  table: ({ children, ...props }) => (
    <div className="mb-4 w-full overflow-x-auto rounded-xl border border-slate-200/80 bg-white shadow-sm">
      <table className="w-full min-w-[min(100%,20rem)] border-collapse text-[14px]" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="bg-slate-50/95" {...props}>
      {children}
    </thead>
  ),
  th: ({ children, ...props }) => (
    <th
      className="border-b border-slate-200 px-3 py-2.5 text-left text-sm font-semibold text-slate-800"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="border-b border-slate-100 px-3 py-2.5 text-slate-600" {...props}>
      {children}
    </td>
  ),
};

export function AiReasoningContent({ text }: { text: string }) {
  const trimmed = text.trim();

  if (!trimmed) {
    return (
      <p className="text-sm text-slate-500">
        暂无评估内容。完成 AI 筛选后将在此展示模型结论。
      </p>
    );
  }

  return (
    <div
      className="doubao-reasoning-markdown mx-auto w-full max-w-[min(100%,40rem)] rounded-2xl border border-white/80 bg-white/85 px-3 pb-6.5 pt-4 shadow-[0_2px_12px_rgba(15,23,42,0.04)] ring-1 ring-slate-100/80 sm:px-5 sm:pb-7.5 sm:pt-6 [&_a]:break-all"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
        {trimmed}
      </ReactMarkdown>
    </div>
  );
}
