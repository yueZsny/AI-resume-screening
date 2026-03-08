import { Loader } from "lucide-react";

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader className="w-8 h-8 animate-spin text-slate-600" />
    </div>
  );
}
