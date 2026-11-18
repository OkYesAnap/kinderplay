'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Configuration for a single sprite animation in the sequence.
 */
interface AnimationConfig {
  /** Path to the sprite sheet image */
  src: string;
  /** Number of columns in the sprite sheet */
  cols: number;
  /** Number of rows in the sprite sheet */
  rows: number;
  /** Frames per second (defaults to 12) */
  fps?: number;
}

/**
 * Props for the MultiSpriteAnimation component.
 */
interface MultiSpriteAnimationProps {
  /** Array of animation configurations to play sequentially */
  animations: AnimationConfig[];
  /** Display width of the canvas */
  displayWidth?: number;
  /** Display height of the canvas */
  displayHeight?: number;
  /** Additional CSS classes */
  className?: string;
  /** Whether to start playing automatically when loaded */
  autoPlay?: boolean;
  /** Whether to loop back to the first animation after the last one completes */
  loop?: boolean;
  /** Callback fired when the current animation index changes */
  onAnimationChange?: (index: number) => void;
  /** Callback fired when the entire sequence completes (when loop is false) */
  onComplete?: () => void;
}

/**
 * MultiSpriteAnimation plays a sequence of sprite animations one after another
 * using local state management to avoid polluting global Redux state.
 *
 * Each animation in the sequence has its own sprite sheet and can have different
 * dimensions and frame rates. Images are preloaded before playback begins to
 * ensure smooth transitions between animations.
 */
export default function MultiSpriteAnimation({
  animations,
  displayWidth,
  displayHeight,
  className = '',
  autoPlay = false,
  loop = false,
  onAnimationChange,
  onComplete,
}: MultiSpriteAnimationProps) {
  // Canvas and animation refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const animationRef = useRef<number>(0);
  const frameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // Local state for playback management
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentAnimationIndex, setCurrentAnimationIndex] = useState(0);


  // ---------------------------------------------------------------------------
  // Preload images, reset state, and manage loading/error states
  // ---------------------------------------------------------------------------
  /* eslint-disable react-hooks/set-state-in-effect */
  // These state updates are intentional initialization during image preloading
  useEffect(() => {
    setCurrentAnimationIndex(0);
    frameRef.current = 0;
    lastTimeRef.current = 0;
    setIsLoaded(false);
    setIsError(false);
    imagesRef.current = [];

    if (animations.length === 0) {
      setIsLoaded(true);
      return;
    }

    let loadedCount = 0;
    let hasError = false;
    const total = animations.length;

    const onAllLoaded = () => {
      if (hasError) return;
      setIsLoaded(true);
    };

    animations.forEach((config, index) => {
      const img = new Image();
      img.onload = () => {
        imagesRef.current[index] = img;
        loadedCount += 1;
        if (loadedCount === total) {
          onAllLoaded();
        }
      };
      img.onerror = () => {
        hasError = true;
        setIsError(true);
        setIsLoaded(false);
      };
      img.src = config.src;
      imagesRef.current[index] = img;
    });
  }, [animations]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // ---------------------------------------------------------------------------
  // Derived animation configuration
  // ---------------------------------------------------------------------------
  const currentConfig = useMemo<AnimationConfig | null>(() => {
    if (currentAnimationIndex >= animations.length) return null;
    return animations[currentAnimationIndex];
  }, [animations, currentAnimationIndex]);

  const currentFrameCount = useMemo(() => {
    if (!currentConfig) return 0;
    return currentConfig.rows * currentConfig.cols;
  }, [currentConfig]);

  const currentFps = useMemo(() => {
    return currentConfig?.fps ?? 12;
  }, [currentConfig]);

  // ---------------------------------------------------------------------------
  // Frame drawing
  // ---------------------------------------------------------------------------
  const drawFrame = useCallback(
    (frameIndex: number) => {
      const canvas = canvasRef.current;
      if (!canvas || !currentConfig) return;

      const image = imagesRef.current[currentAnimationIndex];
      if (!image) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const cols = currentConfig.cols;
      const rows = currentConfig.rows;
      const frameCount = rows * cols;

      // Normalize frame index to be within bounds
      const safeFrameIndex = ((frameIndex % frameCount) + frameCount) % frameCount;

      const col = safeFrameIndex % cols;
      const row = Math.floor(safeFrameIndex / cols);

      const cellWidth = image.width / cols;
      const cellHeight = image.height / rows;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the current frame scaled to canvas size
      ctx.drawImage(
        image,
        col * cellWidth,
        row * cellHeight,
        cellWidth,
        cellHeight,
        0,
        0,
        canvas.width,
        canvas.height,
      );
    },
    [currentConfig, currentAnimationIndex],
  );

  // ---------------------------------------------------------------------------
  // Animation loop
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!isPlaying || !isLoaded || !currentConfig) return;

    const frameDuration = 1000 / currentFps;

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;

      const elapsed = timestamp - lastTimeRef.current;

      if (elapsed >= frameDuration) {
        frameRef.current += 1;
        lastTimeRef.current = timestamp;

        // Check if current animation is complete
        if (frameRef.current >= currentFrameCount) {
          // Advance to next animation
          const nextIndex = currentAnimationIndex + 1;

          if (nextIndex <= animations.length) {
            setCurrentAnimationIndex(nextIndex);
            frameRef.current = 0;
            lastTimeRef.current = 0;
            onAnimationChange?.(nextIndex);
          } else if (loop) {
            // Loop back to the start
            setCurrentAnimationIndex(0);
            frameRef.current = 0;
            lastTimeRef.current = 0;
            onAnimationChange?.(0);
          } else {
            // Sequence complete — stop playback
            setIsPlaying(false);
            onComplete?.();
            return;
          }
        } else {
          drawFrame(frameRef.current);
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isPlaying,
    isLoaded,
    currentConfig,
    currentFps,
    currentFrameCount,
    currentAnimationIndex,
    animations,
    loop,
    drawFrame,
    onAnimationChange,
    onComplete,
  ]);

  // ---------------------------------------------------------------------------
  // Draw initial frame when animation index changes (while paused)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!isPlaying && isLoaded && currentConfig) {
      drawFrame(frameRef.current);
    }
  }, [currentAnimationIndex, isPlaying, isLoaded, currentConfig, drawFrame]);

  // ---------------------------------------------------------------------------
  // Controls
  // ---------------------------------------------------------------------------
  const togglePlay = useCallback(() => {
    // If we're at the end and not looping, restart from the beginning
    if (currentAnimationIndex >= animations.length - 1 && !loop && frameRef.current >= currentFrameCount) {
      setCurrentAnimationIndex(0);
      frameRef.current = 0;
      lastTimeRef.current = 0;
    }
    setIsPlaying((prev) => !prev);
  }, [currentAnimationIndex, animations.length, loop, currentFrameCount]);

  const goToAnimation = useCallback(
    (index: number) => {
      if (index >= 0 && index < animations.length) {
        setCurrentAnimationIndex(index);
        frameRef.current = 0;
        lastTimeRef.current = 0;
        onAnimationChange?.(index);
        drawFrame(0);
      }
    },
    [animations.length, onAnimationChange, drawFrame],
  );

  // ---------------------------------------------------------------------------
  // Compute effective canvas dimensions
  // ---------------------------------------------------------------------------
  const effectiveWidth = displayWidth ?? 400;
  const effectiveHeight = displayHeight ?? 300;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  if (isError) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border border-red-300 bg-red-50 ${className}`}
        style={{
          width: effectiveWidth,
          height: effectiveHeight,
          minWidth: displayWidth ? undefined : '200px',
          minHeight: displayHeight ? undefined : '200px',
        }}
      >
        <p className="text-red-500">Error loading animations</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border border-gray-300 bg-gray-100 ${className}`}
        style={{
          width: effectiveWidth,
          height: effectiveHeight,
          minWidth: displayWidth ? undefined : '200px',
          minHeight: displayHeight ? undefined : '200px',
        }}
      >
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={effectiveWidth}
        height={effectiveHeight}
        className="rounded-lg"
        style={{
          width: effectiveWidth,
          height: effectiveHeight,
        }}
      />

      {/* Progress dots — one per animation in the sequence */}
      {animations.length > 1 && (
        <div className="flex items-center gap-2">
          {animations.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToAnimation(index)}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === currentAnimationIndex
                  ? 'bg-blue-500'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to animation ${index + 1}`}
              title={`Animation ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Play/Pause control */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={togglePlay}
          className="flex items-center gap-1 rounded-lg bg-gray-800 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-gray-700"
          aria-label={isPlaying ? 'Pause' : 'Play'}
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
      </div>
    </div>
  );
}
