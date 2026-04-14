import type { LucideIcon } from "lucide-react";

export function PlaceholderPage({
  title,
  desc,
  icon: Icon,
}: {
  title: string;
  desc: string;
  icon: LucideIcon;
}) {
  return (
    <div className="flex h-96 flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-white/60 text-center text-muted-foreground">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/80">
        <Icon className="h-7 w-7 text-muted-foreground" strokeWidth={1.75} />
      </div>
      <h3 className="font-display text-lg font-semibold text-foreground">
        {title}
      </h3>
      <p className="mt-1 max-w-md text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
