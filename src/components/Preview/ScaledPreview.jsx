import { useRef, useState, useLayoutEffect } from 'react';

// A CV document is 210mm wide = ~794px at 96dpi. Templates use fixed px/pt/mm
// units and do not reflow, so on-screen they must be uniformly scaled to fit
// their container instead of overflowing.
const CV_WIDTH = 794;
const A4_RATIO = 297 / 210; // fallback height before the real one is measured

/**
 * Scales its children (a full-width CV document) down to fit the available
 * container width, recomputing on container/content resize via ResizeObserver.
 * Never upscales beyond `maxScale` (default 1 = natural size).
 *
 * - Default: reserves the full scaled footprint so surrounding layout stays correct
 *   (used for the live editing/final preview).
 * - `clipHeight` set: renders a fixed-height, top-aligned, clipped window instead
 *   (used for template thumbnails).
 */
export default function ScaledPreview({ children, maxScale = 1, clipHeight = null, style }) {
  const containerRef = useRef(null);
  const innerRef = useRef(null);
  const [scale, setScale] = useState(maxScale);
  const [innerHeight, setInnerHeight] = useState(Math.round(CV_WIDTH * A4_RATIO));
  const clipped = clipHeight != null;

  useLayoutEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    const recompute = () => {
      const available = container.clientWidth;
      if (available > 0) {
        setScale(Math.min(maxScale, available / CV_WIDTH));
      }
      // offsetHeight is the pre-transform (natural) height — exactly what we
      // need to reserve scaled vertical space below.
      setInnerHeight(inner.offsetHeight);
    };

    recompute();

    const roContainer = new ResizeObserver(recompute);
    roContainer.observe(container);
    const roInner = new ResizeObserver(recompute);
    roInner.observe(inner);

    return () => {
      roContainer.disconnect();
      roInner.disconnect();
    };
  }, [maxScale]);

  return (
    <div ref={containerRef} style={{ width: '100%', overflow: 'hidden', ...style }}>
      {/* Spacer: full scaled footprint (centered), or a fixed clipped window. */}
      <div
        style={{
          width: clipped ? '100%' : CV_WIDTH * scale,
          height: clipped ? clipHeight : innerHeight * scale,
          margin: clipped ? 0 : '0 auto',
          position: 'relative',
        }}
      >
        <div
          ref={innerRef}
          style={{
            width: CV_WIDTH,
            position: 'absolute',
            top: 0,
            left: 0,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
