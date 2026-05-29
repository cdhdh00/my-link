"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useProfile } from "@/hooks/use-profile"
import { useLinks } from "@/hooks/use-links"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import {
  RiArrowLeftLine,
  RiLoader4Line,
  RiCursorLine,
  RiBarChartGroupedLine,
  RiSparklingLine,
} from "@remixicon/react"
import { type ChartConfig } from "@/components/ui/chart"
import { GlobalHeader } from "@/components/global-header"

const chartConfig = {
  clicks: {
    label: "클릭 수",
    color: "var(--color-primary, #3b82f6)",
  },
} satisfies ChartConfig

export default function StatsPage() {
  const router = useRouter()
  const { data: user, isLoading: isAuthLoading } = useProfile()
  const { data: links = [], isLoading: isLinksLoading } = useLinks(user?.uid)

  // 1. 비로그인 사용자 리다이렉트
  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace("/")
    }
  }, [user, isAuthLoading, router])

  if (isAuthLoading || !user) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-[#F8FAFC] dark:bg-[#0F172A]">
        <div className="flex flex-col items-center gap-3">
          <RiLoader4Line size={40} className="animate-spin text-primary" />
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            사용자 권한을 확인하고 있습니다...
          </span>
        </div>
      </div>
    )
  }

  // 2. 통계 데이터 계산
  const totalClicks = links.reduce((acc, link) => acc + (link.clicks || 0), 0)

  // Recharts 가공 데이터
  const chartData = [...links]
    .reverse() // 최신 추가 순서에서 추가된 시간순(오래된 순)으로 차트 정렬하여 흐름을 보여줌
    .map((link) => ({
      name: link.title,
      clicks: link.clicks || 0,
    }))

  return (
    <div className="flex min-h-svh flex-col bg-[#F8FAFC] dark:bg-[#0F172A]">
      {/* 상단 글로벌 헤더 */}
      <GlobalHeader />

      <main className="flex flex-1 flex-col items-center p-6">
        <div className="mt-6 flex w-full max-w-[640px] flex-col gap-6 pb-20">
          
          {/* 뒤로 가기 및 헤더 제어 영역 */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              className="h-9 gap-1.5 rounded-xl px-3 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <RiArrowLeftLine size={18} />
              <span>대시보드로 돌아가기</span>
            </Button>
            <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary dark:bg-primary/25">
              <RiSparklingLine size={12} className="animate-pulse" />
              <span>실시간 분석</span>
            </div>
          </div>

          {/* 대시보드 타이틀 */}
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              링크 분석 통계
            </h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              내 링크 보드를 방문한 사용자들의 클릭 통계 리포트입니다.
            </p>
          </div>

          {/* 메인 통계 요약 카드 */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* 총 클릭수 요약 */}
            <Card className="border-none bg-gradient-to-br from-primary to-blue-600 text-white shadow-lg shadow-primary/10">
              <CardContent className="flex items-center justify-between p-6">
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-100">
                    전체 누적 클릭 수
                  </span>
                  <h2 className="text-4xl font-black tracking-tight">
                    {totalClicks.toLocaleString()}
                  </h2>
                </div>
                <div className="rounded-2xl bg-white/10 p-3 text-white">
                  <RiCursorLine size={28} />
                </div>
              </CardContent>
            </Card>

            {/* 링크 개수 요약 */}
            <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200/50 dark:bg-slate-900 dark:ring-slate-800/50">
              <CardContent className="flex items-center justify-between p-6">
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    등록된 링크 개수
                  </span>
                  <h2 className="text-4xl font-black tracking-tight text-slate-800 dark:text-slate-100">
                    {links.length}
                  </h2>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  <RiBarChartGroupedLine size={28} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 차트 시각화 영역 */}
          <Card className="border-none bg-white shadow-md ring-1 ring-slate-200/50 dark:bg-slate-900 dark:ring-slate-800/50">
            <CardHeader className="border-b border-slate-50 pb-4 dark:border-slate-800">
              <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">
                링크별 클릭 현황
              </CardTitle>
              <CardDescription className="text-xs text-slate-400 dark:text-slate-500">
                각각의 링크가 획득한 클릭 수치를 비교합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {isLinksLoading ? (
                <div className="flex h-[300px] flex-col items-center justify-center gap-2">
                  <RiLoader4Line size={32} className="animate-spin text-slate-400" />
                  <span className="text-xs text-slate-400">차트 데이터를 불러오는 중...</span>
                </div>
              ) : links.length > 0 ? (
                <div className="w-full">
                  <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
                      >
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-800/60" />
                        <XAxis
                          dataKey="name"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          className="font-medium text-slate-500 dark:text-slate-400"
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          allowDecimals={false}
                          className="font-mono font-medium text-slate-400 dark:text-slate-500"
                        />
                        <ChartTooltip
                          cursor={{ fill: "rgba(148, 163, 184, 0.05)" }}
                          content={<ChartTooltipContent nameKey="clicks" hideLabel />}
                        />
                        <Bar
                          dataKey="clicks"
                          fill="var(--color-primary, #3b82f6)"
                          radius={[8, 8, 0, 0]}
                          maxBarSize={48}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              ) : (
                <div className="flex h-[240px] flex-col items-center justify-center gap-3 text-center">
                  <RiBarChartGroupedLine size={40} className="text-slate-300 dark:text-slate-700" />
                  <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">
                    통계를 표시할 링크가 아직 없습니다.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  )
}
