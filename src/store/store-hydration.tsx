"use client";

import { useEffect } from "react";

import { useSession } from "@/lib/auth-client";
import { isOnboarded } from "@/lib/onboarding/storage";
import { loadState } from "@/lib/storage/persistence";
import { hydrate, setHydrated, setSessionMeta } from "@/store/agenda-slice";
import { useAppDispatch } from "@/store/hooks";

export function StoreHydration() {
  const dispatch = useAppDispatch();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending) {
      dispatch(setHydrated(false));
      return;
    }

    const userId = session?.user?.id ?? null;
    const onboarded = userId ? isOnboarded(userId) : false;

    dispatch(setSessionMeta({ userId, isOnboarded: onboarded }));
    dispatch(hydrate(loadState(userId)));
    dispatch(setHydrated(true));
  }, [dispatch, isPending, session?.user?.id]);

  return null;
}
