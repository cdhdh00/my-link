import { Geist_Mono, Nunito_Sans } from "next/font/google"

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
