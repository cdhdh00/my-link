import { Geist_Mono, Nunito_Sans } from "next/font/google"
import { Metadata } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"

const nunitoSans = Nunito_Sans({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

import { QueryProvider } from "@/components/providers/query-provider"

export const metadata: Metadata = {
  title: {
    default: "마이링크 (MyLink) - 모든 소셜과 포트폴리오를 단 하나의 링크로",
    template: "%s | 마이링크 (MyLink)"
  },
  description: "흩어져 있는 SNS와 포트폴리오를 모아 나만의 아름다운 맞춤 보드를 무료로 디자인하세요. 단 하나의 링크로 모든 소셜 미디어를 연결합니다.",
  keywords: ["마이링크", "MyLink", "링크트리", "Linktree", "소셜링크", "포트폴리오", "무료 링크보드", "SNS 링크", "프로필 링크"],
  authors: [{ name: "MyLink Team" }],
  creator: "MyLink",
  publisher: "MyLink",
  openGraph: {
    title: "마이링크 (MyLink) - 모든 소셜과 포트폴리오를 단 하나의 링크로",
    description: "흩어져 있는 SNS와 포트폴리오를 모아 나만의 아름다운 맞춤 보드를 무료로 디자인하세요. 단 하나의 링크로 모든 소셜 미디어를 연결합니다.",
    url: "https://mylink.com",
    siteName: "마이링크",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "마이링크 (MyLink) - 모든 소셜과 포트폴리오를 단 하나의 링크로",
    description: "흩어져 있는 SNS와 포트폴리오를 모아 나만의 아름다운 맞춤 보드를 무료로 디자인하세요. 단 하나의 링크로 모든 소셜 미디어를 연결합니다.",
  },
  robots: {
    index: true,
    follow: true,
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        nunitoSans.variable
      )}
    >
      <body>
        <QueryProvider>
          <ThemeProvider>
            {children}
            <Toaster richColors />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}

