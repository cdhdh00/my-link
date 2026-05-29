import { notFound } from "next/navigation"
import { collection, query, where, getDocs, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Link as LinkData } from "@/data/links"
import { GlobalHeader } from "@/components/global-header"
import { LinkCard } from "@/components/link-card"
import { OwnerActionsClient } from "@/components/owner-actions-client"

// Next.js App Router 빌드 시 동적 데이터 쿼리를 강제하여 런타임에 최신 상태를 실시간 검색하도록 설정
export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{
    displayName: string
  }>
}

interface UserData {
  displayName: string
  photoURL?: string
  email?: string
}

// 1. SEO 메타데이터 생성
export async function generateMetadata({ params }: PageProps) {
  const { displayName } = await params
  const decodedName = decodeURIComponent(displayName)

  try {
    const usersRef = collection(db, "users")
    const q = query(usersRef, where("displayNameLower", "==", decodedName.toLowerCase()))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return {
        title: "페이지를 찾을 수 없습니다 - 마이링크",
      }
    }

    const userData = querySnapshot.docs[0].data() as UserData
    const realName = userData.displayName || decodedName

    return {
      title: `${realName} 마이링크 - 링크 보드`,
      description: `${realName}님의 멋진 맞춤 소셜 링크와 포트폴리오를 확인해 보세요.`,
      openGraph: {
        title: `${realName} 마이링크 - 링크 보드`,
        description: `${realName}님의 멋진 맞춤 소셜 링크와 포트폴리오를 확인해 보세요.`,
        type: "profile",
      },
    }
  } catch (error) {
    console.error("메타데이터 생성 중 오류:", error)
    return {
      title: "마이링크",
    }
  }
}

// 2. 동적 라우트 공개 보드 컴포넌트
export default async function UserPage({ params }: PageProps) {
  const { displayName } = await params
  const decodedName = decodeURIComponent(displayName)

  let uid = ""
  let userData: UserData | null = null
  const links: LinkData[] = []

  try {
    // 1단계: 유저 이름 매칭 검색 (대소문자 무시)
    const usersRef = collection(db, "users")
    const userQuery = query(usersRef, where("displayNameLower", "==", decodedName.toLowerCase()))
    const userSnapshot = await getDocs(userQuery)

    if (userSnapshot.empty) {
      notFound()
    }

    const userDoc = userSnapshot.docs[0]
    uid = userDoc.id
    userData = userDoc.data() as UserData

    // 2단계: 해당 유저의 링크 목록 조회
    const linksRef = collection(db, "users", uid, "links")
    const linksQuery = query(linksRef, orderBy("createdAt", "desc"))
    const linksSnapshot = await getDocs(linksQuery)

    linksSnapshot.forEach((doc) => {
      const data = doc.data()
      links.push({
        id: doc.id,
        title: data.title || "",
        url: data.url || "",
        icon: data.icon || "",
        clicks: data.clicks || 0,
      })
    })
  } catch (error) {
    console.error("사용자 보드 로드 중 데이터베이스 오류:", error)
    // Firestore 권한 등으로 실패할 경우 404를 반환하거나 에러 처리를 지원
    notFound()
  }

  const pageDisplayName = userData.displayName || decodedName

  return (
    <div className="flex min-h-svh flex-col bg-[#F8FAFC] dark:bg-[#0F172A]">
      {/* 상단 글로벌 헤더 */}
      <GlobalHeader />

      <main className="flex flex-1 flex-col items-center p-6">
        <div className="mt-8 flex w-full max-w-[480px] flex-col gap-8 pb-20">
          
          {/* 유저 프로필 카드 */}
          <div className="space-y-3 text-center">
            <div className="relative mx-auto mb-2 inline-block">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-xl ring-1 ring-slate-200/50 dark:bg-slate-800 dark:ring-slate-700/50">
                {userData.photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={userData.photoURL}
                    alt={pageDisplayName}
                    className="h-full w-full rounded-3xl object-cover ring-2 ring-primary/25"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-3xl font-black text-primary">
                    {pageDisplayName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {pageDisplayName}
            </h1>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {pageDisplayName}님의 소셜 링크 컬렉션
            </p>
          </div>

          {/* 링크 카드 목록 (Read-Only) */}
          <div className="flex flex-col gap-4">
            {links.length > 0 ? (
              links.map((link) => (
                <LinkCard key={link.id} link={link} ownerUid={uid} showClicks={false} />
              ))
            ) : (
              <div className="space-y-3 rounded-3xl border-2 border-dashed border-slate-200 bg-white/50 py-16 text-center dark:border-slate-800 dark:bg-slate-900/50">
                <p className="font-medium text-slate-400 dark:text-slate-500">
                  아직 등록된 링크가 없습니다.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 자신이 소유한 보드 페이지일 경우 관리 페이지로 유도하는 보조 조작 버튼 */}
      <OwnerActionsClient ownerUid={uid} />
    </div>
  )
}
