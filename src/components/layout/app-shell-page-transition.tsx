"use client";

import { motion } from "motion/react";

import { useAppMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

type AppShellPageTransitionProps = {
  children: React.ReactNode;
  className?: string;
};

export function AppShellPageTransition({
  children,
  className,
}: AppShellPageTransitionProps) {
  const { pageVariants } = useAppMotion();

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={pageVariants}
      className={cn("flex min-h-0 flex-1 flex-col", className)}
    >
      {children}
    </motion.div>
  );
}
