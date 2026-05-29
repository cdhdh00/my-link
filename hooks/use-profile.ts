"use client"

import { useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { auth, db } from "@/lib/firebase"
import { onAuthStateChanged, updateProfile, User } from "firebase/auth"
import { doc, updateDoc, serverTimestamp, setDoc } from "firebase/firestore"

// 1. Auth 상태를 React Query 캐시에 동기화하는 훅
export function useAuthSync() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // Auth 변경 시 React Query 캐시 갱신
      queryClient.setQueryData(["profile"], currentUser)
      
      if (currentUser) {
        try {
          // 로그인 성공 시 Firestore 사용자 문서 초기화/병합 로직 (page.tsx에서 이동)
          const userRef = doc(db, "users", currentUser.uid)
          const displayNameVal = currentUser.displayName || ""
          await setDoc(
            userRef,
            {
              email: currentUser.email || "",
              displayName: displayNameVal,
              displayNameLower: displayNameVal.toLowerCase(),
              photoURL: currentUser.photoURL || "",
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          )
        } catch (error) {
          console.error("사용자 정보 데이터베이스 저장 실패:", error)
        }
      }
    })
    return () => unsubscribe()
  }, [queryClient])
}

// 2. 프로필 조회 훅
export function useProfile() {
  // 초기 렌더링 시에는 undefined나 null일 수 있으며, useAuthSync가 캐시를 채워줌.
  // 서버 렌더링 환경 대응 등을 위해 초기값을 auth.currentUser로 설정.
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => auth.currentUser,
    staleTime: Infinity, // onAuthStateChanged로 갱신될 때까지 stale하지 않음
  })
}

// 3. 프로필 수정 훅 (옵티미스틱 업데이트 적용)
export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ displayName, photoURL }: { displayName: string; photoURL: string }) => {
      const currentUser = auth.currentUser
      if (!currentUser) throw new Error("로그인이 필요합니다.")

      // 1. Firebase Auth 프로필 업데이트 (클라이언트 세션)
      await updateProfile(currentUser, {
        displayName,
        photoURL,
      })

      // 2. Firestore 프로필 업데이트
      const userRef = doc(db, "users", currentUser.uid)
      await updateDoc(userRef, {
        displayName,
        displayNameLower: displayName.toLowerCase(),
        photoURL,
      })

      // 새로운 User 객체를 반환하기 위해 복사본 생성
      return Object.assign({}, currentUser, { displayName, photoURL }) as User
    },
    onMutate: async (newProfile) => {
      await queryClient.cancelQueries({ queryKey: ["profile"] })
      const previousProfile = queryClient.getQueryData<User | null>(["profile"])

      // 옵티미스틱 업데이트: 캐시에 즉시 새 정보 반영
      if (previousProfile) {
        queryClient.setQueryData<User>(["profile"], Object.assign({}, previousProfile, {
          displayName: newProfile.displayName,
          photoURL: newProfile.photoURL,
        }))
      }

      return { previousProfile }
    },
    onError: (err, newProfile, context) => {
      // 에러 발생 시 원래 상태로 롤백
      if (context?.previousProfile) {
        queryClient.setQueryData(["profile"], context.previousProfile)
      }
    },
    onSettled: () => {
      // 업데이트가 완료되면 캐시 무효화하여 최신 상태 동기화 (auth 객체가 변했을 수 있음)
      queryClient.invalidateQueries({ queryKey: ["profile"] })
    },
  })
}
