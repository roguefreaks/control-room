import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon: the same instrument mark with room to breathe. */
export default function AppleIcon() {
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
        <svg width="180" height="180" viewBox="0 0 32 32">
          <path
            d="M3 8.5 V3 H8.5 M23.5 3 H29 V8.5 M29 23.5 V29 H23.5 M8.5 29 H3 V23.5"
            stroke="#5c6158"
            strokeWidth="1.6"
            fill="none"
          />
          <path
            d="M7 23 H13.5 L18.5 10.5 H23.5"
            stroke="#8b887c"
            strokeWidth="1.7"
            fill="none"
          />
          <circle cx="7" cy="23" r="1.9" fill="#131311" stroke="#8b887c" strokeWidth="1.3" />
          <circle cx="24.2" cy="10.5" r="4.6" fill="#ff6a28" opacity="0.25" />
          <circle cx="24.2" cy="10.5" r="2.6" fill="#ff6a28" />
        </svg>
      </div>
    ),
    size,
  );
}
