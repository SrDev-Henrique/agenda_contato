"use client";

import type { Transition, Variants } from "motion/react";
import { useReducedMotion } from "motion/react";

export function useAppMotion() {
  const reduceMotion = useReducedMotion() ?? false;

  const instant: Transition = { duration: 0 };

  const spring: Transition = reduceMotion
    ? instant
    : { type: "spring", stiffness: 420, damping: 32 };

  const fabSpring: Transition = reduceMotion
    ? instant
    : { type: "spring", stiffness: 380, damping: 28 };

  const tween: Transition = reduceMotion
    ? instant
    : { duration: 0.22, ease: "easeOut" };

  const pageVariants: Variants = {
    initial: {
      opacity: reduceMotion ? 1 : 0,
      x: reduceMotion ? 0 : 16,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: tween,
    },
    exit: {
      opacity: reduceMotion ? 1 : 0,
      x: reduceMotion ? 0 : -12,
      transition: tween,
    },
  };

  const staggerContainer: Variants = {
    initial: {},
    animate: {
      transition: reduceMotion
        ? {}
        : {
            staggerChildren: 0.045,
            delayChildren: 0.02,
          },
    },
  };

  const staggerItem: Variants = {
    initial: {
      opacity: reduceMotion ? 1 : 0,
      y: reduceMotion ? 0 : 8,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: tween,
    },
    exit: {
      opacity: reduceMotion ? 1 : 0,
      y: reduceMotion ? 0 : -4,
      transition: { duration: reduceMotion ? 0 : 0.12 },
    },
  };

  const sheetContentVariants: Variants = {
    initial: {
      opacity: reduceMotion ? 1 : 0,
      x: reduceMotion ? 0 : 24,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: spring,
    },
  };

  const sidebarNavStaggerContainer: Variants = {
    initial: {},
    animate: {
      transition: reduceMotion
        ? {}
        : {
            staggerChildren: 0.05,
            delayChildren: 0.04,
          },
    },
  };

  const sidebarNavStaggerItem: Variants = {
    initial: {
      opacity: reduceMotion ? 1 : 0,
      x: reduceMotion ? 0 : -10,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: tween,
    },
  };

  const sidebarTagsPanelVariants: Variants = {
    initial: {
      opacity: reduceMotion ? 1 : 0,
      height: reduceMotion ? "auto" : 0,
    },
    animate: {
      opacity: 1,
      height: "auto",
      transition: { ...tween, duration: reduceMotion ? 0 : 0.24 },
    },
    exit: {
      opacity: reduceMotion ? 1 : 0,
      height: reduceMotion ? "auto" : 0,
      transition: { duration: reduceMotion ? 0 : 0.18, ease: "easeOut" },
    },
  };

  const sidebarChromeStaggerContainer: Variants = {
    initial: {},
    animate: {
      transition: reduceMotion
        ? {}
        : {
            staggerChildren: 0.06,
            delayChildren: 0.03,
          },
    },
  };

  const sidebarFooterStaggerContainer: Variants = {
    initial: {},
    animate: {
      transition: reduceMotion
        ? {}
        : {
            staggerChildren: 0.06,
            delayChildren: 0.28,
          },
    },
  };

  const sidebarChromeStaggerItem: Variants = {
    initial: {
      opacity: reduceMotion ? 1 : 0,
      x: reduceMotion ? 0 : -12,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: tween,
    },
  };

  return {
    reduceMotion,
    spring,
    fabSpring,
    tween,
    pageVariants,
    staggerContainer,
    staggerItem,
    sheetContentVariants,
    sidebarNavStaggerContainer,
    sidebarNavStaggerItem,
    sidebarTagsPanelVariants,
    sidebarChromeStaggerContainer,
    sidebarFooterStaggerContainer,
    sidebarChromeStaggerItem,
  };
}
