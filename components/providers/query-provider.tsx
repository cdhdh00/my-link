"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // useState를 사용하여 리렌더링마다 QueryClient가 재초기화되는 것을 방지합니다.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1분간 캐시 유지
            retry: 1, // 실패 시 1회 재시도
            refetchOnWindowFocus: false, // 창 포커스 시 불필요한 리패칭 방지 (옵션)
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
