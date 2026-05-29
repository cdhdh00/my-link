"use client";

import { useState } from "react";
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

interface LinkAddDialogProps {
  onAdd: (link: Link) => void;
}

export function LinkAddDialog({ onAdd }: LinkAddDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({ title: "", url: "" });

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setTitle("");
      setUrl("");
      setErrors({ title: "", url: "" });
    }
  };

  const validateUrl = (testUrl: string) => {
    try {
      new URL(testUrl);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;
    const newErrors = { title: "", url: "" };

    // 제목 검증
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      newErrors.title = "링크 제목을 입력해주세요.";
      hasError = true;
    } else if (trimmedTitle.length < 2) {
      newErrors.title = "제목은 최소 2자 이상이어야 합니다.";
      hasError = true;
    } else if (trimmedTitle.length > 32) {
      newErrors.title = "제목은 최대 32자까지 입력 가능합니다.";
      hasError = true;
    }

    // URL 검증
    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      newErrors.url = "연결할 URL을 입력해주세요.";
      hasError = true;
    } else {
      let finalUrl = trimmedUrl;
      if (!/^https?:\/\//i.test(finalUrl)) {
        finalUrl = "https://" + finalUrl;
      }
      
      // 기본적인 URL 구조 체크 (도메인 포함 여부)
      const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
      
      if (!urlPattern.test(finalUrl) || !validateUrl(finalUrl)) {
        newErrors.url = "올바른 URL 형식이 아닙니다. (예: example.com)";
        hasError = true;
      }
    }

    setErrors(newErrors);
    if (hasError) return;

    setIsSubmitting(true);

    // 서버 서버 연결 상태 시뮬레이션 (1.5초 대기)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    let parsedUrl = url.trim();
    if (!/^https?:\/\//i.test(parsedUrl)) {
      parsedUrl = "https://" + parsedUrl;
    }

    let domain = "";
    try {
      const urlObj = new URL(parsedUrl);
      domain = urlObj.hostname;
    } catch (error) {
      domain = "default";
    }

    const newLink: Link = {
      id: Date.now().toString(),
      title: title.trim(),
      url: parsedUrl,
      icon: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
    };

    onAdd(newLink);
    setIsSubmitting(false);
    setOpen(false);
    setTitle("");
    setUrl("");
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-4">
          <div className="space-y-4">
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
                <span className={`text-[10px] font-mono ${title.length > 32 ? "text-red-500" : "text-slate-400"}`}>
                  {title.length}/32
                </span>
              </div>
              <Input
                id="title"
                placeholder="예: 인스타그램, 내 포트폴리오 등"
                value={title}
                disabled={isSubmitting}
                maxLength={40}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
                }}
                className={`h-11 rounded-xl px-4 bg-slate-50 dark:bg-slate-900 border-none ring-1 ring-slate-200 dark:ring-slate-800 focus-visible:ring-2 focus-visible:ring-primary transition-all ${
                  errors.title ? "ring-red-500 bg-red-50/30 dark:bg-red-950/20" : ""
                }`}
              />
              {errors.title && (
                <p className="text-xs text-red-500 font-medium ml-1 animate-in fade-in slide-in-from-top-1">
                  {errors.title}
                </p>
              )}
            </div>

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
                value={url}
                disabled={isSubmitting}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (errors.url) setErrors((prev) => ({ ...prev, url: "" }));
                }}
                className={`h-11 rounded-xl px-4 bg-slate-50 dark:bg-slate-900 border-none ring-1 ring-slate-200 dark:ring-slate-800 focus-visible:ring-2 focus-visible:ring-primary transition-all ${
                  errors.url ? "ring-red-500 bg-red-50/30 dark:bg-red-950/20" : ""
                }`}
              />
              {errors.url && (
                <p className="text-xs text-red-500 font-medium ml-1 animate-in fade-in slide-in-from-top-1">
                  {errors.url}
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
