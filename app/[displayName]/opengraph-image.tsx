import { ImageResponse } from "next/og"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

export const runtime = "edge"

export const alt = "마이링크 개인 프로필 보드"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

interface UserData {
  displayName: string
  photoURL?: string
  email?: string
}

export default async function Image({ params }: { params: { displayName: string } }) {
  const { displayName } = params
  const decodedName = decodeURIComponent(displayName)
  
  let pageDisplayName = decodedName
  let photoURL = ""
  let linksCount = 0

  try {
    const usersRef = collection(db, "users")
    const q = query(usersRef, where("displayNameLower", "==", decodedName.toLowerCase()))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0]
      const userData = userDoc.data() as UserData
      pageDisplayName = userData.displayName || decodedName
      photoURL = userData.photoURL || ""

      // 등록된 링크 개수 조회
      const linksRef = collection(db, "users", userDoc.id, "links")
      const linksSnapshot = await getDocs(linksRef)
      linksCount = linksSnapshot.size
    }
  } catch (error) {
    console.error("OG 이미지 데이터 조회 실패:", error)
  }

  // 프로필 이니셜 계산 (사진이 없는 경우 대체용)
  const initial = pageDisplayName.charAt(0).toUpperCase()

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
          background: "linear-gradient(135deg, #0F172A 0%, #0F172A 40%, #1E1B4B 80%, #311042 100%)",
          fontFamily: "sans-serif",
          position: "relative",
          padding: "40px",
        }}
      >
        {/* 장식용 글로우 배경 */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "10%",
            width: "300px",
            height: "300px",
            background: "rgba(99, 102, 241, 0.12)",
            filter: "blur(60px)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            right: "10%",
            width: "300px",
            height: "300px",
            background: "rgba(168, 85, 247, 0.12)",
            filter: "blur(60px)",
            borderRadius: "50%",
          }}
        />

        {/* 메인 프로필 인포 카드 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "36px",
            padding: "50px 80px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(12px)",
            width: "800px",
          }}
        >
          {/* 아바타 영역 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "110px",
              height: "110px",
              borderRadius: "40px",
              background: photoURL ? "transparent" : "linear-gradient(135deg, #4F46E5, #9333EA)",
              padding: "2px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
              marginBottom: "24px",
            }}
          >
            {photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoURL}
                alt={pageDisplayName}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "38px",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                  borderRadius: "38px",
                  color: "#FFFFFF",
                  fontSize: "48px",
                  fontWeight: "900",
                }}
              >
                {initial}
              </div>
            )}
          </div>

          {/* 닉네임 뱃지 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(79, 70, 229, 0.15)",
              border: "1px solid rgba(79, 70, 229, 0.3)",
              borderRadius: "20px",
              padding: "6px 16px",
              marginBottom: "16px",
            }}
          >
            <span
              style={{
                fontSize: "16px",
                color: "#A5B4FC",
                fontWeight: "700",
                letterSpacing: "0.5px",
              }}
            >
              mylink.to/{decodedName}
            </span>
          </div>

          {/* 타이틀 및 상세 설명 */}
          <span
            style={{
              fontSize: "42px",
              fontWeight: "900",
              color: "#FFFFFF",
              marginBottom: "12px",
              textAlign: "center",
              letterSpacing: "-1px",
            }}
          >
            {pageDisplayName}님의 마이링크
          </span>

          <span
            style={{
              fontSize: "20px",
              fontWeight: "500",
              color: "#94A3B8",
              marginBottom: "32px",
              textAlign: "center",
            }}
          >
            소셜 링크 보드를 방문하여 다양한 링크와 포트폴리오를 확인해보세요.
          </span>

          {/* 하단 통계/상태 표시 바 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              paddingTop: "24px",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "16px", color: "#94A3B8" }}>등록된 링크 :</span>
              <span style={{ fontSize: "18px", color: "#818CF8", fontWeight: "700" }}>
                {linksCount}개
              </span>
            </div>
            <div
              style={{ width: "4px", height: "4px", backgroundColor: "#475569", borderRadius: "50%" }}
            />
            <span style={{ fontSize: "14px", color: "#64748B", fontWeight: "600" }}>
              ⚡️ Powered by MyLink
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
