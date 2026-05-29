# 📝 GEMINI.md - 마이링크 (MyLink) 프로젝트 가이드

이 파일은 **마이링크(MyLink)** 프로젝트의 구조, 기술 스택, 개발 컨벤션 및 주요 명령어를 정의합니다. 모든 작업은 이 가이드를 최우선으로 참고하여 진행합니다.

---

## 🚀 프로젝트 개요
- **서비스명:** 마이링크 (MyLink)
- **목적:** 다양한 소셜 미디어, 블로그, 포트폴리오 링크를 하나의 단일 URL로 관리하는 서비스.
- **핵심 가치:** 100% 무료, 심플한 사용자 경험, 자동 파비콘 추출 기능.
- **주요 기능:** Google 소셜 로그인, 고유 URL 제공, 프로필 및 링크 관리 시스템.

---

## 🛠 기술 스택
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4, shadcn/ui
- **Icons:** Remix Icon (`@remixicon/react`)
- **Validation:** ESLint, Prettier, TypeScript Typecheck

---

## 📂 프로젝트 구조
- `@app/`: Next.js App Router 기반의 페이지 및 레이아웃.
- `@components/`: 재사용 가능한 UI 컴포넌트.
  - `@components/ui/`: shadcn/ui 기반의 원자 단위 컴포넌트.
- `@docs/`: 프로젝트 요구사항(PRD), 유저 시나리오, 와이어프레임 등 설계 문서.
- `@hooks/`: 커스텀 React Hooks.
- `@lib/`: 유틸리티 함수 및 설정 파일.
- `@public/`: 정적 자산(이미지, 파비콘 등).

---

## ⌨️ 주요 명령어
| 명령어 | 설명 |
| :--- | :--- |
| `npm run dev` | 개발 서버 실행 (Turbopack 사용) |
| `npm run build` | 프로덕션 빌드 생성 |
| `npm run start` | 빌드된 프로덕션 서버 실행 |
| `npm run lint` | 코드 린팅 (ESLint) |
| `npm run format` | 코드 포맷팅 (Prettier) |
| `npm run typecheck` | TypeScript 타입 체크 |

---

## 🎨 개발 컨벤션 및 원칙

### 1. 코드 스타일 및 품질
- **Strict TypeScript:** 모든 변수와 함수에 명시적인 타입을 지정합니다. `any` 사용을 지양합니다.
- **Component Design:** 컴포넌트는 단일 책임 원칙을 따르며, 재사용 가능하도록 설계합니다.
- **Tailwind CSS:** 스타일링은 가급적 Tailwind 클래스만 사용하며, 복잡한 조건부 클래스는 `cn()` 유틸리티를 활용합니다.
- **Formatting:** 저장 시 Prettier가 자동 적용되도록 설정하며, 커밋 전 `npm run format`을 실행합니다.

### 2. UI/UX 원칙
- **shadcn/ui 활용:** 새로운 UI 요소가 필요할 때 `npx shadcn@latest add [component]`를 통해 추가합니다.
- **Responsive Design:** 모든 화면은 모바일 우선(Mobile-First)으로 설계합니다.
- **Accessibility:** 스크린 리더 지원 및 키보드 네비게이션을 고려합니다.

### 3. 기능 구현 지침
- **Google Favicon API:** 링크 등록 시 아이콘 추출을 위해 `https://www.google.com/s2/favicons?domain=[domain]&sz=64` 패턴을 활용합니다.
- **Safe Navigation:** 외부 링크 클릭 시 반드시 `target="_blank"` 및 `rel="noopener noreferrer"`를 적용합니다.

### 4. 언어 및 커뮤니케이션 지침
- **Korean First:** 모든 문서 작성, 코드 주석, AI와의 대화 및 작업 결과물(계획, 테스크, 워크스루 등)은 반드시 한글을 사용합니다.
- **Commit Messages:** 커밋 메시지는 상세하게 한글로 작성합니다.

---

## 📚 참고 문서
- [제품 요구사항 정의서 (PRD)](@docs/PRD.md)
- [사용자 시나리오](@docs/user_scenario.md)
- [와이어프레임](@docs/wireframe.md)

---

## 🛠 유지보수 가이드
- 새로운 기능을 추가하기 전 항상 `@docs/` 폴더의 설계 문서를 검토합니다.
- UI 수정 시 `@components.json`의 설정을 변경하지 않도록 주의합니다.
- 의존성 추가 시 `@package.json`의 버전을 확인하고 가급적 최신 안정 버전을 사용합니다.
