import { Metadata } from "next"

export const metadata: Metadata = {
  title: "링크 분석 통계",
  description: "내 링크 보드를 방문한 사용자들의 클릭 수와 통계를 실시간으로 분석합니다.",
  robots: {
    index: false,
    follow: false,
  }
}

export default function StatsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
