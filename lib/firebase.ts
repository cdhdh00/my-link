import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, type Analytics } from "firebase/analytics";

// 환경 변수 기반 Firebase 설정 구성
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Next.js Hot Module Replacement(HMR) 및 SSR 대응을 위한 싱글톤 초기화
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Authentication(인증) 및 Firestore(데이터베이스) 객체 초기화
const auth = getAuth(app);
const db = getFirestore(app);

// 구글 소셜 로그인 제공자 객체
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" }); // 항상 계정 선택 창이 뜨도록 설정

// Analytics 초기화 (SSR 환경 에러 방지를 위해 클라이언트 브라우저 환경에서만 동작하도록 처리)
let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, auth, db, googleProvider, analytics };
