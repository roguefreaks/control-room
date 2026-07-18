import { ImageResponse } from "next/og";

export const alt = "ACHYUT // CONTROL ROOM — 2 systems in production";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** OG card styled as a console status readout. */
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#131311",
          color: "#ebe7da",
          padding: 64,
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
            letterSpacing: 2,
            color: "#94917f",
          }}
        >
          <span>ACHYUT // CONTROL ROOM</span>
          <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: 14,
                background: "#4cc47f",
              }}
            />
            ALL SYSTEMS LIVE
          </span>
        </div>

        <div
          style={{
            marginTop: 90,
            fontSize: 88,
            fontWeight: 800,
            lineHeight: 1.02,
            letterSpacing: -3,
            color: "#ebe7da",
          }}
        >
          ACHYUT ANAND PANDEY
        </div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 40, color: "#ff6a28" }}>
          2 systems in production · 100+ orders/day
        </div>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            justifyContent: "space-between",
            borderTop: "2px solid #2c2c26",
            paddingTop: 28,
            fontSize: 26,
            color: "#94917f",
          }}
        >
          <span>FULL-STACK DEVELOPER · NEXT.JS / TYPESCRIPT / SUPABASE</span>
          <span>HYDERABAD · AVAILABLE NOW</span>
        </div>
      </div>
    ),
    size,
  );
}
