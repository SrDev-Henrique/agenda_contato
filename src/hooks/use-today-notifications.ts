"use client";

import { useCallback, useMemo, useState } from "react";

import {
  getActivityReadKey,
  getTodayActivities,
  type TodayActivity,
} from "@/lib/selectors";
import { useAppSelector } from "@/store/hooks";
import { selectAgenda } from "@/store/store-selectors";

const READ_DATE_STORAGE_KEY = "agendly-notifications-read-date";

function getTodayDateKey(now = new Date()) {
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
}

function loadReadKeysForToday(): Set<string> {
  if (typeof window === "undefined") return new Set();

  const todayKey = getTodayDateKey();
  const storedDate = sessionStorage.getItem(READ_DATE_STORAGE_KEY);

  if (storedDate !== todayKey) {
    sessionStorage.setItem(READ_DATE_STORAGE_KEY, todayKey);
    return new Set();
  }

  const raw = sessionStorage.getItem(
    `agendly-notifications-read-keys:${todayKey}`,
  );
  if (!raw) return new Set();

  try {
    const parsed = JSON.parse(raw) as string[];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

function persistReadKeys(readKeys: Set<string>) {
  if (typeof window === "undefined") return;

  const todayKey = getTodayDateKey();
  sessionStorage.setItem(READ_DATE_STORAGE_KEY, todayKey);
  sessionStorage.setItem(
    `agendly-notifications-read-keys:${todayKey}`,
    JSON.stringify([...readKeys]),
  );
}

export function useTodayNotifications(previewActivities?: TodayActivity[]) {
  const agenda = useAppSelector(selectAgenda);
  const [readKeys, setReadKeys] = useState<Set<string>>(() =>
    previewActivities ? new Set() : loadReadKeysForToday(),
  );

  const activities = useMemo(() => {
    if (previewActivities) return previewActivities;
    return getTodayActivities(agenda);
  }, [agenda, previewActivities]);

  const activityKeys = useMemo(
    () => activities.map(getActivityReadKey),
    [activities],
  );

  const pendingCount = useMemo(() => {
    const unread = activityKeys.filter((key) => !readKeys.has(key));
    return Math.max(0, unread.length);
  }, [activityKeys, readKeys]);

  const markRead = useCallback(
    (key: string) => {
      setReadKeys((prev) => {
        if (prev.has(key)) return prev;
        const next = new Set(prev);
        next.add(key);
        if (!previewActivities) persistReadKeys(next);
        return next;
      });
    },
    [previewActivities],
  );

  const markAllRead = useCallback(() => {
    setReadKeys((prev) => {
      const next = new Set(prev);
      for (const key of activityKeys) {
        next.add(key);
      }
      if (!previewActivities) persistReadKeys(next);
      return next;
    });
  }, [activityKeys, previewActivities]);

  const isRead = useCallback((key: string) => readKeys.has(key), [readKeys]);

  return {
    activities,
    pendingCount,
    markRead,
    markAllRead,
    isRead,
  };
}
