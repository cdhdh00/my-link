"use client"

import { useState, useEffect } from "react"
import { User } from "firebase/auth"
import { RiGoogleFill, RiLogoutBoxRLine, RiFileCopyLine, RiCheckLine, RiExternalLinkLine, RiUserLine } from "@remixicon/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

interface HeaderProps {
  user: User | null
  onLogin: () => Promise<void>
  onLogout: () => Promise<void>
  isLoggingIn: boolean
}

export function Header({ user, onLogin, onLogout, isLoggingIn }: HeaderProps) {
  const [copied, setCopied] = useState(false)
  const [origin, setOrigin] = useState("https://mylink.com")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin)
    }
  }, [])

  const getDisplayName = (email: string | null) => {
    if (!email) return "사용자"
    return email.split("@")[0]
  }

  const displayName = getDisplayName(user?.email || null)
  const myLinkUrl = `${origin}/${displayName}`

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation() // 드롭다운 닫힘 방지
    try {
      await navigator.clipboard.writeText(myLinkUrl)
      setCopied(true)
      toast.success("마이링크 주소가 클립보드에 복사되었습니다!")
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("클립보드 복사 실패:", err)
      toast.error("링크 복사에 실패했습니다. 다시 시도해 주세요.")
    }
  }

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
              {/* 유저 아바타 드롭다운 메뉴 */}
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="flex items-center gap-2 rounded-full p-0.5 outline-none ring-primary/0 ring-offset-2 transition-all hover:ring-2 hover:ring-primary/40 focus:ring-2 focus:ring-primary/60 dark:ring-offset-slate-950 cursor-pointer">
                    {user.photoURL ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.photoURL}
                        alt={displayName}
                        className="h-9 w-9 rounded-full ring-2 ring-primary/25 shadow-sm"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-[280px] rounded-2xl border-none bg-white p-2 shadow-2xl ring-1 ring-slate-200/60 dark:bg-slate-900 dark:ring-slate-800/60"
                >
                  {/* 드롭다운 헤더: 사용자 정보 */}
                  <div className="flex items-center gap-3 px-3 py-3">
                    {user.photoURL ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.photoURL}
                        alt={displayName}
                        className="h-10 w-10 rounded-full ring-2 ring-slate-100 dark:ring-slate-800"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-base font-bold text-primary">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex flex-col gap-0.5 overflow-hidden">
                      <span className="truncate text-sm font-bold text-slate-800 dark:text-slate-200">
                        {displayName}
                      </span>
                      <span className="truncate text-xs font-medium text-slate-400 dark:text-slate-500">
                        {user.email}
                      </span>
                    </div>
                  </div>

                  <DropdownMenuSeparator className="my-1 bg-slate-100 dark:bg-slate-800/80" />

                  {/* 마이링크 주소 정보 및 클립보드 복사 섹션 */}
                  <div className="px-3 py-2.5">
                    <span className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                      내 공유 마이링크
                    </span>
                    <div className="mt-1.5 flex items-center justify-between gap-2 rounded-xl bg-slate-50 p-2 ring-1 ring-slate-100 dark:bg-slate-950 dark:ring-slate-800/60">
                      <span className="truncate text-xs font-semibold text-slate-600 dark:text-slate-400 select-all">
                        {myLinkUrl}
                      </span>
                      
                      <button
                        onClick={handleCopyLink}
                        className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg transition-all ${
                          copied
                            ? "bg-emerald-500 text-white"
                            : "bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                        } shadow-sm ring-1 ring-slate-200/50 dark:ring-slate-850`}
                        title="주소 복사"
                      >
                        {copied ? (
                          <RiCheckLine size={14} className="animate-in zoom-in-75" />
                        ) : (
                          <RiFileCopyLine size={13} />
                        )}
                      </button>
                    </div>
                  </div>

                  <DropdownMenuSeparator className="my-1 bg-slate-100 dark:bg-slate-800/80" />

                  {/* 외부 연결 테스트 버튼 */}
                  <DropdownMenuItem className="focus:bg-slate-50 dark:focus:bg-slate-800">
                    <a
                      href={myLinkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 w-full text-xs font-bold text-slate-600 transition-all hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                      <RiExternalLinkLine size={14} />
                      <span>내 마이링크 보드 방문하기</span>
                    </a>
                  </DropdownMenuItem>

                  {/* 로그아웃 액션 */}
                  <DropdownMenuItem
                    onClick={onLogout}
                    className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold text-red-500 transition-all hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
                  >
                    <RiLogoutBoxRLine size={14} />
                    <span>로그아웃</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
