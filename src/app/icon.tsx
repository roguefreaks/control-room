import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Favicon: signal-orange plate with the operator's mark. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#e05612",
          color: "#fff",
          fontSize: 18,
          fontWeight: 800,
          fontFamily: "monospace",
        }}
      >
        A
      </div>
    ),
    size,
  );
}
