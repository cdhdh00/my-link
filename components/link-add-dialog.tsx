"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link } from "@/data/links";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RiAddLine, RiLink, RiText, RiLoader4Line } from "@remixicon/react";

// Zod 스키마 정의
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
      let testUrl = val.trim();
      if (!/^https?:\/\//i.test(testUrl)) {
        testUrl = "https://" + testUrl;
      }
      try {
        new URL(testUrl);
        return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(testUrl);
      } catch {
        return false;
      }
    }, "올바른 URL 형식이 아닙니다. (예: example.com)"),
});

type LinkFormValues = z.infer<typeof linkSchema>;

interface LinkAddDialogProps {
  onAdd: (link: Link) => Promise<void> | void;
}

export function LinkAddDialog({ onAdd }: LinkAddDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      title: "",
      url: "",
    },
  });

  const titleValue = watch("title", "");

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      reset();
    }
  };

  const onSubmit = async (data: LinkFormValues) => {
    setIsSubmitting(true);

    let finalUrl = data.url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = "https://" + finalUrl;
    }

    let domain = "";
    try {
      const urlObj = new URL(finalUrl);
      domain = urlObj.hostname;
    } catch (error) {
      domain = "default";
    }

    const newLink: Link = {
      id: Date.now().toString(),
      title: data.title.trim(),
      url: finalUrl,
      icon: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
    };

    try {
      await onAdd(newLink);
      setOpen(false);
      reset();
    } catch (error) {
      console.error("링크 추가 중 오류 발생:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button className="w-full h-12 rounded-xl text-md font-semibold gap-2 shadow-sm transition-all hover:shadow-md">
            <RiAddLine size={20} />
            새 링크 추가하기
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[440px] rounded-2xl p-6">
        <DialogHeader className="gap-1">
          <DialogTitle className="text-xl font-bold">새 링크 추가</DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400">
            공유하고 싶은 플랫폼의 이름과 URL을 입력하세요. 파비콘은 자동으로 불러옵니다.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 mt-4">
          <div className="space-y-4">
            {/* 제목 필드 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="title"
                  className={`text-sm font-medium flex items-center gap-1.5 ${
                    errors.title ? "text-red-500" : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <RiText size={16} />
                  링크 제목
                </Label>
                <span className={`text-[10px] font-mono ${titleValue.length > 32 ? "text-red-500" : "text-slate-400"}`}>
                  {titleValue.length}/32
                </span>
              </div>
              <Input
                id="title"
                placeholder="예: 인스타그램, 내 포트폴리오 등"
                disabled={isSubmitting}
                {...register("title")}
                className={`h-11 rounded-xl px-4 bg-slate-50 dark:bg-slate-900 border-none ring-1 ring-slate-200 dark:ring-slate-800 focus-visible:ring-2 focus-visible:ring-primary transition-all ${
                  errors.title ? "ring-red-500 bg-red-50/30 dark:bg-red-950/20" : ""
                }`}
              />
              {errors.title && (
                <p className="text-xs text-red-500 font-medium ml-1 animate-in fade-in slide-in-from-top-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* URL 필드 */}
            <div className="space-y-2">
              <Label
                htmlFor="url"
                className={`text-sm font-medium flex items-center gap-1.5 ${
                  errors.url ? "text-red-500" : "text-slate-700 dark:text-slate-300"
                }`}
              >
                <RiLink size={16} />
                URL 주소
              </Label>
              <Input
                id="url"
                placeholder="예: instagram.com/username"
                disabled={isSubmitting}
                {...register("url")}
                className={`h-11 rounded-xl px-4 bg-slate-50 dark:bg-slate-900 border-none ring-1 ring-slate-200 dark:ring-slate-800 focus-visible:ring-2 focus-visible:ring-primary transition-all ${
                  errors.url ? "ring-red-500 bg-red-50/30 dark:bg-red-950/20" : ""
                }`}
              />
              {errors.url && (
                <p className="text-xs text-red-500 font-medium ml-1 animate-in fade-in slide-in-from-top-1">
                  {errors.url.message}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-xl text-md font-bold transition-all relative overflow-hidden group"
          >
            {isSubmitting ? (
              <RiLoader4Line className="animate-spin" size={24} />
            ) : (
              "링크 저장하기"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
