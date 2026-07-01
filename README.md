# location

AI 창업 입지 분석 SaaS — LocationAI

## 주요 기능

- **주소 검색** - Kakao Map API 기반 주소/좌표 변환
- **상권 데이터 수집** - 유동인구, 경쟁업체, 프랜차이즈 비율, 실거래가, 관광객, 기상 데이터
- **AI 창업 점수** - GPT 기반 100점 만점 평가 (장점/단점/주의사항/추천업종)
- **지도 시각화** - Kakao Map에 분석 위치 및 경쟁업체 표시
- **대시보드** - 분석 통계, 일일 사용량, 최근 분석
- **히스토리** - 이전 분석 결과 저장 및 조회
- **구독 플랜** - 무료(3회/일), 프리미엄(39,000원), 기업(300,000원)
- **관리자 페이지** - 사용자/분석 관리

## 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, Shadcn UI |
| Backend | Next.js API Routes |
| Database | Supabase (PostgreSQL + Auth) |
| AI | OpenAI GPT-4o-mini |
| Map | Kakao Map API |

## 연동 API

| API | 용도 |
|-----|------|
| 공정위 FairData | 프랜차이즈 정보 |
| 소상공인365 | 상권/매출 데이터 |
| 국토부 실거래가 | 임대료/보증금 |
| KOSIS | 통계 데이터 |
| 기상청 | 기상/계절성 |
| TourAPI | 관광객 데이터 |
| Kakao Local/Map | 주소검색, 경쟁업체, 지도 |

## 시작하기

### 1. 의존성 설치

```bash
cd location-ai
npm install
```

### 2. 환경변수 설정

```bash
cp .env.example .env.local
```

`.env.local` 파일에 API 키를 설정하세요. API 키 없이도 Mock 데이터로 동작합니다.

### 3. Supabase 설정

1. [Supabase](https://supabase.com)에서 프로젝트 생성
2. `supabase/schema.sql` 실행
3. `.env.local`에 Supabase URL/Key 입력

### 4. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인

## 프로젝트 구조

```
location-ai/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── api/              # API Routes
│   │   │   ├── analyze/      # AI 분석 엔드포인트
│   │   │   ├── search/       # 주소 검색
│   │   │   ├── dashboard/    # 대시보드 데이터
│   │   │   └── admin/        # 관리자 API
│   │   ├── auth/             # 로그인/회원가입
│   │   ├── dashboard/        # 사용자 대시보드
│   │   ├── history/          # 분석 히스토리
│   │   ├── pricing/          # 요금제
│   │   └── admin/            # 관리자 페이지
│   ├── components/
│   │   ├── ui/               # Shadcn UI 컴포넌트
│   │   ├── analysis/         # 분석 관련 컴포넌트
│   │   ├── map/              # Kakao Map
│   │   └── layout/           # Header 등
│   ├── lib/
│   │   ├── apis/             # 외부 API 연동
│   │   ├── ai/               # OpenAI 분석
│   │   └── supabase/         # Supabase 클라이언트
│   └── types/                # TypeScript 타입
├── supabase/
│   └── schema.sql            # DB 스키마
└── .env.example
```

## API 키 발급

| 서비스 | 발급처 |
|--------|--------|
| Kakao Map | https://developers.kakao.com |
| OpenAI | https://platform.openai.com |
| 공공데이터포털 | https://www.data.go.kr |
| Supabase | https://supabase.com |

## 수익 모델

- **무료**: 하루 3회 분석
- **프리미엄**: 월 39,000원, 하루 100회
- **기업**: 월 300,000원, 무제한 + API

## 라이선스

Private - All rights reserved
