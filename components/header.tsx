"use client"

import { User } from "firebase/auth"
import { RiGoogleFill, RiLogoutBoxRLine } from "@remixicon/react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  user: User | null
  onLogin: () => Promise<void>
  onLogout: () => Promise<void>
  isLoggingIn: boolean
}

export function Header({ user, onLogin, onLogout, isLoggingIn }: HeaderProps) {
  const getDisplayName = (email: string | null) => {
    if (!email) return "사용자"
    return email.split("@")[0]
  }

  const displayName = getDisplayName(user?.email || null)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-[#F8FAFC]/80 backdrop-blur-md dark:border-slate-800/50 dark:bg-[#0F172A]/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* 로고 영역 */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/20 transition-transform hover:rotate-3">
            <span className="text-lg font-black">M</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            마이링크
          </span>
        </div>

        {/* 인증 정보 영역 */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              {/* 유저 아바타 및 이름 */}
              <div className="hidden flex-col items-end sm:flex">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {displayName}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {user.email}
                </span>
              </div>
              {user.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.photoURL}
                  alt={displayName}
                  className="h-9 w-9 rounded-full ring-2 ring-primary/20 shadow-sm"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}

              {/* 로그아웃 버튼 */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="h-9 gap-1 rounded-xl border border-slate-200/60 bg-white/50 px-3 text-sm font-medium text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:text-red-500 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-red-400"
              >
                <RiLogoutBoxRLine size={16} />
                <span className="hidden sm:inline">로그아웃</span>
              </Button>
            </div>
          ) : (
            <Button
              onClick={onLogin}
              disabled={isLoggingIn}
              className="h-10 gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200/80 transition-all hover:bg-slate-50 hover:shadow dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-800 dark:hover:bg-slate-800/80"
            >
              <RiGoogleFill size={18} className="text-red-500" />
              <span>Google로 시작하기</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
