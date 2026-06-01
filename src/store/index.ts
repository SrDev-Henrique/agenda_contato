import { configureStore } from "@reduxjs/toolkit";

import { agendaReducer } from "./agenda-slice";
import { persistenceListener, setupPersistenceListener } from "./persistence";

setupPersistenceListener();

export function makeStore() {
  return configureStore({
    reducer: agendaReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(persistenceListener.middleware),
  });
}

export const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
