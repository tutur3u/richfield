import "@testing-library/jest-dom/vitest";

// jsdom doesn't ship IntersectionObserver, which motion/react needs for
// whileInView. Stub a minimal implementation so reveal-on-scroll components
// render in tests without throwing.
if (typeof globalThis.IntersectionObserver === "undefined") {
  class IntersectionObserverStub {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
    readonly root = null;
    readonly rootMargin = "";
    readonly thresholds: number[] = [];
  }
  // @ts-expect-error — jsdom polyfill, structural match is enough.
  globalThis.IntersectionObserver = IntersectionObserverStub;
}

// jsdom doesn't ship ResizeObserver, which the shelf mosaic uses to measure
// column width. Stub it so the explorer mounts in tests without throwing.
if (typeof globalThis.ResizeObserver === "undefined") {
  class ResizeObserverStub {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  }
  globalThis.ResizeObserver = ResizeObserverStub;
}

// jsdom doesn't implement matchMedia, which reveal-on-scroll and motion/react
// query for prefers-reduced-motion. Stub it (matches: false) so those
// components run their full client path in tests without throwing.
if (typeof window !== "undefined" && typeof window.matchMedia !== "function") {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent() {
        return false;
      },
    }) as MediaQueryList;
}
