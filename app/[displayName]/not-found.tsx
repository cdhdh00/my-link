import Link from "next/link"
import { RiAlertLine, RiHome4Line } from "@remixicon/react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-[#F8FAFC] px-4 text-center dark:bg-[#0F172A]">
      <div className="relative mb-6">
        <div className="absolute -inset-1 rounded-full bg-red-500 opacity-20 blur-xl dark:opacity-35" />
        <div className="relative inline-flex h-20 w-20 items-center justify-center rounded-[32px] bg-white shadow-2xl ring-1 ring-slate-200/60 dark:bg-slate-800 dark:ring-slate-700/60">
          <RiAlertLine className="h-10 w-10 text-red-500" />
        </div>
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
        마이링크 보드를 찾을 수 없습니다
      </h1>
      
      <p className="mt-3 max-w-sm text-base font-semibold leading-relaxed text-slate-500 dark:text-slate-400">
        입력하신 주소의 마이링크 보드가 존재하지 않거나, 주소가 올바르지 않습니다. 다시 한 번 확인해 주세요.
      </p>

      <div className="mt-8 flex w-full max-w-xs flex-col gap-3">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "default" }),
            "h-12 gap-2 rounded-2xl bg-primary text-sm font-bold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary/95 hover:shadow-lg hover:shadow-primary/30"
          )}
        >
          <RiHome4Line size={18} />
          <span>메인 페이지로 이동</span>
        </Link>
      </div>
    </div>
  )
}
