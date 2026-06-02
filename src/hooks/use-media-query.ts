"use client";

import { useSyncExternalStore } from "react";

type MediaQuerySnapshot = {
  matches: boolean;
  ready: boolean;
};

function subscribeMediaQuery(query: string, onStoreChange: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function getClientSnapshot(query: string): MediaQuerySnapshot {
  return {
    matches: window.matchMedia(query).matches,
    ready: true,
  };
}

function getServerSnapshot(): MediaQuerySnapshot {
  return { matches: false, ready: false };
}

export function useMediaQuery(query: string): MediaQuerySnapshot {
  return useSyncExternalStore(
    (onStoreChange) => subscribeMediaQuery(query, onStoreChange),
    () => getClientSnapshot(query),
    getServerSnapshot,
  );
}
