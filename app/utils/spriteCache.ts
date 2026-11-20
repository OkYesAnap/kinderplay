import pcSpecs from "@/app/data/pcSpecs";

/**
 * Global sprite sheet cache.
 * Pre-loads all animation images from pcSpecs at app startup
 * so components can retrieve them instantly without redundant network requests.
 */

// The actual cache: URL -> HTMLImageElement
const cache = new Map<string, HTMLImageElement>();

// Set of URLs currently being loaded (to prevent duplicate requests)
const loading = new Set<string>();

// Promise that resolves when all initial preload is complete
let preloadPromise: Promise<void> | null = null;

/**
 * Load a single image into the cache.
 * If the image is already cached, returns it immediately.
 * If it's currently being loaded, returns the existing in-flight request.
 */
export function loadOne(src: string): Promise<HTMLImageElement> {
  // Return cached image if available
  if (cache.has(src)) {
    return Promise.resolve(cache.get(src)!);
  }

  // Reuse in-flight request if the same image is already loading
  if (loading.has(src)) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      // Poll until the image finishes loading and enters the cache
      const check = () => {
        if (cache.has(src)) {
          resolve(cache.get(src)!);
        } else if (!loading.has(src)) {
          reject(new Error(`Image failed to load: ${src}`));
        } else {
          setTimeout(check, 50);
        }
      };
      check();
    });
  }

  // Start loading this image
  loading.add(src);

  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      cache.set(src, img);
      loading.delete(src);
      resolve(img);
    };
    img.onerror = () => {
      loading.delete(src);
      reject(new Error(`Failed to load sprite: ${src}`));
    };
    img.src = src;
  });
}

/**
 * Preload ALL unique sprite sheets from pcSpecs.
 * Subsequent calls return the same promise (idempotent).
 */
export function preloadAllSprites(): Promise<void> {
  if (preloadPromise) return preloadPromise;

  // Collect all unique animation paths
  const urls = new Set<string>();
  for (const spec of pcSpecs) {
    if (spec.endAnimationPath) {
      urls.add(spec.endAnimationPath);
    }
  }

  preloadPromise = Promise.allSettled(
    [...urls].map((url) => loadOne(url))
  ).then(() => {
    // Preload completed
  });

  return preloadPromise;
}

/**
 * Retrieve a cached image by URL.
 * Returns undefined if the image hasn't been loaded yet.
 */
export function getSprite(src: string): HTMLImageElement | undefined {
  return cache.get(src);
}

/**
 * Check if a specific sprite URL is already in the cache.
 */
export function isPreloaded(src: string): boolean {
  return cache.has(src);
}

/**
 * Check if the initial preload cycle has completed
 * (even if some individual images failed).
 */
export function isPreloadDone(): boolean {
  return preloadPromise !== null;
}

/**
 * Wait until preload is done or a specific image is available.
 * Useful for components that want to block rendering until sprites are ready.
 */
export function waitForPreload(): Promise<void> {
  return preloadPromise ?? preloadAllSprites();
}

/**
 * Get the total number of cached images.
 */
export function getCacheSize(): number {
  return cache.size;
}
