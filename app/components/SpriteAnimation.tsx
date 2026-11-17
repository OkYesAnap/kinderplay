'use client';

import {
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    selectDirection,
    selectIsError,
    selectIsLoaded,
    selectIsPlaying, setDirection, setIsError,
    setIsLoaded,
    setIsPlaying
} from "@/app/slices/spriteAnimationSlice";

/** Resolved per-sprite-sheet configuration */
interface SheetConfig {
  /** URL of the sprite sheet image */
  url: string;
  /** Number of columns */
  cols: number;
  /** Number of rows */
  rows: number;
  /** Playback order index */
  order: number;
}

interface SpriteAnimationProps {
  /**
   * Array of sprite sheet URLs or per-sheet configs.
   * Sheets are concatenated into one continuous animation played sequentially.
   *
   * - `string[]`  → uses shared `cols` / `rows` for every sheet
   * - `{ url: string; cols?: number; rows?: number; order?: number }[]` → each sheet can override its own `cols` / `rows` and playback order
   */
  src: (string | { url: string; cols?: number; rows?: number; order?: number })[];
  /** Default columns (applied to every sheet unless overridden per-sheet) */
  cols: number;
  /** Default rows (applied to every sheet unless overridden per-sheet) */
  rows: number;
  /** Frames per second for animation speed */
  fps?: number;
  /** Whether to start playing automatically on mount */
  autoPlay?: boolean;
  /** Optional CSS width for the display area */
  displayWidth?: number;
  /** Optional CSS height for the display area */
  displayHeight?: number;
  /** Optional wrapper class */
  className?: string;
}

export default function SpriteAnimation({
  src,
  cols,
  rows,
  fps = 12,
  displayWidth,
  displayHeight,
  className = "",
}: SpriteAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sheetsRef = useRef<SheetConfig[]>([]);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const animationRef = useRef<number>(0);
  const frameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const stoppedRef = useRef(false);

  const dispatch = useDispatch();
  const isPlaying = useSelector(selectIsPlaying);
  const isLoaded = useSelector(selectIsLoaded);
  const isError = useSelector(selectIsError);
  const direction = useSelector(selectDirection);

  // Resolve src prop into sheet configurations (derived via useMemo)
  const sheets = useMemo<SheetConfig[]>(() => {
    const resolved: SheetConfig[] = src.map((item, i) => ({
      url: typeof item === "string" ? item : item.url,
      rows: typeof item === "string" ? rows : item.rows ?? rows,
      cols: typeof item === "string" ? cols : item.cols ?? cols,
      order: typeof item === "string" ? i : (item.order ?? i),
    }));
    resolved.sort((a, b) => a.order - b.order);
    return resolved;
  }, [src, rows, cols]);

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
      const images = imagesRef.current;
      if (sheets.length === 0 || images.length === 0) return;

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
      const image = images[sheetIndex];
      if (!image) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const frameWidth = image.naturalWidth / sheet.cols;
      const frameHeight = image.naturalHeight / sheet.rows;

      const col = remaining % sheet.cols;
      const row = Math.floor(remaining / sheet.cols);

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

  // Load all sprite sheet images concurrently
  useEffect(() => {
    if (sheets.length === 0) return;

    let loadedCount = 0;
    let hasError = false;

    // Pre-create Image objects for every sheet
    const images: HTMLImageElement[] = sheets.map(() => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      return img;
    });

    images.forEach((img, idx) => {
      img.onload = () => {
        loadedCount += 1;
        if (loadedCount === sheets.length && !hasError) {
          imagesRef.current = images;
          dispatch(setIsLoaded(true));

          // Size canvas from the first sheet's frame dimensions
          const canvas = canvasRef.current;
          if (canvas) {
            if (displayWidth && displayHeight) {
              canvas.width = displayWidth;
              canvas.height = displayHeight;
            } else {
              const first = sheets[0];
              canvas.width = images[0].naturalWidth / first.cols;
              canvas.height = images[0].naturalHeight / first.rows;
            }
            drawFrame(frameRef.current);
          }
        }
      };

      img.onerror = () => {
        hasError = true;
        setIsLoaded(false);
        dispatch(setIsError(true));
      };

      img.src = sheets[idx].url;
    });
  }, [sheets, drawFrame, displayWidth, displayHeight, dispatch]);

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
        <p>Failed to load sprite sheet(s): {src.length} source(s)</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border border-gray-300 bg-gray-100 ${className}`}
        style={{
          width: displayWidth,
          height: displayHeight,
          minWidth: displayWidth ? undefined : "200px",
          minHeight: displayHeight ? undefined : "200px",
        }}
      >
        <p className="text-gray-500">Loading...</p>
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
