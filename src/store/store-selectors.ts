import { createSelector } from "@reduxjs/toolkit";

import {
  getTagsWithCounts,
  getUntaggedCount,
} from "@/lib/selectors";

import type { RootState } from "./index";

export const selectAgenda = (state: RootState) => state.agenda;
export const selectIsHydrated = (state: RootState) => state.meta.isHydrated;
export const selectAddingEvent = (state: RootState) => state.meta.addingEvent;
export const selectAddingReminder = (state: RootState) =>
  state.meta.addingReminder;

export const selectTagsWithCounts = createSelector([selectAgenda], (agenda) =>
  getTagsWithCounts(agenda),
);

export const selectUntaggedCount = createSelector([selectAgenda], (agenda) =>
  getUntaggedCount(agenda),
);
