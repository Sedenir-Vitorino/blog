import { Zap, FileText, AlertTriangle, Lightbulb } from "lucide-react";
import type { ReactNode } from "react";

export type CalloutVariant = "summary" | "note" | "warning" | "tip";

const variants = {
  summary: {
    Icon: Zap,
    defaultTitle: "Quick summary",
    border: "border-l-steel dark:border-l-on-steel-muted",
    accent: "text-ink",
  },
  note: {
    Icon: FileText,
    defaultTitle: "Note",
    border: "border-l-steel dark:border-l-on-steel-muted",
    accent: "text-ink",
  },
  warning: {
    Icon: AlertTriangle,
    defaultTitle: "Warning",
    border: "border-l-accent-strong",
    accent: "text-accent",
  },
  tip: {
    Icon: Lightbulb,
    defaultTitle: "Tip",
    border: "border-l-steel dark:border-l-on-steel-muted",
    accent: "text-ink",
  },
} as const;

type CalloutProps = {
  type?: CalloutVariant;
  title?: string;
  children: ReactNode;
};

export default function Callout({ type = "note", title, children }: CalloutProps) {
  const { Icon, defaultTitle, border, accent } = variants[type];

  return (
    <div className={`my-8 rounded-[2px] border border-line border-l-2 ${border} bg-surface px-5 py-4 sm:px-6 sm:py-5`}>
      <div className={`flex items-center gap-2 mb-2 ${accent}`}>
        <Icon className="w-4 h-4 shrink-0" />
        <span className="font-sans text-[15px] font-semibold">{title ?? defaultTitle}</span>
      </div>
      <div className="text-[0.94em] leading-relaxed text-ink [&>p]:my-0 [&>p+p]:mt-3 [&>ul]:my-2">
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
