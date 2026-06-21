import { Zap, FileText, AlertTriangle, Lightbulb } from "lucide-react";
import type { ReactNode } from "react";

export type CalloutVariant = "summary" | "note" | "warning" | "tip";

const variants = {
  summary: {
    Icon: Zap,
    defaultTitle: "Quick summary",
    border: "border-green-500/40",
    bg: "bg-green-500/5",
    accent: "text-green-500",
  },
  note: {
    Icon: FileText,
    defaultTitle: "Note",
    border: "border-green-500/40",
    bg: "bg-green-500/5",
    accent: "text-green-500",
  },
  warning: {
    Icon: AlertTriangle,
    defaultTitle: "Warning",
    border: "border-amber-500/50",
    bg: "bg-amber-500/5",
    accent: "text-amber-500",
  },
  tip: {
    Icon: Lightbulb,
    defaultTitle: "Tip",
    border: "border-green-500/40",
    bg: "bg-green-500/5",
    accent: "text-green-500",
  },
} as const;

type CalloutProps = {
  type?: CalloutVariant;
  title?: string;
  children: ReactNode;
};

export default function Callout({ type = "note", title, children }: CalloutProps) {
  const { Icon, defaultTitle, border, bg, accent } = variants[type];

  return (
    <div className={`my-8 rounded-lg border ${border} ${bg} p-4 sm:p-5`}>
      <div className={`flex items-center gap-2 mb-2 ${accent}`}>
        <Icon className="w-4 h-4 shrink-0" />
        <span className="text-sm font-semibold">{title ?? defaultTitle}</span>
      </div>
      <div className="text-[13.5px] leading-relaxed text-zinc-700 dark:text-zinc-300 [&>p]:my-0 [&>p+p]:mt-3">
        {children}
      </div>
    </div>
  );
}

export function Note({ title, children }: Omit<CalloutProps, "type">) {
  return <Callout type="note" title={title}>{children}</Callout>;
}

export function Warning({ title, children }: Omit<CalloutProps, "type">) {
  return <Callout type="warning" title={title}>{children}</Callout>;
}

export function Tip({ title, children }: Omit<CalloutProps, "type">) {
  return <Callout type="tip" title={title}>{children}</Callout>;
}

export function Summary({ title, children }: Omit<CalloutProps, "type">) {
  return <Callout type="summary" title={title}>{children}</Callout>;
}
