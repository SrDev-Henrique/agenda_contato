"use client";

import { useState } from "react";

export function useShouldAnimateOnKeyChange(key: string): boolean {
  const [staggerGeneration, setStaggerGeneration] = useState(0);
  const [trackedKey, setTrackedKey] = useState(key);

  if (key !== trackedKey) {
    setTrackedKey(key);
    setStaggerGeneration((generation) => generation + 1);
  }

  return staggerGeneration > 0;
}
