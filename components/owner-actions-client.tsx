"use client"

import Link from "next/link"
import { useProfile } from "@/hooks/use-profile"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { RiHome4Line } from "@remixicon/react"

interface OwnerActionsClientProps {
  ownerUid: string
}

export function OwnerActionsClient({ ownerUid }: OwnerActionsClientProps) {
  const { data: user } = useProfile()

  // 로그인 상태가 아니거나 페이지 소유자가 아니면 아무것도 노출하지 않음
  if (!user || user.uid !== ownerUid) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center gap-2 rounded-2xl bg-white/80 p-2 shadow-2xl backdrop-blur-md ring-1 ring-slate-200/50 dark:bg-slate-900/80 dark:ring-slate-800/50">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "default", size: "sm" }),
            "h-10 gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary/95"
          )}
        >
          <RiHome4Line size={15} />
          <span>대시보드로 가기</span>
        </Link>
      </div>
    </div>
  )
}
