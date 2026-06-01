"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string): { matches: boolean; ready: boolean } {
  const [matches, setMatches] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setMatches(media.matches);

    onChange();
    setReady(true);

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [query]);

  return { matches, ready };
}
