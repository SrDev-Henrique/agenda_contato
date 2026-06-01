"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

export function useSidebarTagsPanel() {
  const searchParams = useSearchParams();
  const tagFromUrl = searchParams.get("tag");
  const [tagsPanelOpen, setTagsPanelOpen] = useState(false);
  const [trackedTag, setTrackedTag] = useState(tagFromUrl);

  if (tagFromUrl !== trackedTag) {
    setTrackedTag(tagFromUrl);
    if (tagFromUrl) {
      setTagsPanelOpen(true);
    }
  }

  const toggleTagsPanel = useCallback(() => {
    setTagsPanelOpen((open) => !open);
  }, []);

  const isTagsNavActive = tagsPanelOpen || !!tagFromUrl;

  return {
    tagsPanelOpen,
    toggleTagsPanel,
    isTagsNavActive,
  };
}
