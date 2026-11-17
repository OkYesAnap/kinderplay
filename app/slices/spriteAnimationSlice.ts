import type { AppState } from "../store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Direction = "forward" | "reverse";

interface AnimationParams {begin: { src: string, direction: Direction }, end: { src: string, direction: Direction } };
interface SpriteAnimationState {
  isPlaying: boolean;
  isLoaded: boolean;
  frameCount: number;
  isError: boolean;
  direction: Direction;
  animationParams: AnimationParams
}

const initialState: SpriteAnimationState = {
  isPlaying: false,
  isLoaded: false,
  frameCount: 0,
  isError: false,
  direction: "forward",
  animationParams: {begin: {src:'/animations/sprite_open_box_8x6.webp', direction: "forward"}, end: {src:'', direction: 'forward'}},
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
      console.log("setFrameCount", action.payload);
      state.frameCount += action.payload;
    },
    setIsError: (state, action: PayloadAction<boolean>) => {
      state.isError = action.payload;
    },
    setDirection: (state, action: PayloadAction<Direction>) => {
      state.direction = action.payload;
    },
    togglePlaying: (state) => {
      // If stopped, restart from beginning
        state.isPlaying = !state.isPlaying;
    },
    toggleDirection: (state) => {
      state.direction = state.direction === "forward" ? "reverse" : "forward";
    },
    setAnimationParams: (state, action: PayloadAction<AnimationParams>) => {
      state.animationParams = {...action.payload};
    },
    reset: () => initialState,
  },
});

export const {
  setIsPlaying,
  setIsLoaded,
  setFrameCount,
  setIsError,
  setDirection,
  togglePlaying,
  toggleDirection,
  setAnimationParams,
  reset,
} = spriteAnimationSlice.actions;

export const selectIsPlaying = (state: AppState) => state.spriteAnimation.isPlaying;
export const selectIsLoaded = (state: AppState) => state.spriteAnimation.isLoaded;
export const selectFrameCount = (state: AppState) => state.spriteAnimation.frameCount;
export const selectIsError = (state: AppState) => state.spriteAnimation.isError;
export const selectDirection = (state: AppState) => state.spriteAnimation.direction;
export const selectAnimationParams = (state: AppState) => state.spriteAnimation.animationParams;

export default spriteAnimationSlice.reducer;
