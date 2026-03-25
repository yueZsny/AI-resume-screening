import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** 与抽屉内「评估理由」区域配色一致，便于阅读模型返回的 Markdown */
const mdComponents: Components = {
  h1: ({ children, ...props }) => (
    <h3
      className="mt-4 mb-2 text-base font-bold tracking-tight text-zinc-900 first:mt-0"
      {...props}
    >
      {children}
    </h3>
  ),
  h2: ({ children, ...props }) => (
    <h3
      className="mt-4 mb-2 border-b border-blue-100 pb-1 text-sm font-bold text-blue-950 first:mt-0"
      {...props}
    >
      {children}
    </h3>
  ),
  h3: ({ children, ...props }) => (
    <h4 className="mt-3 mb-1.5 text-sm font-semibold text-zinc-900" {...props}>
      {children}
    </h4>
  ),
  h4: ({ children, ...props }) => (
    <h5 className="mt-2 mb-1 text-sm font-semibold text-zinc-800" {...props}>
      {children}
    </h5>
  ),
  p: ({ children, ...props }) => (
    <p className="mb-3 text-sm leading-relaxed text-zinc-700 last:mb-0" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul
      className="mb-3 list-disc space-y-1.5 pl-5 text-sm text-zinc-700"
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol
      className="mb-3 list-decimal space-y-1.5 pl-5 text-sm text-zinc-700"
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-relaxed marker:text-zinc-400" {...props}>
      {children}
    </li>
  ),
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-zinc-900" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }) => (
    <em className="italic text-zinc-800" {...props}>
      {children}
    </em>
  ),
  code: ({ className, children, ...props }) => {
    const isFenced = Boolean(className?.startsWith("language-"));
    if (isFenced) {
      return (
        <code
          className={`block font-mono text-xs leading-relaxed text-zinc-100 ${className ?? ""}`}
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code
        className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[0.8125rem] text-violet-800"
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ children, ...props }) => (
    <pre
      className="mb-3 overflow-x-auto rounded-lg bg-zinc-900 p-3"
      {...props}
    >
      {children}
    </pre>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="mb-3 border-l-4 border-blue-200 bg-blue-50/40 py-2 pl-4 text-sm text-zinc-700"
      {...props}
    >
      {children}
    </blockquote>
  ),
  a: ({ href, children, ...props }) => (
    <a
      href={href}
      className="font-medium text-blue-600 underline-offset-2 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  ),
  hr: () => <hr className="my-4 border-zinc-200" />,
  table: ({ children, ...props }) => (
    <div className="mb-3 overflow-x-auto rounded-lg border border-zinc-200">
      <table className="min-w-full border-collapse text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="bg-zinc-100" {...props}>
      {children}
    </thead>
  ),
  th: ({ children, ...props }) => (
    <th
      className="border-b border-zinc-200 px-3 py-2 text-left font-semibold text-zinc-800"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="border-b border-zinc-100 px-3 py-2 text-zinc-700" {...props}>
      {children}
    </td>
  ),
};

export function AiReasoningContent({ text }: { text: string }) {
  const trimmed = text.trim();

  if (!trimmed) {
    return (
      <p className="text-sm text-zinc-500">
        暂无评估内容。完成 AI 筛选后将在此展示模型结论。
      </p>
    );
  }

  return (
    <div className="ai-reasoning-markdown text-left [&_a]:break-all">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
        {trimmed}
      </ReactMarkdown>
    </div>
  );
}
