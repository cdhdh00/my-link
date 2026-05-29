"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Link } from "../data/links"
import { Card, CardContent } from "@/components/ui/card"
import { LinkAddDialog } from "@/components/link-add-dialog"
import { LinkCard } from "@/components/link-card"
import { RiLoader4Line, RiGoogleFill, RiSparklingLine, RiLinksLine, RiShieldUserLine, RiSmartphoneLine, RiBarChartGroupedLine } from "@remixicon/react"
import { auth, googleProvider } from "@/lib/firebase"
import { signInWithPopup, signOut, User } from "firebase/auth"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { GlobalHeader } from "@/components/global-header"
import { ProfileEditDialog } from "@/components/profile-edit-dialog"
import { useAuthSync, useProfile } from "@/hooks/use-profile"
import { useLinks, useAddLink, useUpdateLink, useDeleteLink } from "@/hooks/use-links"

// Premium UX를 위한 스켈레톤 로더 컴포넌트
const SkeletonLoader = () => (
  <div className="flex w-full flex-col gap-4">
    {[1, 2, 3].map((i) => (
      <Card
        key={i}
        className="animate-pulse overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200/50 dark:bg-slate-900 dark:ring-slate-800/50"
      >
        <CardContent className="flex items-center gap-4 p-5">
          <div className="h-12 w-12 flex-shrink-0 rounded-2xl bg-slate-200/60 dark:bg-slate-800/60" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-1/3 rounded bg-slate-200/70 dark:bg-slate-800/70" />
            <div className="h-3 w-1/2 rounded bg-slate-200/50 dark:bg-slate-800/50" />
          </div>
          <div className="h-5 w-5 flex-shrink-0 rounded-full bg-slate-200/60 dark:bg-slate-800/60" />
        </CardContent>
      </Card>
    ))}
  </div>
)

export default function Page() {
  const router = useRouter()
  // Auth 상태를 React Query 캐시에 동기화 (전역 레이아웃/앱 수준 호출이 더 좋으나 현재 구조상 여기서 호출)
  useAuthSync()

  const { data: user, isLoading: isAuthLoading } = useProfile()
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [linkToDelete, setLinkToDelete] = useState<Link | null>(null)

  // 링크 패칭 및 옵티미스틱 업데이트 훅 연결
  const { data: links = [], isLoading: isLinksLoading } = useLinks(user?.uid)
  const addLinkMutation = useAddLink(user?.uid)
  const updateLinkMutation = useUpdateLink(user?.uid)
  const deleteLinkMutation = useDeleteLink(user?.uid)

  const handleLogin = async () => {
    setIsLoggingIn(true)
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      console.error("구글 로그인 중 오류가 발생했습니다:", error)
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("로그아웃 중 오류가 발생했습니다:", error)
    }
  }

  const handleAddLink = async (newLink: Link) => {
    await addLinkMutation.mutateAsync(newLink)
  }

  const handleUpdateLink = async (id: string, title: string, url: string) => {
    await updateLinkMutation.mutateAsync({ id, title, url })
  }

  const handleDeleteLink = async (id: string) => {
    await deleteLinkMutation.mutateAsync(id)
    setLinkToDelete(null)
  }

  // 초기 인증 정보 관찰 대기 상태인 경우
  if (isAuthLoading) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-[#F8FAFC] dark:bg-[#0F172A]">
        <div className="flex flex-col items-center gap-3">
          <RiLoader4Line size={40} className="animate-spin text-primary" />
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            사용자 정보를 확인하고 있습니다...
          </span>
        </div>
      </div>
    )
  }

  const handleProfileUpdate = () => {
    // TanStack Query로 프로필 업데이트 후 캐시가 자동 갱신되므로
    // 별도의 로컬 state 갱신이 필요하지 않습니다.
  }

  const getPageDisplayName = (currentUser: User | null) => {
    if (!currentUser) return "내"
    if (currentUser.displayName) return currentUser.displayName
    if (currentUser.email) return currentUser.email.split("@")[0]
    return "내"
  }

  const pageDisplayName = getPageDisplayName(user ?? null)

  return (
    <div className="flex min-h-svh flex-col bg-[#F8FAFC] dark:bg-[#0F172A]">
      {/* 글로벌 상단 헤더 */}
      <GlobalHeader />

      <main className="flex flex-1 flex-col items-center p-6">
        {user ? (
          /* 로그인 상태의 대시보드 화면 */
          <div className="mt-8 flex w-full max-w-[480px] flex-col gap-8 pb-20">
            {/* Header Section */}
            <div className="space-y-3 text-center">
              <div className="relative mx-auto mb-2 inline-block">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-xl ring-1 ring-slate-200/50 transition-transform hover:rotate-3 dark:bg-slate-800 dark:ring-slate-700/50">
                  {user.photoURL ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.photoURL}
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
                
                {/* 프로필 수정 버튼 배치 */}
                <div className="absolute -bottom-1 -right-2 z-10 scale-90">
                  <ProfileEditDialog user={user as User} onUpdateComplete={handleProfileUpdate} />
                </div>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {pageDisplayName} 마이링크
              </h1>
              <p className="text-base font-medium text-slate-500 dark:text-slate-400">
                나만의 맞춤 링크 보드를 실시간으로 관리하세요
              </p>
            </div>

            {/* 통계 페이지 바로가기 링크 버튼 */}
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/stats")}
                className="h-9 gap-1.5 rounded-xl border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-600 shadow-sm hover:bg-slate-50 hover:text-primary dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <RiBarChartGroupedLine size={16} className="text-primary" />
                <span>통계 및 클릭수 분석</span>
              </Button>
            </div>

            {/* Action Section */}
            <LinkAddDialog onAdd={handleAddLink} />

            {/* Links List Section */}
            <div className="relative flex min-h-[120px] flex-col gap-4">
              {(addLinkMutation.isPending || updateLinkMutation.isPending) && (
                <div className="absolute inset-0 z-10 flex animate-in flex-col items-center justify-center rounded-3xl bg-[#F8FAFC]/75 backdrop-blur-[2px] transition-all duration-300 fade-in dark:bg-[#0F172A]/75">
                  <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200/50 dark:bg-slate-900 dark:ring-slate-800/50">
                    <RiLoader4Line
                      size={28}
                      className="animate-spin text-primary"
                    />
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                      링크를 저장하고 목록을 갱신 중입니다...
                    </span>
                  </div>
                </div>
              )}

              {isLinksLoading ? (
                <SkeletonLoader />
              ) : links.length > 0 ? (
                links.map((link) => (
                  <LinkCard
                    key={link.id}
                    link={link}
                    ownerUid={user?.uid}
                    onUpdate={handleUpdateLink}
                    onDeleteTrigger={setLinkToDelete}
                  />
                ))
              ) : (
                <div className="space-y-3 rounded-3xl border-2 border-dashed border-slate-200 bg-white/50 py-20 text-center dark:border-slate-800 dark:bg-slate-900/50">
                  <p className="font-medium whitespace-pre-wrap text-slate-400 dark:text-slate-500">
                    등록된 링크가 없습니다.{"\n"}첫 번째 링크를 추가해보세요!
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* 미로그인 상태의 웰컴/안내 화면 (Premium Landing UX) */
          <div className="mx-auto mt-12 flex w-full max-w-[640px] flex-col items-center gap-10 pb-20 text-center">
            {/* 메인 히어로 장식 */}
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-purple-600 opacity-20 blur-xl dark:opacity-35" />
              <div className="relative mb-2 inline-flex h-20 w-20 items-center justify-center rounded-[32px] bg-white shadow-2xl ring-1 ring-slate-200/60 dark:bg-slate-800 dark:ring-slate-700/60">
                <RiLinksLine className="h-10 w-10 text-primary animate-pulse" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1.5 text-xs font-bold text-primary dark:bg-primary/25">
                <RiSparklingLine size={13} className="animate-spin-slow" />
                <span>100% 무료 소셜 링크 링크 보드</span>
              </div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl dark:text-white">
                모든 소셜 및 포트폴리오를
                <br />
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  단 하나의 링크
                </span>
                로 공유하세요
              </h1>
              <p className="mx-auto max-w-[480px] text-base font-semibold leading-relaxed text-slate-500 dark:text-slate-400">
                흩어져 있는 인스타그램, 유튜브, 블로그, 깃허브 포트폴리오를 멋지게 모아 나만의 아름다운 커스텀 보드를 디자인하세요.
              </p>
            </div>

            {/* 주요 혜택 카드 목록 */}
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
              <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200/50 transition-all hover:-translate-y-0.5 dark:bg-slate-900 dark:ring-slate-800/50">
                <CardContent className="flex flex-col items-center p-5 gap-3">
                  <div className="rounded-xl bg-blue-50 p-2 text-blue-500 dark:bg-blue-950/40">
                    <RiShieldUserLine size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">구글 소셜 로그인</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500">1초 만에 안전하고 빠르게 로그인하고 시작하세요.</p>
                </CardContent>
              </Card>

              <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200/50 transition-all hover:-translate-y-0.5 dark:bg-slate-900 dark:ring-slate-800/50">
                <CardContent className="flex flex-col items-center p-5 gap-3">
                  <div className="rounded-xl bg-purple-50 p-2 text-purple-500 dark:bg-purple-950/40">
                    <RiSparklingLine size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">자동 파비콘 추출</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500">도메인을 분석해 해당 웹사이트의 대표 아이콘을 자동 등록합니다.</p>
                </CardContent>
              </Card>

              <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200/50 transition-all hover:-translate-y-0.5 dark:bg-slate-900 dark:ring-slate-800/50">
                <CardContent className="flex flex-col items-center p-5 gap-3">
                  <div className="rounded-xl bg-emerald-50 p-2 text-emerald-500 dark:bg-emerald-950/40">
                    <RiSmartphoneLine size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">모바일 우선 디자인</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500">모바일에 맞춤화되어 어떤 기기에서든 깔끔하게 보여집니다.</p>
                </CardContent>
              </Card>
            </div>

            {/* 핵심 로그인 안내 상자 */}
            <div className="w-full rounded-[24px] border border-dashed border-slate-200 bg-white/40 p-8 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/30">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">링크 보드를 사용할 준비가 되셨나요?</h2>
              <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                지금 Google 로그인으로 1초 만에 개인화된 관리 대시보드를 생성하여 나만의 단일 연결 통로를 만들어 보세요!
              </p>
              
              <Button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="mt-6 h-12 gap-2 rounded-2xl bg-primary px-8 text-sm font-bold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary/95 hover:shadow-lg hover:shadow-primary/30"
              >
                {isLoggingIn ? (
                  <RiLoader4Line size={18} className="animate-spin" />
                ) : (
                  <RiGoogleFill size={18} />
                )}
                <span>Google 계정으로 1초 만에 시작하기</span>
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* 삭제 확인 모달 */}
      <Dialog
        open={!!linkToDelete}
        onOpenChange={(open) => !open && setLinkToDelete(null)}
      >
        <DialogContent className="animate-in rounded-2xl border-none bg-white p-6 shadow-xl ring-1 ring-slate-200/50 duration-200 zoom-in-95 fade-in sm:max-w-[400px] dark:bg-slate-900 dark:ring-slate-800/50">
          <DialogHeader className="gap-2">
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
              정말 삭제하시겠습니까?
            </DialogTitle>

            {/* 링크 이름 표시 */}
            {linkToDelete && (
              <div className="mt-2 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800/80 dark:bg-slate-950">
                <span className="block truncate text-base font-bold text-slate-800 dark:text-slate-200">
                  {linkToDelete.title}
                </span>
                <span className="mt-1 block truncate text-xs text-slate-400 dark:text-slate-500">
                  {linkToDelete.url}
                </span>
              </div>
            )}

            {/* 경고: "이 작업은 되돌릴 수 없습니다" (빨간색) */}
            <DialogDescription className="mt-2 rounded-xl bg-red-50 py-2 text-center text-sm font-semibold text-red-500 dark:bg-red-950/20 dark:text-red-400">
              ⚠️ 이 작업은 되돌릴 수 없습니다
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex flex-row gap-3">
            <Button
              variant="outline"
              onClick={() => setLinkToDelete(null)}
              className="h-11 flex-1 rounded-xl border-slate-200 text-sm font-semibold dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
              disabled={deleteLinkMutation.isPending}
            >
              취소
            </Button>
            <Button
              onClick={() => linkToDelete && handleDeleteLink(linkToDelete.id)}
              className="h-11 flex-1 rounded-xl bg-red-600 text-sm font-bold text-white shadow-sm shadow-red-500/20 hover:bg-red-700"
              disabled={deleteLinkMutation.isPending}
            >
              {deleteLinkMutation.isPending ? (
                <RiLoader4Line className="animate-spin" size={20} />
              ) : (
                "삭제하기"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
