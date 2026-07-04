import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "green" | "amber" | "red" | "blue" | "zinc";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
};

const tones: Record<BadgeTone, string> = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  red: "bg-red-50 text-red-700 ring-red-200",
  blue: "bg-cyan-50 text-cyan-700 ring-cyan-200",
  zinc: "bg-zinc-100 text-zinc-700 ring-zinc-200",
};

export function Badge({ className, tone = "zinc", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
