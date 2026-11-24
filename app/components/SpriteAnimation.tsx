'use client';

import {useCallback, useEffect, useMemo, useRef,} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    Direction,
    selectAnimationParams,
    selectDirection,
    selectIsError,
    selectIsLoaded,
    selectIsPlaying,
    setDirection,
    setIsError,
    setIsLoaded,
    setIsPlaying
} from "@/app/slices/spriteAnimationSlice";

import { getSprite, loadOne, waitForPreload } from "@/app/utils/spriteCache";

interface SheetConfig {
  src: string;
  cols: number;
  rows: number;
  direction: Direction;
  order: number;
}

interface SpriteAnimationProps {
  cols: number;
  rows: number;
  fps?: number;
  autoPlay?: boolean;
  displayWidth?: number;
  displayHeight?: number;
  className?: string;
}

export default function SpriteAnimation({
  cols,
  rows,
  fps = 12,
  displayWidth,
  displayHeight,
  className = "",
}: SpriteAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sheetsRef = useRef<SheetConfig[]>([]);

  const animationRef = useRef<number>(0);
  const frameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const stoppedRef = useRef(false);

  const dispatch = useDispatch();
  const isPlaying = useSelector(selectIsPlaying);
  const isLoaded = useSelector(selectIsLoaded);
  const isError = useSelector(selectIsError);
  const direction = useSelector(selectDirection);
  const animationParams = useSelector(selectAnimationParams);

  // Resolve src prop into sheet configurations (derived via useMemo)
  const sheets = useMemo<SheetConfig[]>(() => {
      return Object.values(animationParams as unknown as SheetConfig[]).reduce((acc: SheetConfig[], item, i: number) => {
        if (item.src) {
            acc.push({
                src: item.src,
                rows: rows,
                cols: cols,
                direction: item.direction,
                order: i,
            })
        }
        return acc;
    }, []);
  }, [animationParams, cols, rows]);

  // Keep a ref mirror for non-render-time access (drawFrame, animation loop)
  useEffect(() => {
    sheetsRef.current = sheets;
  }, [sheets]);

  // Per-sheet frame counts derived from resolved config
  const frameCountsPerSheet = useMemo(
    () => sheets.map((s) => s.rows * s.cols),
    [sheets]
  );

  const totalFrames = useMemo(
    () => frameCountsPerSheet.reduce((sum, n) => sum + n, 0),
    [frameCountsPerSheet]
  );

  const frameDuration = 1000 / fps;

  const drawFrame = useCallback(
    (globalFrame: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const sheets = sheetsRef.current;
      if (sheets.length === 0) return;

      // Map global frame index to (sheetIndex, localFrameIndex)
      let remaining = globalFrame;
      let sheetIndex = 0;
      for (let i = 0; i < sheets.length; i++) {
        const count = sheets[i].rows * sheets[i].cols;
        if (remaining < count) {
          sheetIndex = i;
          break;
        }
        remaining -= count;
        sheetIndex = i; // fallback: last sheet
      }

      const sheet = sheets[sheetIndex];
      const image = getSprite(sheet.src);
      if (!image) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const frameWidth = image.naturalWidth / sheet.cols;
      const frameHeight = image.naturalHeight / sheet.rows;
      let col: number;
      let row: number;
      if(sheet.direction === "forward") {
          col = remaining % sheet.cols;
          row = Math.floor(remaining / sheet.cols);
      } else {
          col = (sheet.cols - 1) - remaining % sheet.cols;
          row = (sheet.rows - 1) - Math.floor(remaining / sheet.cols);
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        image,
        col * frameWidth,
        row * frameHeight,
        frameWidth,
        frameHeight,
        0,
        0,
        canvas.width,
        canvas.height
      );
    },
    []
  );

  // Keep latest animation callback behind a ref to avoid stale closures in rAF
  const animateStepRef = useRef<((timestamp: number) => void) | null>(null);

  // Update the ref whenever dependencies change (avoids ref assignment during render)
  useEffect(() => {
    animateStepRef.current = (timestamp: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = timestamp;
        // Schedule next frame immediately for the first call
        animationRef.current = requestAnimationFrame(animateStepRef.current as FrameRequestCallback);
        return;
      }

      const elapsed = timestamp - lastTimeRef.current;

      if (elapsed >= frameDuration) {
        lastTimeRef.current = timestamp;

        if (direction === "forward" && frameRef.current >= totalFrames - 1) {
            // Reached last frame — mark stopped, don't request next frame
            dispatch(setIsPlaying(false));
            dispatch(setDirection("reverse"));
            stoppedRef.current = true;
            return;
        } else if (direction === "reverse" && frameRef.current <= 0) {
            // Reached first frame — mark stopped, don't request next frame
            dispatch(setIsPlaying(false));
            dispatch(setDirection("forward"));
            stoppedRef.current = true;
            return;
        }
        frameRef.current += direction === "forward" ? 1 : -1;
        drawFrame(frameRef.current);
      }

      animationRef.current = requestAnimationFrame(animateStepRef.current as FrameRequestCallback);
    };
  }, [direction, totalFrames, frameDuration, drawFrame, dispatch]);

  // Start / stop animation + sync stopped state to UI
  useEffect(() => {
    if (isPlaying && isLoaded) {
      stoppedRef.current = false;
      animationRef.current = requestAnimationFrame(animateStepRef.current as FrameRequestCallback);
    } else if (stoppedRef.current) {
      // Animation reached its natural end — update UI state once
      dispatch(setIsPlaying(false));
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dispatch, isLoaded, isPlaying]);

  // Load all sprite sheet images via the global cache
  useEffect(() => {
    if (sheets.length === 0) return;

    const uniqueSources = [...new Set(sheets.map((s) => s.src))];

    Promise.all(uniqueSources.map((src) => loadOne(src))).then(() => {
      return waitForPreload();
    }).then(() => {
      dispatch(setIsLoaded(true));
    }).catch(() => {
      dispatch(setIsLoaded(false));
      dispatch(setIsError(true));
    });
  }, [sheets, dispatch]);

  // Draw the first frame once loading completes and the canvas DOM is ready
  useEffect(() => {
    if (!isLoaded) return;
    drawFrame(0);
    frameRef.current = 0;
  }, [isLoaded, drawFrame]);

  const togglePlay = () => {
      dispatch(setIsPlaying(!isPlaying));
  };

  const toggleDirection = () => {
    dispatch(setDirection(direction === "forward" ? "reverse" : "forward"));
  };

  if (isError) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border border-red-300 bg-red-50 text-red-600 ${className}`}
        style={{
          width: displayWidth,
          height: displayHeight,
          minWidth: displayWidth ? undefined : "200px",
          minHeight: displayHeight ? undefined : "200px",
        }}
      >
        <p>Failed to load sprite sheet(s) source(s)</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg ${className}`}
        style={{
          width: displayWidth,
          height: displayHeight,
          minWidth: displayWidth ? undefined : "200px",
          minHeight: displayHeight ? undefined : "200px",
        }}
      >
        <svg
          className="h-8 w-8 animate-spin text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <canvas
        ref={canvasRef}
        width={displayWidth}
        height={displayHeight}
        className="rounded-lg"
        style={{
          width: displayWidth,
          height: displayHeight,
        }}
      />

      {/* Controls */}
      <div className="flex items-center gap-2">
        {/* Play / Pause button */}
        <button
          onClick={togglePlay}
          className="flex items-center gap-1 rounded-lg bg-gray-800 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-gray-700"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4"
              >
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
              Pause
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14Z" />
              </svg>
              Play
            </>
          )}
        </button>

        {/* Direction toggle button */}
        <button
          onClick={toggleDirection}
          className="flex items-center gap-1 rounded-lg bg-gray-800 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-gray-700"
          aria-label={`Switch to ${direction === "forward" ? "reverse" : "forward"}`}
        >
          {direction === "forward" ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path d="M5.055 5.055A1 1 0 0 1 6 4h12a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0V6H9v10h10a1 1 0 0 1 0 2H9a1 1 0 0 1-.777-.342l-4-4a1 1 0 0 1 0-1.316l4-4A1 1 0 0 1 9 7V6a1 1 0 0 1-1-1z" />
              </svg>
              Reverse
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path d="M18.945 5.055A1 1 0 0 0 18 4H6a1 1 0 0 0-1 1v4a1 1 0 1 0 2 0V6h10v10H8a1 1 0 1 0 0 2h10a1 1 0 0 0 .777-.342l4-4a1 1 0 0 0 0-1.316l-4-4z" />
              </svg>
              Forward
            </>
          )}
        </button>
      </div>
    </div>
  );
}
