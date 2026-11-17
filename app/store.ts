import { configureStore } from "@reduxjs/toolkit";
import spriteAnimationReducer from "./slices/spriteAnimationSlice";

export const store = configureStore({
  reducer: {
    spriteAnimation: spriteAnimationReducer,
  },
});

// TypeScript helper types
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
