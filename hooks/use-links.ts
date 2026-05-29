"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Link } from "@/data/links"

// 링크 목록 조회 훅
export function useLinks(uid: string | undefined) {
  return useQuery({
    queryKey: ["links", uid],
    queryFn: async () => {
      if (!uid) return []
      const q = query(collection(db, "users", uid, "links"), orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)
      const fetchedLinks: Link[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        fetchedLinks.push({
          id: doc.id,
          title: data.title || "",
          url: data.url || "",
          icon: data.icon || "",
          clicks: data.clicks || 0,
        })
      })
      return fetchedLinks
    },
    enabled: !!uid, // uid가 있을 때만 쿼리 실행
  })
}

// 링크 추가 훅 (옵티미스틱 업데이트)
export function useAddLink(uid: string | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newLink: Omit<Link, "id">) => {
      if (!uid) throw new Error("사용자 인증 정보가 없습니다.")
      const docRef = await addDoc(collection(db, "users", uid, "links"), {
        title: newLink.title,
        url: newLink.url,
        icon: newLink.icon || "",
        clicks: 0,
        createdAt: serverTimestamp(),
      })
      return { ...newLink, id: docRef.id, clicks: 0 }
    },
    onMutate: async (newLink) => {
      await queryClient.cancelQueries({ queryKey: ["links", uid] })
      const previousLinks = queryClient.getQueryData<Link[]>(["links", uid])
      
      // 옵티미스틱 업데이트: 임시 ID를 부여하여 캐시에 선반영
      const optimisticLink = { ...newLink, id: `temp-${Date.now()}`, clicks: 0 }
      queryClient.setQueryData<Link[]>(["links", uid], (old) => {
        return old ? [optimisticLink, ...old] : [optimisticLink]
      })

      return { previousLinks }
    },
    onError: (err, newLink, context) => {
      if (context?.previousLinks) {
        queryClient.setQueryData(["links", uid], context.previousLinks)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["links", uid] })
    },
  })
}

// 링크 수정 훅 (옵티미스틱 업데이트)
export function useUpdateLink(uid: string | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, title, url }: { id: string; title: string; url: string }) => {
      if (!uid) throw new Error("사용자 인증 정보가 없습니다.")
      let domain = ""
      try {
        const urlObj = new URL(url)
        domain = urlObj.hostname
      } catch (error) {
        domain = "default"
      }
      const icon = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`

      const linkRef = doc(db, "users", uid, "links", id)
      await updateDoc(linkRef, { title, url, icon })
      return { id, title, url, icon }
    },
    onMutate: async (updatedLink) => {
      await queryClient.cancelQueries({ queryKey: ["links", uid] })
      const previousLinks = queryClient.getQueryData<Link[]>(["links", uid])

      queryClient.setQueryData<Link[]>(["links", uid], (old) => {
        if (!old) return old
        return old.map((link) =>
          link.id === updatedLink.id
            ? { ...link, title: updatedLink.title, url: updatedLink.url, icon: `https://www.google.com/s2/favicons?domain=${new URL(updatedLink.url).hostname}&sz=64` }
            : link
        )
      })

      return { previousLinks }
    },
    onError: (err, updatedLink, context) => {
      if (context?.previousLinks) {
        queryClient.setQueryData(["links", uid], context.previousLinks)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["links", uid] })
    },
  })
}

// 링크 삭제 훅 (옵티미스틱 업데이트)
export function useDeleteLink(uid: string | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      if (!uid) throw new Error("사용자 인증 정보가 없습니다.")
      const linkRef = doc(db, "users", uid, "links", id)
      await deleteDoc(linkRef)
      return id
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["links", uid] })
      const previousLinks = queryClient.getQueryData<Link[]>(["links", uid])

      queryClient.setQueryData<Link[]>(["links", uid], (old) => {
        if (!old) return old
        return old.filter((link) => link.id !== id)
      })

      return { previousLinks }
    },
    onError: (err, id, context) => {
      if (context?.previousLinks) {
        queryClient.setQueryData(["links", uid], context.previousLinks)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["links", uid] })
    },
  })
}
