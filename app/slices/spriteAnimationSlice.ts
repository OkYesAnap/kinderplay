import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Direction = "forward" | "reverse";

interface SpriteAnimationState {
  isPlaying: boolean;
  isLoaded: boolean;
  frameCount: number;
  isError: boolean;
  isStopped: boolean;
  direction: Direction;
}

const initialState: SpriteAnimationState = {
  isPlaying: false,
  isLoaded: false,
  frameCount: 0,
  isError: false,
  isStopped: false,
  direction: "forward",
};

const spriteAnimationSlice = createSlice({
  name: "spriteAnimation",
  initialState,
  reducers: {
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setIsLoaded: (state, action: PayloadAction<boolean>) => {
      state.isLoaded = action.payload;
    },
    setFrameCount: (state, action: PayloadAction<number>) => {
      state.frameCount = action.payload;
    },
    setIsError: (state, action: PayloadAction<boolean>) => {
      state.isError = action.payload;
    },
    setIsStopped: (state, action: PayloadAction<boolean>) => {
      state.isStopped = action.payload;
    },
    setDirection: (state, action: PayloadAction<Direction>) => {
      state.direction = action.payload;
    },
    togglePlaying: (state, _action) => {
      // If stopped, restart from beginning
      if (state.isStopped) {
        state.frameCount = 0;
        state.isStopped = false;
        state.isPlaying = true;
      } else {
        state.isPlaying = !state.isPlaying;
      }
    },
    toggleDirection: (state) => {
      state.direction = state.direction === "forward" ? "reverse" : "forward";
    },
    reset: () => initialState,
  },
});

export const {
  setIsPlaying,
  setIsLoaded,
  setFrameCount,
  setIsError,
  setIsStopped,
  setDirection,
  togglePlaying,
  toggleDirection,
  reset,
} = spriteAnimationSlice.actions;

export default spriteAnimationSlice.reducer;
