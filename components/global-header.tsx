"use client"

import { useState } from "react"
import { auth, googleProvider } from "@/lib/firebase"
import { signInWithPopup, signOut } from "firebase/auth"
import { useAuthSync, useProfile } from "@/hooks/use-profile"
import { Header } from "./header"

export function GlobalHeader() {
  useAuthSync()
  const { data: user } = useProfile()
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const handleLogin = async () => {
    setIsLoggingIn(true)
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      console.error("구글 로그인 중 오류가 발생했습니다:", error)
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("로그아웃 중 오류가 발생했습니다:", error)
    }
  }

  return (
    <Header
      user={user ?? null}
      onLogin={handleLogin}
      onLogout={handleLogout}
      isLoggingIn={isLoggingIn}
    />
  )
}
