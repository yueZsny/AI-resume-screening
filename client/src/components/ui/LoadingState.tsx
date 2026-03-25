import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  iconSize?: number;
}

export function LoadingState({
  message = "加载中...",
  iconSize = 48
}: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        <div
          className="absolute inset-0 animate-ping rounded-full bg-(--app-primary)/20 opacity-75"
          style={{ width: iconSize * 0.8, height: iconSize * 0.8, margin: 'auto' }}
        />
        <Loader2
          className="relative h-12 w-12 animate-spin text-(--app-primary)"
          style={{ width: iconSize, height: iconSize }}
        />
      </div>
      <p className="mt-4 text-sm text-(--app-text-secondary)">{message}</p>
    </div>
  );
}
