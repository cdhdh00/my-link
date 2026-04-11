import { dummyLinks } from "../data/links"
import { Card, CardContent } from "@/components/ui/card"

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">내 링크 모음</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            다양한 플랫폼을 하나의 페이지에서 확인하세요.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {dummyLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl transition-transform outline-none hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]"
            >
              <Card className="cursor-pointer transition-shadow hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-4">
                  {link.icon ? (
                    <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-transparent">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={link.icon}
                        alt={`${link.title} 아이콘`}
                        className="h-6 w-6 object-contain"
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-slate-200 dark:bg-slate-800" />
                  )}
                  <span className="flex-1 truncate text-base font-semibold">
                    {link.title}
                  </span>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
