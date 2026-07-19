import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * Favicon: instrument plate with crosshair corner ticks and a signal trace
 * ending in a lit node. The console, reduced to 32 pixels.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#131311",
        }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32">
          {/* crosshair corner ticks */}
          <path
            d="M2 8 V2 H8 M24 2 H30 V8 M30 24 V30 H24 M8 30 H2 V24"
            stroke="#5c6158"
            strokeWidth="2.4"
            fill="none"
          />
          {/* signal trace stepping through the pipeline */}
          <path
            d="M6 24 H13 L19 10 H24"
            stroke="#8b887c"
            strokeWidth="2.4"
            fill="none"
          />
          <circle cx="6" cy="24" r="2.6" fill="#131311" stroke="#8b887c" strokeWidth="1.8" />
          {/* lit terminal node with faked glow */}
          <circle cx="25" cy="10" r="6.5" fill="#ff6a28" opacity="0.28" />
          <circle cx="25" cy="10" r="3.6" fill="#ff6a28" />
        </svg>
      </div>
    ),
    size,
  );
}
