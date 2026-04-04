import { ImageResponse } from "next/og";

export const alt = "Sunway Centre for Planetary Health";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #132f5e 0%, #1B4384 45%, #03745B 100%)",
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
            fontSize: 52,
            fontWeight: 700,
            textAlign: "center",
            lineHeight: 1.2,
            maxWidth: 900,
          }}
        >
          Sunway Centre for Planetary Health
        </div>
        <div
          style={{
            fontSize: 28,
            marginTop: 28,
            color: "#50B58B",
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          Planetary health research and advocacy · Malaysia
        </div>
      </div>
    ),
    { ...size },
  );
}
