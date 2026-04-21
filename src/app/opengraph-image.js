import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Sunrise Semester — AA Home Group";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(180deg, #1a1a3e 0%, #2d1b4e 12%, #5b2c6f 26%, #c43c68 44%, #ff6b35 62%, #ffa751 78%, #ffd89b 100%)",
        }}
      >
        {/* Radial sun glow */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,215,125,0.7) 0%, rgba(255,107,53,0.3) 40%, transparent 70%)",
          }}
        />

        {/* Sun circle */}
        <div
          style={{
            position: "absolute",
            top: "22%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 180,
            height: 180,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, #fff4d6 0%, #ffd89b 40%, #ffa751 70%, #ff6b35 100%)",
            boxShadow: "0 0 120px rgba(255,180,80,0.8), 0 0 60px rgba(255,215,125,0.6)",
          }}
        />

        {/* Mountain silhouettes */}
        <svg
          viewBox="0 0 1200 260"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "260px",
          }}
        >
          {/* Back mountains */}
          <path
            d="M0,180 L100,120 L200,150 L300,90 L400,130 L500,100 L600,140 L700,95 L800,130 L900,105 L1000,150 L1100,115 L1200,140 L1200,260 L0,260 Z"
            fill="#3a1c3e"
            opacity="0.7"
          />
          {/* Middle mountains */}
          <path
            d="M0,210 L80,155 L180,185 L280,140 L380,175 L480,150 L580,185 L680,155 L780,180 L880,160 L980,190 L1080,165 L1200,185 L1200,260 L0,260 Z"
            fill="#2a1230"
            opacity="0.85"
          />
          {/* Front mountains */}
          <path
            d="M0,260 L60,200 L140,230 L220,195 L300,230 L380,205 L460,240 L540,210 L620,240 L700,220 L780,245 L860,215 L960,245 L1060,225 L1200,245 L1200,260 L0,260 Z"
            fill="#1a0a1f"
          />
        </svg>

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
            padding: "0 80px",
            marginTop: -20,
          }}
        >
          {/* Decorative tag */}
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#ffd89b",
              textShadow: "0 2px 12px rgba(0,0,0,0.5)",
              marginBottom: 16,
            }}
          >
            A New Day Begins
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 96,
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
              textAlign: "center",
              color: "#ffffff",
              textShadow:
                "0 4px 40px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)",
              marginBottom: 20,
            }}
          >
            Sunrise Semester
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 28,
              fontWeight: 400,
              lineHeight: 1.4,
              textAlign: "center",
              color: "rgba(255, 255, 255, 0.95)",
              textShadow: "0 2px 20px rgba(0,0,0,0.4)",
              maxWidth: 700,
            }}
          >
            A home group of Alcoholics Anonymous
          </div>
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            background:
              "linear-gradient(90deg, #ff6b35 0%, #ffa751 30%, #ffd89b 50%, #ffa751 70%, #ff6b35 100%)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
