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
import { LandingSection } from "@/components/landing-section"

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
          <LandingSection onLogin={handleLogin} isLoggingIn={isLoggingIn} />
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
