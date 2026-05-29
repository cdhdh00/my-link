"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Link } from "@/data/links"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  RiPencilLine,
  RiDeleteBinLine,
  RiExternalLinkLine,
  RiCheckLine,
  RiCloseLine,
  RiLoader4Line,
  RiLink,
  RiText,
} from "@remixicon/react"

// Zod 스키마 정의 (추가 폼과 동일한 검증 로직 적용)
const linkSchema = z.object({
  title: z
    .string()
    .min(1, "링크 제목을 입력해주세요.")
    .min(2, "제목은 최소 2자 이상이어야 합니다.")
    .max(32, "제목은 최대 32자까지 입력 가능합니다."),
  url: z
    .string()
    .min(1, "연결할 URL을 입력해주세요.")
    .refine((val) => {
      let testUrl = val.trim()
      if (!/^https?:\/\//i.test(testUrl)) {
        testUrl = "https://" + testUrl
      }
      try {
        new URL(testUrl)
        return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(
          testUrl
        )
      } catch {
        return false
      }
    }, "올바른 URL 형식이 아닙니다. (예: example.com)"),
})

type LinkFormValues = z.infer<typeof linkSchema>

interface LinkCardProps {
  link: Link
  onUpdate: (id: string, title: string, url: string) => Promise<void>
  onDeleteTrigger: (link: Link) => void
}

export function LinkCard({ link, onUpdate, onDeleteTrigger }: LinkCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      title: link.title,
      url: link.url,
    },
  })

  const titleValue = watch("title", "")

  const handleStartEdit = () => {
    reset({
      title: link.title,
      url: link.url,
    })
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    reset()
  }

  const onSubmit = async (data: LinkFormValues) => {
    setIsSubmitting(true)
    try {
      let finalUrl = data.url.trim()
      if (!/^https?:\/\//i.test(finalUrl)) {
        finalUrl = "https://" + finalUrl
      }
      await onUpdate(link.id, data.title.trim(), finalUrl)
      setIsEditing(false)
    } catch (error) {
      console.error("링크 수정 중 오류가 발생했습니다:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isEditing) {
    return (
      <Card className="animate-in overflow-hidden border-none bg-white shadow-md ring-1 ring-slate-200/50 duration-200 zoom-in-95 fade-in dark:bg-slate-900 dark:ring-slate-800/50">
        <CardContent className="flex flex-col gap-4 p-5">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-sm font-semibold text-slate-800 dark:border-slate-800 dark:text-slate-200">
              <span>링크 정보 수정</span>
              <span className="text-[10px] font-normal text-slate-400">
                수정 완료 후 [저장]을 눌러주세요
              </span>
            </div>

            <div className="space-y-3">
              {/* 제목 수정 입력란 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor={`title-${link.id}`}
                    className={`flex items-center gap-1 text-xs font-medium ${
                      errors.title
                        ? "text-red-500"
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <RiText size={14} />
                    제목
                  </Label>
                  <span
                    className={`font-mono text-[9px] ${titleValue.length > 32 ? "text-red-500" : "text-slate-400"}`}
                  >
                    {titleValue.length}/32
                  </span>
                </div>
                <Input
                  id={`title-${link.id}`}
                  placeholder="제목 입력"
                  disabled={isSubmitting}
                  {...register("title")}
                  className={`h-10 rounded-xl border-none bg-slate-50 px-3 text-sm ring-1 ring-slate-200 transition-all focus-visible:ring-2 focus-visible:ring-primary dark:bg-slate-900 dark:ring-slate-800 ${
                    errors.title
                      ? "bg-red-50/20 ring-red-500 dark:bg-red-950/10"
                      : ""
                  }`}
                />
                {errors.title && (
                  <p className="ml-1 animate-in text-[11px] font-medium text-red-500 fade-in slide-in-from-top-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* URL 수정 입력란 */}
              <div className="space-y-1.5">
                <Label
                  htmlFor={`url-${link.id}`}
                  className={`flex items-center gap-1 text-xs font-medium ${
                    errors.url
                      ? "text-red-500"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <RiLink size={14} />
                  URL 주소
                </Label>
                <Input
                  id={`url-${link.id}`}
                  placeholder="주소 입력 (예: example.com)"
                  disabled={isSubmitting}
                  {...register("url")}
                  className={`h-10 rounded-xl border-none bg-slate-50 px-3 text-sm ring-1 ring-slate-200 transition-all focus-visible:ring-2 focus-visible:ring-primary dark:bg-slate-900 dark:ring-slate-800 ${
                    errors.url
                      ? "bg-red-50/20 ring-red-500 dark:bg-red-950/10"
                      : ""
                  }`}
                />
                {errors.url && (
                  <p className="ml-1 animate-in text-[11px] font-medium text-red-500 fade-in slide-in-from-top-1">
                    {errors.url.message}
                  </p>
                )}
              </div>
            </div>

            {/* 제어 버튼 영역 */}
            <div className="mt-2 flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCancelEdit}
                disabled={isSubmitting}
                className="h-9 gap-1 rounded-lg px-3 text-xs text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
              >
                <RiCloseLine size={16} />
                취소
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="h-9 gap-1 rounded-lg bg-primary px-3 text-xs font-semibold text-white shadow-sm hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <RiLoader4Line className="animate-spin" size={16} />
                ) : (
                  <>
                    <RiCheckLine size={16} />
                    저장하기
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="group relative overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900 dark:shadow-slate-950/50 dark:ring-slate-800/50">
      <CardContent className="flex items-center justify-between gap-4 p-5">
        {/* 링크 이동 영역 (a 태그) */}
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group/link flex min-w-0 flex-1 items-center gap-4 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-50 ring-1 ring-slate-100 transition-transform duration-300 group-hover/link:scale-105 dark:bg-slate-800 dark:ring-slate-700">
            {link.icon ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={link.icon}
                alt={`${link.title} 아이콘`}
                className="h-7 w-7 object-contain"
              />
            ) : (
              <div className="h-full w-full bg-slate-100 dark:bg-slate-800" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <span className="block truncate text-lg font-bold text-slate-800 transition-colors group-hover/link:text-primary dark:text-slate-100">
              {link.title}
            </span>
            <span className="mt-0.5 block truncate text-xs text-slate-400 dark:text-slate-500">
              {link.url.replace(/^https?:\/\//, "")}
            </span>
          </div>
        </a>

        {/* 제어 영역 (항상 노출되는 수정, 삭제, 외부 링크 버튼) */}
        <div className="flex flex-shrink-0 items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleStartEdit}
            className="h-8 w-8 rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-800"
            title="링크 수정"
          >
            <RiPencilLine size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDeleteTrigger(link)}
            className="h-8 w-8 rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/20"
            title="링크 삭제"
          >
            <RiDeleteBinLine size={16} />
          </Button>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-slate-100 hover:text-primary dark:text-slate-600 dark:hover:bg-slate-800"
            title="새 탭에서 열기"
          >
            <RiExternalLinkLine size={16} />
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
