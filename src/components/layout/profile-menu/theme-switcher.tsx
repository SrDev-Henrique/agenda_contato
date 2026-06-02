"use client";

import { useTheme } from "@teispace/next-themes";
import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";

export function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme<"light" | "dark">();
  const isDark = resolvedTheme !== "light";
  const nextTheme = isDark ? "light" : "dark";

  return (
    <button
      type="button"
      aria-label={`Ativar tema ${isDark ? "claro" : "escuro"}`}
      aria-pressed={isDark}
      className="relative h-5 w-10 rounded-full bg-muted text-muted-foreground transition-colors duration-300 hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/50"
      onClick={() => setTheme(nextTheme)}
    >
      <motion.span
        className="absolute top-1/2 flex size-4 -translate-y-1/2 items-center justify-center rounded-full bg-background text-foreground shadow-sm ring-1 ring-border"
        initial={false}
        animate={{ x: isDark ? 2 : 22 }}
        transition={{ duration: 0.3, ease: "easeInOut", type: "spring" }}
      >
        {isDark ? (
          <Moon className="size-2.5 stroke-[2.4]" />
        ) : (
          <Sun className="size-2.5 stroke-[2.4]" />
        )}
      </motion.span>
    </button>
  );
}
