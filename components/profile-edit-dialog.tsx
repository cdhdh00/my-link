"use client"

import { useState, useEffect } from "react"
import { db, auth } from "@/lib/firebase"
import { updateProfile, User } from "firebase/auth"
import { doc, updateDoc, collection, query, where, getDocs } from "firebase/firestore"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  RiLoader4Line,
  RiCheckLine,
  RiCloseLine,
  RiSettings4Line,
  RiUser3Line,
  RiInformationLine,
  RiImageLine
} from "@remixicon/react"
import { toast } from "sonner"
import { useUpdateProfile } from "@/hooks/use-profile"

interface ProfileEditDialogProps {
  user: User
  onUpdateComplete: () => void
}

export function ProfileEditDialog({ user, onUpdateComplete }: ProfileEditDialogProps) {
  const updateProfileMutation = useUpdateProfile()
  const [isOpen, setIsOpen] = useState(false)
  const [displayName, setDisplayName] = useState(user.displayName || "")
  const [photoURL, setPhotoURL] = useState(user.photoURL || "")
  
  // 중복 확인 상태
  const [isChecking, setIsChecking] = useState(false)
  const [isUnique, setIsUnique] = useState<boolean | null>(null)
  const [duplicationMessage, setDuplicationMessage] = useState("")
  
  // 전체 저장 로딩 상태
  const [isSaving, setIsSaving] = useState(false)

  // 다이얼로그 열릴 때 값 초기화 및 중복 상태 리셋
  useEffect(() => {
    if (isOpen) {
      setDisplayName(user.displayName || "")
      setPhotoURL(user.photoURL || "")
      setIsUnique(null)
      setDuplicationMessage("")
    }
  }, [isOpen, user])

  // 디스플레이 이름 정규식 검사 (한글, 영문, 숫자 2~12자, 공백 불가)
  const nameRegex = /^[a-zA-Z0-9가-힣]{2,12}$/
  const isValidName = nameRegex.test(displayName)

  // 디스플레이 이름 입력값 변경 시 중복 확인 상태 리셋
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, "") // 공백 자동 제거
    setDisplayName(value)
    setIsUnique(null)
    setDuplicationMessage("")
  }

  // 중복 확인 함수 (대소문자 구분 없이)
  const handleCheckDuplication = async () => {
    if (!displayName.trim()) {
      toast.error("디스플레이 이름을 입력해 주세요.")
      return
    }

    if (!isValidName) {
      toast.error("올바른 이름 형식이 아닙니다.")
      return
    }

    // 본인의 현재 이름과 대소문자 무관하게 같은 경우
    if (displayName.toLowerCase() === (user.displayName || "").toLowerCase()) {
      setIsUnique(true)
      setDuplicationMessage("현재 사용 중인 이름입니다.")
      return
    }

    setIsChecking(true)
    try {
      const q = query(
        collection(db, "users"),
        where("displayNameLower", "==", displayName.toLowerCase())
      )
      const querySnapshot = await getDocs(q)
      
      let existsOther = false
      querySnapshot.forEach((doc) => {
        if (doc.id !== user.uid) {
          existsOther = true
        }
      })

      if (existsOther) {
        setIsUnique(false)
        setDuplicationMessage("이미 사용 중인 이름입니다.")
        toast.error("이미 사용 중인 이름입니다.")
      } else {
        setIsUnique(true)
        setDuplicationMessage("사용 가능한 이름입니다.")
        toast.success("사용 가능한 디스플레이 이름입니다!")
      }
    } catch (error) {
      console.error("중복 확인 오류:", error)
      setDuplicationMessage("중복 확인 중 오류가 발생했습니다.")
      toast.error("중복 확인 과정에서 오류가 발생했습니다.")
    } finally {
      setIsChecking(false)
    }
  }

  // 프로필 저장 함수
  const handleSave = async () => {
    if (!user) return

    if (!isValidName) {
      toast.error("이름은 한글, 영문, 숫자 조합의 2~12자여야 합니다.")
      return
    }

    // 이름이 변경되었는데 중복 확인을 하지 않았거나 중복인 경우
    const isNameChanged = displayName.toLowerCase() !== (user.displayName || "").toLowerCase()
    if (isNameChanged && isUnique !== true) {
      toast.error("디스플레이 이름 중복 확인이 필요합니다.")
      return
    }

    setIsSaving(true)
    try {
      await updateProfileMutation.mutateAsync({
        displayName,
        photoURL,
      })
      toast.success("프로필이 성공적으로 변경되었습니다!")
      setIsOpen(false)
      onUpdateComplete() // 상위 컴포넌트 갱신 트리거
    } catch (error) {
      console.error("프로필 저장 오류:", error)
      toast.error("프로필을 저장하는 중 오류가 발생했습니다.")
    } finally {
      setIsSaving(false)
    }
  }

  // 중복 확인 통과 여부에 따른 저장 버튼 활성화 조건
  const isNameUnchanged = displayName === (user.displayName || "") && photoURL === (user.photoURL || "")
  const isNameChanged = displayName.toLowerCase() !== (user.displayName || "").toLowerCase()
  const canSave = !isSaving && isValidName && (!isNameChanged || isUnique === true) && !isNameUnchanged

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="inline-flex items-center justify-center h-10 w-10 rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:ring-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all duration-200 cursor-pointer">
        <RiSettings4Line className="h-5 w-5 text-slate-500 dark:text-slate-400" />
      </DialogTrigger>
      
      <DialogContent className="animate-in rounded-3xl border-none bg-white p-6 shadow-2xl ring-1 ring-slate-200/50 duration-300 zoom-in-95 fade-in sm:max-w-[420px] dark:bg-slate-900 dark:ring-slate-800/50">
        <DialogHeader className="gap-2">
          <DialogTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            프로필 수정
          </DialogTitle>
          <DialogDescription className="text-sm font-medium text-slate-500 dark:text-slate-400">
            마이링크 페이지에 보여질 프로필을 설정하세요.
          </DialogDescription>
        </DialogHeader>

        {/* 프로필 이미지 실시간 미리보기 및 아바타 레이아웃 */}
        <div className="my-6 flex flex-col items-center gap-4">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-[32px] bg-gradient-to-r from-primary to-purple-600 opacity-20 blur-md transition duration-500 group-hover:opacity-30" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-[32px] bg-slate-100 shadow-xl dark:bg-slate-800 ring-4 ring-white dark:ring-slate-900 overflow-hidden">
              {photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoURL}
                  alt="미리보기"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    // 이미지 로드 실패 시 깨지는 이미지를 방지하기 위해 빈 이미지 처리
                    (e.target as HTMLImageElement).src = ""
                  }}
                />
              ) : (
                <RiUser3Line className="h-10 w-10 text-slate-400 dark:text-slate-600" />
              )}
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
            프로필 이미지 미리보기
          </span>
        </div>

        <div className="space-y-5 py-2">
          {/* 디스플레이 이름 입력 */}
          <div className="space-y-2">
            <Label htmlFor="displayName" className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              디스플레이 이름
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="displayName"
                  placeholder="예: gildong"
                  value={displayName}
                  onChange={handleNameChange}
                  className="h-11 rounded-xl border-slate-200 pr-10 text-sm font-semibold focus-visible:ring-primary dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  maxLength={12}
                />
                {isUnique === true && (
                  <RiCheckLine className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-500" />
                )}
                {isUnique === false && (
                  <RiCloseLine className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-red-500" />
                )}
              </div>
              <Button
                type="button"
                onClick={handleCheckDuplication}
                disabled={isChecking || !displayName.trim() || !isValidName}
                className="h-11 rounded-xl bg-slate-900 px-4 text-xs font-bold text-white shadow-sm hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-50"
              >
                {isChecking ? (
                  <RiLoader4Line className="h-4 w-4 animate-spin" />
                ) : (
                  "중복 확인"
                )}
              </Button>
            </div>

            {/* 유효성 검사 및 안내 메시지 */}
            <div className="min-h-[20px] px-1 text-xs">
              {!displayName ? (
                <p className="flex items-center gap-1 font-medium text-slate-400 dark:text-slate-500">
                  <RiInformationLine size={13} />
                  한글, 영문, 숫자 조합의 2~12자를 입력하세요 (공백 불가).
                </p>
              ) : !isValidName ? (
                <p className="flex items-center gap-1 font-medium text-red-500">
                  <RiCloseLine size={13} />
                  형식에 맞지 않습니다 (한글/영문/숫자 2~12자).
                </p>
              ) : isUnique === true ? (
                <p className="flex items-center gap-1 font-semibold text-emerald-500">
                  <RiCheckLine size={13} />
                  {duplicationMessage}
                </p>
              ) : isUnique === false ? (
                <p className="flex items-center gap-1 font-semibold text-red-500">
                  <RiCloseLine size={13} />
                  {duplicationMessage}
                </p>
              ) : (
                <p className="flex items-center gap-1 font-medium text-amber-500">
                  <RiInformationLine size={13} />
                  이름이 변경되었습니다. 중복 확인을 진행해 주세요.
                </p>
              )}
            </div>
          </div>

          {/* 프로필 이미지 URL 입력 */}
          <div className="space-y-2">
            <Label htmlFor="photoURL" className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              프로필 이미지 URL
            </Label>
            <div className="relative">
              <Input
                id="photoURL"
                type="url"
                placeholder="https://example.com/avatar.jpg"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                className="h-11 rounded-xl border-slate-200 pl-10 text-sm font-semibold focus-visible:ring-primary dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
              <RiImageLine className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            </div>
            <p className="px-1 text-xs font-medium text-slate-400 dark:text-slate-500">
              공개된 이미지 웹 링크 주소를 입력하면 즉시 반영됩니다.
            </p>
          </div>
        </div>

        <DialogFooter className="mt-6 flex flex-row gap-3">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="h-11 flex-1 rounded-xl border-slate-200 text-sm font-semibold dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
            disabled={isSaving}
          >
            취소
          </Button>
          <Button
            onClick={handleSave}
            disabled={!canSave}
            className="h-11 flex-1 rounded-xl bg-primary text-sm font-bold text-white shadow-md shadow-primary/20 hover:bg-primary/95"
          >
            {isSaving ? (
              <RiLoader4Line className="h-5 w-5 animate-spin" />
            ) : (
              "변경사항 저장"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
