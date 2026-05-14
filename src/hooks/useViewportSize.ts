import { useState, useEffect } from 'react';

export type ViewportSize = 'mobile' | 'tablet' | 'desktop';

/**
 * Breakpoints — ใช้เหมือน Tailwind default
 * - mobile: < 640px (sm)
 * - tablet: 640-1023px
 * - desktop: >= 1024px (lg)
 */
const BREAKPOINTS = {
  tablet: 640,
  desktop: 1024,
} as const;

/**
 * Detect ขนาด viewport ปัจจุบัน
 *
 * - คืน 'mobile' | 'tablet' | 'desktop' ตามขนาดหน้าจอ
 * - update อัตโนมัติเมื่อ user resize browser
 *
 * @example
 * const viewport = useViewportSize();
 * if (viewport === 'mobile') { ... }
 */
export function useViewportSize(): ViewportSize {
  // Lazy init — เช็ค width ครั้งแรกตอน mount
  const [viewport, setViewport] = useState<ViewportSize>(() =>
    getViewport(typeof window !== 'undefined' ? window.innerWidth : 1024)
  );

  useEffect(() => {
    function handleResize() {
      setViewport(getViewport(window.innerWidth));
    }

    // Listen ทุกครั้งที่ resize
    window.addEventListener('resize', handleResize);

    // Cleanup เวลา component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return viewport;
}

/**
 * แปลง width (px) → viewport size
 */
function getViewport(width: number): ViewportSize {
  if (width < BREAKPOINTS.tablet) return 'mobile';
  if (width < BREAKPOINTS.desktop) return 'tablet';
  return 'desktop';
}