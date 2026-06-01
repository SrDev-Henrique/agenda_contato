import {
  createListenerMiddleware,
  type TypedStartListening,
} from "@reduxjs/toolkit";

import { saveStateDebounced } from "@/lib/storage/persistence";

import type { AgendaRootState } from "./agenda-slice";

export const persistenceListener = createListenerMiddleware();

type PersistenceListener = TypedStartListening<AgendaRootState>;

const startPersistenceListening =
  persistenceListener.startListening as PersistenceListener;

export function setupPersistenceListener() {
  startPersistenceListening({
    predicate: (_action, currentState) => currentState.meta.isHydrated,
    effect: (_action, listenerApi) => {
      const state = listenerApi.getState();
      saveStateDebounced(state.agenda);
    },
  });
}
