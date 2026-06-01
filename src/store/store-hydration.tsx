"use client";

import { useEffect } from "react";

import { loadState } from "@/lib/storage/persistence";
import { hydrate, setHydrated } from "@/store/agenda-slice";
import { useAppDispatch } from "@/store/hooks";

export function StoreHydration() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(hydrate(loadState()));
    dispatch(setHydrated(true));
  }, [dispatch]);

  return null;
}
