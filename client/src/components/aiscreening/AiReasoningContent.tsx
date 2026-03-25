import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * 豆包式阅读：白底卡片感、柔和分区、略大字重与行高，便于长文评估
 */
const mdComponents: Components = {
  h1: ({ children, ...props }) => (
    <h2
      className="mb-4 mt-0 text-lg font-semibold tracking-tight text-[var(--md-text-primary,#0f172a)] first:mt-0"
      {...props}
    >
      {children}
    </h2>
  ),
  h2: ({ children, ...props }) => (
    <h3
      className="mb-3 mt-8 flex scroll-mt-4 flex-wrap items-center gap-2 rounded-xl bg-linear-to-r from-[var(--md-heading-bg-from,#f8fafc)] to-[var(--md-heading-bg-to,#eff6ff)] px-3.5 py-2.5 text-[15px] font-semibold text-[var(--md-text-primary,#0f172a)] shadow-[var(--app-shadow-sm)] ring-1 ring-[var(--md-heading-border,#e2e8f0)] first:mt-0"
      {...props}
    >
      {children}
    </h3>
  ),
  h3: ({ children, ...props }) => (
    <h4
      className="mb-2 mt-6 text-[15px] font-semibold text-[var(--md-text-primary,#0f172a)] first:mt-2"
      {...props}
    >
      {children}
    </h4>
  ),
  h4: ({ children, ...props }) => (
    <h5
      className="mb-2 mt-4 text-sm font-semibold text-[var(--md-text-primary,#0f172a)]"
      {...props}
    >
      {children}
    </h5>
  ),
  p: ({ children, ...props }) => (
    <p
      className="mb-4 text-[15px] leading-[1.75] text-[var(--md-text-secondary,#334155)] last:mb-0 [&+p]:mt-0"
      {...props}
    >
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul
      className="mb-4 space-y-2.5 pl-1 text-[15px] leading-[1.75] text-[var(--md-text-secondary,#334155)]"
      style={{ listStyleType: "'• '" }}
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol
      className="mb-4 list-decimal space-y-2.5 pl-6 text-[15px] leading-[1.75] text-[var(--md-text-secondary,#334155)] marker:text-[var(--md-marker,#60a5fa)]"
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
    <strong className="font-semibold text-[var(--md-text-primary,#0f172a)]" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }) => (
    <em className="text-[var(--md-text-secondary,#334155)] italic" {...props}>
      {children}
    </em>
  ),
  code: ({ className, children, ...props }) => {
    const isFenced = Boolean(className?.startsWith("language-"));
    if (isFenced) {
      return (
        <code
          className={`block font-mono text-[13px] leading-relaxed text-[var(--md-code-text,#f1f5f9)] ${className ?? ""}`}
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code
        className="rounded-md bg-[var(--md-code-inline-bg,#f1f5f9)] px-1.5 py-0.5 font-mono text-[0.8125rem] text-[var(--md-code-inline-text,#4338ca)] ring-1 ring-[var(--md-code-inline-border,#cbd5e1)]"
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ children, ...props }) => (
    <pre
      className="mb-4 overflow-x-auto rounded-xl border border-[var(--md-border,#e2e8f0)] bg-[var(--md-code-bg,#1e293b)] p-4 shadow-inner"
      {...props}
    >
      {children}
    </pre>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="my-4 rounded-xl border border-[var(--md-quote-border,#ede9fe)] bg-linear-to-br from-[var(--md-quote-from,#f5f3ff)] via-[var(--md-bg,#ffffff)] to-[var(--md-quote-to,#f8fafc)] px-4 py-3.5 text-[15px] leading-relaxed text-[var(--md-text-secondary,#334155)] shadow-[var(--app-shadow-sm)]"
      {...props}
    >
      {children}
    </blockquote>
  ),
  a: ({ href, children, ...props }) => (
    <a
      href={href}
      className="font-medium text-[var(--md-link,#2563eb)] underline decoration-[var(--md-link-underline,#bfdbfe)] underline-offset-[3px] transition-colors hover:text-[var(--md-link-hover,#1d4ed8)]"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  ),
  hr: () => (
    <hr className="my-8 border-0 border-t border-[var(--md-border,#e2e8f0)]" />
  ),
  table: ({ children, ...props }) => (
    <div className="mb-4 w-full overflow-x-auto rounded-xl border border-[var(--md-border,#e2e8f0)] bg-[var(--md-bg,#ffffff)] shadow-[var(--app-shadow-sm)]">
      <table className="w-full min-w-[min(100%,20rem)] border-collapse text-[14px]" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="bg-[var(--md-surface,#f8fafc)]" {...props}>
      {children}
    </thead>
  ),
  th: ({ children, ...props }) => (
    <th
      className="border-b border-[var(--md-border,#e2e8f0)] px-3 py-2.5 text-left text-sm font-semibold text-[var(--md-text-primary,#0f172a)]"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="border-b border-[var(--md-border-subtle,#f1f5f9)] px-3 py-2.5 text-[var(--md-text-secondary,#334155)]" {...props}>
      {children}
    </td>
  ),
};

export function AiReasoningContent({ text }: { text: string }) {
  const trimmed = text.trim();

  if (!trimmed) {
    return (
      <p className="text-sm text-[var(--md-text-muted,#64748b)]">
        暂无推理内容
      </p>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--app-ai-border,#93c5fd)] bg-[var(--app-ai-bg,#f0f6ff)] p-5 shadow-[var(--app-shadow)] ring-1 ring-[var(--app-ai-border,#93c5fd)]">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
        {trimmed}
      </ReactMarkdown>
    </div>
  );
}
