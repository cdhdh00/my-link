import { ImageResponse } from "next/og"

export const runtime = "edge"

export const alt = "마이링크 (MyLink) - 모든 소셜과 포트폴리오를 단 하나의 링크로"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0F172A",
          background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #311042 100%)",
          fontFamily: "sans-serif",
          padding: "60px 80px",
          position: "relative",
        }}
      >
        {/* 장식용 글로우 */}
        <div
          style={{
            position: "absolute",
            top: "-150px",
            left: "-150px",
            width: "500px",
            height: "500px",
            borderRadius: "500px",
            background: "rgba(79, 70, 229, 0.15)",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-150px",
            right: "-150px",
            width: "500px",
            height: "500px",
            borderRadius: "500px",
            background: "rgba(147, 51, 234, 0.15)",
            filter: "blur(80px)",
          }}
        />

        {/* 로고 영역 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "72px",
              height: "72px",
              borderRadius: "24px",
              backgroundColor: "#FFFFFF",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
            }}
          >
            <span
              style={{
                fontSize: "36px",
                fontWeight: "900",
                color: "#4F46E5",
              }}
            >
              M
            </span>
          </div>
          <span
            style={{
              fontSize: "36px",
              fontWeight: "900",
              color: "#FFFFFF",
              letterSpacing: "-1px",
            }}
          >
            MyLink
          </span>
        </div>

        {/* 메인 헤드라인 */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: "900",
            color: "#FFFFFF",
            textAlign: "center",
            lineHeight: "1.2",
            marginBottom: "24px",
            letterSpacing: "-2px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>모든 소셜과 포트폴리오를</span>
          <span
            style={{
              background: "linear-gradient(to right, #818CF8, #C084FC)",
              backgroundClip: "text",
              color: "transparent",
              marginTop: "8px",
            }}
          >
            단 하나의 링크로 연결하세요
          </span>
        </div>

        {/* 안내 문구 */}
        <p
          style={{
            fontSize: "24px",
            fontWeight: "500",
            color: "#94A3B8",
            textAlign: "center",
            margin: "0",
          }}
        >
          흩어져 있는 SNS와 포트폴리오를 모아 나만의 아름다운 맞춤 보드를 디자인하세요.
        </p>

        {/* 뱃지 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginTop: "40px",
            background: "rgba(255, 255, 255, 0.05)",
            padding: "8px 20px",
            borderRadius: "30px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <span style={{ fontSize: "16px", color: "#818CF8", fontWeight: "700" }}>
            ✨ 100% 무료 소셜 링크 보드
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
