import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          backgroundColor: "#1d3b2c",
          color: "#f6e7c1",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 22, letterSpacing: 8 }}>
          <span
            style={{
              width: 48,
              height: 48,
              border: "2px solid #c79a44",
              borderRadius: 999,
              color: "#c79a44",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontStyle: "italic",
            }}
          >
            R
          </span>
          RICHFIELD GROUP
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 22, color: "#c79a44", letterSpacing: 8 }}>
            ESTABLISHED 1994
          </div>
          <div style={{ fontSize: 80, lineHeight: 1, color: "#fff" }}>
            From market entry to{" "}
            <span style={{ fontStyle: "italic", color: "#c79a44" }}>nationwide distribution</span>.
          </div>
        </div>
        <div style={{ fontSize: 18, color: "#c79a44", letterSpacing: 4 }}>
          VIETNAM · MALAYSIA · CHINA
        </div>
      </div>
    ),
    size,
  );
}
