import * as Dialog from "@radix-ui/react-dialog";
import { Trash2, X } from "lucide-react";

export type DeleteResumeConfirmModalProps = {
  open: boolean;
  candidateName: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function DeleteResumeConfirmModal({
  open,
  candidateName,
  onOpenChange,
  onConfirm,
}: DeleteResumeConfirmModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-zinc-950/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[60] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-[0_25px_50px_-12px_rgba(15,23,42,0.25)] focus:outline-none">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 ring-1 ring-rose-100">
                <Trash2 className="h-5 w-5" strokeWidth={2} aria-hidden />
              </div>
              <div className="min-w-0">
                <Dialog.Title className="text-base font-semibold text-zinc-900">
                  删除简历
                </Dialog.Title>
                <Dialog.Description className="mt-2 text-sm leading-relaxed text-zinc-600">
                  确定删除「{candidateName}」的简历吗？此操作不可恢复。
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close
              type="button"
              className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              aria-label="关闭"
            >
              <X className="h-5 w-5" aria-hidden />
            </Dialog.Close>
          </div>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
            <Dialog.Close
              type="button"
              className="rounded-xl border border-zinc-200/90 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300"
            >
              取消
            </Dialog.Close>
            <button
              type="button"
              onClick={onConfirm}
              className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-rose-600/20 transition-colors hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
            >
              删除
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
