"use client";

import { useTheme } from "@teispace/next-themes";
import { Moon, Settings, Sun } from "lucide-react";
import { motion } from "motion/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type ProfileMenuProps = {
  name: string;
  avatarUrl?: string;
  className?: string;
};

export function ProfileMenu({ name, avatarUrl, className }: ProfileMenuProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2",
        className,
      )}
    >
      <Avatar size="lg">
        {avatarUrl ? <AvatarImage src={avatarUrl} alt={name} /> : null}
        <AvatarFallback>{getInitials(name)}</AvatarFallback>
      </Avatar>

      <span className="min-w-0 flex-1 truncate font-medium text-foreground text-sm">
        {name}
      </span>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            aria-label="Abrir configurações"
            title="Configurações"
            variant="muted"
            size="icon"
          >
            <Settings />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-64">
          <PopoverHeader>
            <PopoverTitle>Configurações</PopoverTitle>
            <PopoverDescription>Preferências da interface</PopoverDescription>
          </PopoverHeader>

          <div className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2">
            <span className="font-medium text-foreground text-sm">Tema</span>
            <ThemeSwitcher />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme<"light" | "dark">();
  const isDark = resolvedTheme !== "light";
  const nextTheme = isDark ? "light" : "dark";

  return (
    <button
      type="button"
      aria-label={`Ativar tema ${isDark ? "claro" : "escuro"}`}
      aria-pressed={isDark}
      className="relative h-5 w-10 rounded-full bg-muted text-muted-foreground transition-colors duration-300 hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
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

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return "U";
  }

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}
