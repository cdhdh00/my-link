"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  RiLoader4Line,
  RiGoogleFill,
  RiSparklingLine,
  RiLinksLine,
  RiShieldUserLine,
  RiSmartphoneLine,
  RiArrowDownSLine,
  RiCheckLine,
  RiYoutubeFill,
  RiInstagramLine,
  RiGithubFill,
  RiGlobalLine,
  RiArrowRightLine
} from "@remixicon/react"

interface LandingSectionProps {
  onLogin: () => void
  isLoggingIn: boolean
}

export function LandingSection({ onLogin, isLoggingIn }: LandingSectionProps) {
  const [nickname, setNickname] = useState("")
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index)
  }

  // 가상 디바이스 목업 내 링크 목록
  const demoLinks = [
    { title: "인스타그램", url: "instagram.com/myprofile", icon: <RiInstagramLine className="h-5 w-5 text-pink-500" />, bg: "hover:bg-pink-50/50 dark:hover:bg-pink-950/20" },
    { title: "유튜브 채널", url: "youtube.com/c/mychannel", icon: <RiYoutubeFill className="h-5 w-5 text-red-500" />, bg: "hover:bg-red-50/50 dark:hover:bg-red-950/20" },
    { title: "깃허브 포트폴리오", url: "github.com/myrepo", icon: <RiGithubFill className="h-5 w-5 text-slate-800 dark:text-slate-100" />, bg: "hover:bg-slate-100/50 dark:hover:bg-slate-800/20" },
    { title: "개인 블로그", url: "myblog.me", icon: <RiGlobalLine className="h-5 w-5 text-blue-500" />, bg: "hover:bg-blue-50/50 dark:hover:bg-blue-950/20" }
  ]

  // 자주 묻는 질문
  const faqs = [
    {
      q: "정말 100% 평생 무료인가요?",
      a: "네, 그렇습니다! 마이링크는 제한 없이 누구나 100% 무료로 사용할 수 있으며, 향후에도 핵심 소셜 링크 서비스에 대해 결제나 유료 구독을 강제하지 않습니다."
    },
    {
      q: "사용할 수 있는 링크 개수 제한이 있나요?",
      a: "아니요, 제한이 없습니다. 필요한 만큼 무제한으로 소셜 미디어, 블로그, 포트폴리오 등의 링크를 등록하여 사용자들에게 자유롭게 제공할 수 있습니다."
    },
    {
      q: "자동 파비콘 기능은 무엇인가요?",
      a: "도메인 주소(예: github.com)를 입력하시면 마이링크가 해당 사이트의 공식 파비콘을 자동으로 탐색하여 아이콘으로 자동 매칭해줍니다. 사용자가 직접 이미지를 제작하여 등록하는 번거로움을 줄여줍니다."
    },
    {
      q: "통계 및 클릭수 분석도 무료인가요?",
      a: "네, 기본으로 제공됩니다! 각 링크 카드를 사용자가 언제 얼마나 클릭했는지 상세한 트래킹을 대시보드 및 별도 통계 페이지를 통해 완전 무료로 확인하실 수 있습니다."
    }
  ]

  return (
    <div className="w-full max-w-[1080px] space-y-24 py-10">
      
      {/* 1. 히어로 섹션 */}
      <section className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        {/* 그라데이션 블롭 배경 */}
        <div className="absolute -top-20 -left-20 -z-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl dark:bg-primary/10" />
        <div className="absolute top-40 right-10 -z-10 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-950/10" />

        <div className="space-y-6 text-left lg:col-span-7">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary dark:bg-primary/25">
            <RiSparklingLine size={13} className="animate-pulse text-primary" />
            <span>나만의 링크를 단 하나로 연결하다</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl dark:text-white leading-[1.15]">
            모든 소셜과 포트폴리오를
            <br />
            <span className="bg-gradient-to-r from-primary via-indigo-500 to-purple-600 bg-clip-text text-transparent">
              단 하나의 링크
            </span>
            로 공유하세요
          </h1>

          <p className="text-base font-semibold leading-relaxed text-slate-500 dark:text-slate-400 max-w-[520px]">
            인스타그램, 유튜브, 블로그, 깃허브 등 흩어져 있는 나만의 가치들을 한눈에 보여주는 가장 완벽한 방법. 지금 무료로 모바일 우선 디자인의 아름다운 보드를 시작하세요.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={onLogin}
              disabled={isLoggingIn}
              className="h-14 gap-2.5 rounded-2xl bg-primary px-8 text-base font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/95 hover:shadow-xl hover:shadow-primary/30"
            >
              {isLoggingIn ? (
                <RiLoader4Line size={20} className="animate-spin" />
              ) : (
                <RiGoogleFill size={20} />
              )}
              <span>Google 계정으로 시작하기</span>
            </Button>
            
            <a href="#demo" className="inline-flex items-center justify-center h-14 rounded-2xl border border-slate-200 bg-white px-6 text-sm font-bold text-slate-600 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800">
              실시간 데모 확인
            </a>
          </div>

          <div className="flex items-center gap-6 pt-4 text-xs font-semibold text-slate-400 dark:text-slate-500">
            <div className="flex items-center gap-1.5">
              <RiCheckLine className="text-emerald-500" size={16} />
              <span>100% 무료 평생 제공</span>
            </div>
            <div className="flex items-center gap-1.5">
              <RiCheckLine className="text-emerald-500" size={16} />
              <span>무제한 링크 등록 가능</span>
            </div>
            <div className="flex items-center gap-1.5">
              <RiCheckLine className="text-emerald-500" size={16} />
              <span>실시간 통계 기능 무료</span>
            </div>
          </div>
        </div>

        {/* 인터랙티브 디바이스 목업 */}
        <div className="flex justify-center lg:col-span-5">
          <div className="relative w-full max-w-[310px] rounded-[48px] border-[12px] border-slate-900 bg-slate-950 p-3.5 shadow-2xl ring-4 ring-slate-800/30 dark:border-slate-800 dark:ring-slate-900/60 transition-transform duration-500 hover:scale-[1.02]">
            {/* 스피커 및 카메라 홈 */}
            <div className="absolute top-3.5 left-1/2 h-5 w-24 -translate-x-1/2 rounded-full bg-slate-900 dark:bg-slate-800" />
            
            {/* 폰 내부 화면 */}
            <div className="min-h-[500px] rounded-[36px] bg-slate-50 p-5 dark:bg-slate-900/40 text-center space-y-6 pt-8">
              {/* 가상 프로필 */}
              <div className="space-y-2">
                <div className="relative mx-auto h-16 w-16 rounded-[22px] bg-gradient-to-tr from-primary to-purple-500 p-0.5 shadow-md">
                  <div className="flex h-full w-full items-center justify-center rounded-[20px] bg-white dark:bg-slate-800 text-lg font-black text-primary">
                    M
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">마이링크 스타터</h3>
                  <p className="text-xs text-slate-400">@mylink_starter</p>
                </div>
              </div>

              {/* 가상 링크 카드 리스트 */}
              <div className="space-y-3">
                {demoLinks.map((dl, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3.5 rounded-2xl border border-slate-100 bg-white p-3.5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 ${dl.bg} dark:border-slate-800/80 dark:bg-slate-950 cursor-pointer`}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900">
                      {dl.icon}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{dl.title}</div>
                      <div className="text-[10px] text-slate-400 truncate">{dl.url}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-[10px] font-bold text-slate-400">
                ⚡️ Powered by MyLink
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 실시간 링크 생성 시뮬레이터 */}
      <section id="demo" className="rounded-3xl border border-slate-100 bg-white p-8 shadow-md dark:border-slate-800/50 dark:bg-slate-900/50">
        <div className="mx-auto max-w-2xl text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">나만의 고유 링크 주소 확인하기</h2>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">사용하고 싶은 닉네임을 입력해 마이링크의 고유한 도메인 주소를 미리 확인해보세요!</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
            <div className="flex flex-1 items-center rounded-2xl border border-slate-200 bg-slate-50/50 px-4 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary dark:border-slate-800 dark:bg-slate-900/60">
              <span className="text-sm font-bold text-slate-400 select-none">mylink.to/</span>
              <input
                type="text"
                placeholder="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ""))}
                className="flex-1 bg-transparent py-3.5 pl-0.5 text-sm font-bold text-slate-700 outline-hidden dark:text-slate-200"
              />
            </div>
            <Button
              onClick={onLogin}
              className="h-12 sm:h-auto rounded-2xl bg-primary px-6 text-sm font-bold text-white transition-transform active:scale-95"
            >
              사용하기 <RiArrowRightLine size={16} />
            </Button>
          </div>

          {nickname && (
            <div className="animate-in fade-in slide-in-from-top-3 duration-200 text-xs font-bold text-primary bg-primary/5 dark:bg-primary/20 inline-block px-4 py-2 rounded-full">
              ✨ 축하합니다! <span className="underline">mylink.to/{nickname}</span> 주소로 제작할 수 있습니다.
            </div>
          )}
        </div>
      </section>

      {/* 3. 혜택 카드 디자인 그리드 */}
      <section className="space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">마이링크가 제공하는 강력한 기능</h2>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">더 이상 링크 관리에 고민하지 마세요. 필요한 모든 것이 준비되어 있습니다.</p>
        </div>

        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
          <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200/50 hover:ring-primary/40 transition-all duration-300 hover:-translate-y-1 dark:bg-slate-900 dark:ring-slate-800/50">
            <CardContent className="flex flex-col items-center p-6 gap-4 text-center">
              <div className="rounded-2xl bg-blue-50 p-3 text-blue-500 dark:bg-blue-950/40">
                <RiShieldUserLine size={24} />
              </div>
              <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-base">간편한 구글 소셜 로그인</h3>
              <p className="text-xs font-semibold leading-relaxed text-slate-400 dark:text-slate-500">
                이메일 가입 번거로움 없이 Google 계정을 통해 1초 만에 안전하고 빠르게 개인 대시보드를 생성합니다.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200/50 hover:ring-primary/40 transition-all duration-300 hover:-translate-y-1 dark:bg-slate-900 dark:ring-slate-800/50">
            <CardContent className="flex flex-col items-center p-6 gap-4 text-center">
              <div className="rounded-2xl bg-purple-50 p-3 text-purple-500 dark:bg-purple-950/40">
                <RiSparklingLine size={24} />
              </div>
              <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-base">지능형 자동 파비콘 추출</h3>
              <p className="text-xs font-semibold leading-relaxed text-slate-400 dark:text-slate-500">
                주소를 등록하면 대상 도메인의 파비콘 이미지를 자동으로 인식해 아름답고 일관된 소셜 아이콘으로 구성해줍니다.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200/50 hover:ring-primary/40 transition-all duration-300 hover:-translate-y-1 dark:bg-slate-900 dark:ring-slate-800/50">
            <CardContent className="flex flex-col items-center p-6 gap-4 text-center">
              <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-500 dark:bg-emerald-950/40">
                <RiSmartphoneLine size={24} />
              </div>
              <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-base">모바일 우선 완벽한 반응형</h3>
              <p className="text-xs font-semibold leading-relaxed text-slate-400 dark:text-slate-500">
                대부분의 사용자가 모바일 환경에서 유입됩니다. 언제 어디서든 끊김 없고 미려한 화면 비율과 배치 스타일을 유지합니다.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 4. 사용 방법 (How it works) */}
      <section className="space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">어떻게 사용하나요?</h2>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">시작부터 배포까지 단 3단계로 완벽하게 구축할 수 있습니다.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="space-y-4 text-center md:text-left relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white font-black text-lg mx-auto md:mx-0 shadow-md">1</div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">구글 간편 로그인</h3>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 leading-relaxed">
              Google 소셜 로그인을 통해 1초 만에 개인화된 관리 대시보드와 대시보드 권한을 얻습니다.
            </p>
          </div>
          
          <div className="space-y-4 text-center md:text-left relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500 text-white font-black text-lg mx-auto md:mx-0 shadow-md">2</div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">링크 추가 및 정보 수정</h3>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 leading-relaxed">
              나만의 프로필 닉네임을 설정하고, 보여주고 싶은 여러 소셜 미디어나 블로그 링크를 추가합니다.
            </p>
          </div>

          <div className="space-y-4 text-center md:text-left relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600 text-white font-black text-lg mx-auto md:mx-0 shadow-md">3</div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">고유 단일 URL 공유</h3>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 leading-relaxed">
              나의 고유 주소(`mylink.to/username`)를 인스타그램 소개, 유튜브 상세페이지 등에 공유하면 끝!
            </p>
          </div>
        </div>
      </section>

      {/* 5. 자주 묻는 질문 (FAQ) - 아코디언 스타일 */}
      <section className="space-y-8 max-w-3xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">자주 묻는 질문</h2>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">마이링크에 대해 궁금한 점을 시원하게 해소해 드립니다.</p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white transition-all dark:border-slate-800/80 dark:bg-slate-900/50"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="flex w-full items-center justify-between p-5 text-left text-sm font-bold text-slate-800 dark:text-slate-200"
                >
                  <span>{faq.q}</span>
                  <RiArrowDownSLine
                    size={20}
                    className={`text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-slate-50 p-5 text-xs font-semibold leading-relaxed text-slate-500 animate-in fade-in duration-200 dark:border-slate-800/50 dark:text-slate-400">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* 6. 최종 CTA 섹션 */}
      <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-tr from-primary to-purple-600 p-8 sm:p-12 text-center text-white shadow-xl shadow-primary/10">
        <div className="absolute inset-0 -z-10 bg-slate-950/15" />
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        
        <div className="mx-auto max-w-xl space-y-6 relative">
          <h2 className="text-3xl font-extrabold sm:text-4xl tracking-tight">링크 보드를 사용할 준비가 되셨나요?</h2>
          <p className="text-sm font-semibold opacity-90 leading-relaxed">
            지금 Google 로그인으로 1초 만에 개인화된 관리 대시보드를 생성하여 나만의 단일 연결 통로를 만들어 보세요!
          </p>
          <Button
            onClick={onLogin}
            disabled={isLoggingIn}
            className="h-13 gap-2.5 rounded-2xl bg-white px-8 text-sm font-bold text-primary shadow-lg transition-transform hover:scale-102 hover:bg-slate-50 active:scale-98"
          >
            {isLoggingIn ? (
              <RiLoader4Line size={18} className="animate-spin text-primary" />
            ) : (
              <RiGoogleFill size={18} />
            )}
            <span>무료로 1초 만에 시작하기</span>
          </Button>
        </div>
      </section>

    </div>
  )
}
