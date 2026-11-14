"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface SpriteAnimationProps {
  /** URL of the sprite sheet image */
  src: string;
  /** Number of columns in the sprite sheet */
  cols: number;
  /** Number of rows in the sprite sheet */
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

type Direction = "forward" | "reverse";

export default function SpriteAnimation({
  src,
  cols,
  rows,
  fps = 12,
  autoPlay = true,
  displayWidth,
  displayHeight,
  className = "",
}: SpriteAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const animationRef = useRef<number>(0);
  const frameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [direction, setDirection] = useState<Direction>("forward");

  const totalFrames = cols * rows;
  const frameDuration = 1000 / fps;

  const drawFrame = useCallback(
    (frameIndex: number) => {
      const canvas = canvasRef.current;
      const image = imageRef.current;
      if (!canvas || !image) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const frameWidth = image.naturalWidth / cols;
      const frameHeight = image.naturalHeight / rows;

      // Calculate row and column from linear frame index
      const col = frameIndex % cols;
      const row = Math.floor(frameIndex / cols);

      // Clear and draw the current frame
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
    [cols, rows]
  );

  const animate = useCallback(
    (timestamp: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = timestamp;
      }

      const elapsed = timestamp - lastTimeRef.current;

      if (elapsed >= frameDuration) {
        lastTimeRef.current = timestamp;

        if (direction === "forward") {
          frameRef.current = (frameRef.current + 1) % totalFrames;
        } else {
          frameRef.current =
            (frameRef.current - 1 + totalFrames) % totalFrames;
        }

        drawFrame(frameRef.current);
      }

      animationRef.current = requestAnimationFrame(animate);
    },
    [direction, totalFrames, frameDuration, drawFrame]
  );

  // Start / stop animation
  useEffect(() => {
    if (isPlaying && isLoaded) {
      lastTimeRef.current = 0;
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, isLoaded, animate]);

  // Load the sprite sheet image
  useEffect(() => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    imageRef.current = image;

    image.onload = () => {
      setIsLoaded(true);
      setIsError(false);

      const canvas = canvasRef.current;
      if (canvas) {
        if (displayWidth && displayHeight) {
          canvas.width = displayWidth;
          canvas.height = displayHeight;
        } else {
          canvas.width = image.naturalWidth / cols;
          canvas.height = image.naturalHeight / rows;
        }
        drawFrame(frameRef.current);
      }
    };

    image.onerror = () => {
      setIsLoaded(false);
      setIsError(true);
    };

    image.src = src;
  }, [src, cols, rows, drawFrame, displayWidth, displayHeight]);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const toggleDirection = () => {
    setDirection((prev) => (prev === "forward" ? "reverse" : "forward"));
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
        <p>Failed to load sprite sheet: {src}</p>
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
          className="flex items-center gap-1 rounded-lg bg-gray-800 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-gray-700 active:bg-gray-900"
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
          className="flex items-center gap-1 rounded-lg bg-gray-800 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-gray-700 active:bg-gray-900"
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
