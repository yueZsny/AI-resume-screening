import { Plus, Shield, Zap, Mail, Bot } from "lucide-react";

interface FeatureItem {
  icon: typeof Shield;
  text: string;
}

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  features?: FeatureItem[];
  icon?: "mail" | "bot" | "user";
}

export function EmptyState({ 
  title, 
  description, 
  actionLabel, 
  onAction,
  features,
  icon = "mail"
}: EmptyStateProps) {
  const IconComponent = icon === "bot" ? Bot : icon === "user" ? Bot : Mail;

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-dashed border-zinc-200 bg-linear-to-b from-zinc-50/50 via-white to-white py-16">
      {/* Decorative elements */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-linear-to-br from-violet-100 to-purple-100 opacity-60 blur-2xl" />
      <div className="absolute -left-6 -bottom-6 h-24 w-24 rounded-full bg-linear-to-br from-sky-100 to-blue-100 opacity-60 blur-2xl" />
      
      <div className="relative flex flex-col items-center px-4">
        {/* Icon container */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-violet-100 to-purple-100 blur-xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-sky-500 to-blue-600 shadow-xl shadow-sky-500/30">
            <IconComponent className="h-10 w-10 text-white" />
          </div>
          {/* Floating badge */}
          <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg">
            <Plus className="h-4 w-4 text-sky-600" />
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-zinc-800">{title}</h3>
        <p className="mt-2 max-w-sm text-center text-sm text-zinc-500">
          {description}
        </p>
        
        <button
          onClick={onAction}
          className="mt-8 group inline-flex items-center gap-2.5 rounded-2xl bg-linear-to-r from-sky-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-sky-500/30 transition-all hover:shadow-2xl hover:shadow-sky-500/40 hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
          {actionLabel}
        </button>
        
        {/* Feature hints */}
        {features && features.length > 0 && (
          <div className="mt-10 grid grid-cols-3 gap-4">
            {features.map(({ icon: FeatureIcon, text }) => (
              <div key={text} className="flex flex-col items-center gap-1.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100">
                  <FeatureIcon className="h-5 w-5 text-zinc-500" />
                </div>
                <span className="text-xs text-zinc-500">{text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
