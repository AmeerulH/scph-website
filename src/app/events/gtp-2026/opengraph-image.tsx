import { ImageResponse } from "next/og";

export const alt = "Global Tipping Points Conference 2026";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function GtpOpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(145deg, #093a48 0%, #0D4D5E 40%, #009CB4 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 48,
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: "0.08em",
            color: "#86BC25",
            textTransform: "uppercase",
          }}
        >
          12–15 October 2026 · Kuala Lumpur
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            textAlign: "center",
            lineHeight: 1.15,
            maxWidth: 1000,
            marginTop: 20,
          }}
        >
          Global Tipping Points Conference 2026
        </div>
        <div
          style={{
            fontSize: 26,
            marginTop: 24,
            color: "rgba(255,255,255,0.88)",
            textAlign: "center",
          }}
        >
          Hosted by Sunway Centre for Planetary Health
        </div>
      </div>
    ),
    { ...size },
  );
}
