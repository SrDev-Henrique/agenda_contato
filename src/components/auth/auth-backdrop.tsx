import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AuthBackdropProps = {
  children: ReactNode;
  className?: string;
};

export function AuthBackdrop({ children, className }: AuthBackdropProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-full flex-1 items-center justify-center overflow-hidden px-4 py-10",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,oklch(from_var(--accent)_l_c_h/18%),transparent_42%),radial-gradient(circle_at_80%_0%,oklch(from_var(--muted)_l_c_h/40%),transparent_38%)]"
      />
      {children}
    </div>
  );
}
