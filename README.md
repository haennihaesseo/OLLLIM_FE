# 올림 (OLLIM) - 음성 편지 서비스

<p align="center">
  <img src="public/full_logo.svg" alt="올림 로고" width="160" />
</p>

<p align="center">
  목소리로 마음을 전하는 음성 편지 서비스
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.1.4-000000?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss" alt="Tailwind CSS" />
</p>

---

## 소개

**올림**은 목소리로 마음을 전하는 음성 편지 서비스입니다. 사용자가 음성을 녹음하면, AI가 목소리 특성을 분석하여 어울리는 폰트를 추천해줍니다. BGM, 편지지 템플릿, 폰트를 자유롭게 커스터마이징하여 나만의 특별한 편지를 만들고, 링크 또는 NFC 카세트 키링을 통해 상대방에게 전달할 수 있습니다.

### 주요 기능

- **음성 녹음** - 실시간 파형 시각화와 함께 목소리를 녹음
- **AI 폰트 추천** - 음성 분석을 기반으로 어울리는 폰트 자동 추천
- **편지 커스터마이징** - BGM, 폰트, 편지지 템플릿을 자유롭게 선택
- **편지 공유** - 링크 공유 및 NFC 카세트 키링을 통한 실물 전달
- **편지 보관함** - 받은 편지를 모아보는 아카이브

---

## 편지 작성 플로우

올림은 4단계 위자드 형태의 편지 작성 플로우를 제공합니다.

```
녹음 → 편집 → 분석 → 선택
```

| 단계 | 경로 | 설명 |
|------|------|------|
| 1. 녹음 | `/letter/new/record` | 음성 녹음 (일시정지/재개 지원) |
| 2. 편집 | `/letter/new/edit` | 편지 내용 작성 + 음성 재생 |
| 3. 분석 | `/letter/new/analyze` | AI 기반 폰트 추천 |
| 4. 선택 | `/letter/new/select` | BGM, 폰트, 편지지 커스터마이징 |

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| **프레임워크** | Next.js 16.1.4 (App Router) + React 19 |
| **언어** | TypeScript 5 |
| **상태 관리** | Jotai 2 (UI 상태) + TanStack Query 5 (서버 상태) |
| **스타일링** | Tailwind CSS 4 + shadcn/ui + CVA |
| **HTTP 클라이언트** | Axios 1.13 |
| **애니메이션** | Framer Motion 12 |
| **알림** | Sonner 2 (토스트) |
| **아이콘** | Lucide React |
| **UI 프리미티브** | Radix UI (Dialog, Progress, Slot) |
| **테스트** | Cypress 14 (E2E) |
| **컴포넌트 문서화** | Storybook 10 |

---

## 시작하기

### 사전 요구 사항

- Node.js 18 이상
- npm

### 설치

```bash
# 저장소 클론
git clone https://github.com/haennihaesseo/OLLIM-FE.git
cd OLLIM-FE

# 의존성 설치
npm install
```

### 환경 변수

프로젝트 루트에 `.env.local` 파일을 생성합니다.

```env
NEXT_PUBLIC_API_URL=<백엔드 API URL>
```

### 실행

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린트 검사
npm run lint

# 스토리북 실행
npm run storybook
```

---

## 프로젝트 구조

```
OLLIM-FE/
├── app/                          # Next.js App Router 페이지
│   ├── layout.tsx                # 루트 레이아웃 (Provider, Auth)
│   ├── page.tsx                  # 홈 페이지
│   ├── login/                    # 로그인
│   └── letter/
│       ├── new/                  # 편지 작성 4단계 위자드
│       │   ├── record/           # 1단계: 음성 녹음
│       │   ├── edit/             # 2단계: 편지 편집
│       │   ├── analyze/          # 3단계: 폰트 추천
│       │   └── select/           # 4단계: 커스터마이징
│       └── (with-home-header)/   # 홈 헤더 레이아웃 그룹
│           ├── [id]/             # 편지 상세
│           ├── archive/          # 편지 보관함
│           ├── complete/         # 편지 완성/공유
│           ├── onboarding/       # 온보딩
│           └── shop/             # NFC 굿즈 샵
├── components/                   # 컴포넌트 (기능별 구성)
│   ├── analyze/                  # 폰트 추천 UI
│   ├── edit/                     # 편지 편집기
│   ├── record/                   # 녹음기 + 파형 시각화
│   ├── select/                   # BGM/폰트/편지지 탭
│   ├── common/                   # 공통 컴포넌트 (Header, 버튼 등)
│   ├── home/                     # 홈 페이지 컴포넌트
│   ├── letter/                   # 편지 표시 컴포넌트
│   ├── layout/                   # 레이아웃 (ResponsiveLayout)
│   └── ui/                       # shadcn/ui 라이브러리
├── hooks/                        # 커스텀 React 훅
│   ├── apis/                     # React Query 훅 (HTTP 메서드별)
│   │   ├── get/                  # GET 요청 훅
│   │   └── post/                 # POST 요청 훅
│   ├── auth/                     # 인증 훅
│   ├── common/                   # 유틸리티 훅
│   └── record/                   # 녹음 관련 훅
├── store/                        # Jotai 전역 상태
│   ├── auth.ts                   # 인증 토큰 atom
│   ├── letterAtoms.ts            # 편지 ID atom
│   └── recordingAtoms.ts        # 녹음 상태 atom
├── lib/                          # 유틸리티 함수
├── types/                        # TypeScript 타입 정의
├── providers/                    # React Provider
│   ├── QueryProvider.tsx         # TanStack Query 설정
│   └── AuthProvider.tsx          # 인증 Provider
└── public/                       # 정적 에셋 (로고, 폰트, GIF)
```

---

## 아키텍처

### 이중 레이어 상태 관리

- **Jotai** - UI 상태 관리 (인증 토큰, 편지 ID, 녹음 상태)
- **TanStack Query** - 서버 상태 관리 (API 캐싱, 자동 갱신)

### API 통합 패턴

모든 API 훅은 `/hooks/apis/{method}/` 구조를 따릅니다.

```typescript
// 예시: GET 훅
export function useGetLetterData(letterId: string) {
  return useQuery({
    queryKey: ["letterData", letterId],
    queryFn: async () => {
      const response = await client.get<ApiResponse<LetterData>>(`/api/letter/${letterId}`);
      return response.data.data;
    },
    enabled: !!letterId,
  });
}
```

### 인증 플로우

1. URL 파라미터 `tmpKey`로 토큰 발급
2. accessToken은 Jotai atom, refreshToken은 sessionStorage에 저장
3. 토큰 만료 시 자동 갱신

### 컴포넌트 설계

- **기능 기반 구성** - 타입이 아닌 기능별로 컴포넌트 분류
- **Container/Presentational 패턴** - 로직과 표현의 분리
- **Client Component** - 상호작용이 필요한 컴포넌트에 `"use client"` 지시어 사용

---

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 (Hot Reload) |
| `npm run build` | 프로덕션 빌드 |
| `npm start` | 프로덕션 서버 실행 |
| `npm run lint` | ESLint 검사 |
| `npm run storybook` | Storybook 개발 서버 |
| `npm run build-storybook` | Storybook 정적 빌드 |
