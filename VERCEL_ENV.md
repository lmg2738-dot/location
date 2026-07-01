# Vercel 환경변수 등록 가이드

> 실제 키 값은 Vercel Dashboard → Settings → Environment Variables 에만 등록하세요.
> GitHub, README, 코드에 절대 포함하지 마세요.

## 필수 (현재 제공된 키)

| Vercel 환경변수명 | 설명 | 노출 |
|------------------|------|------|
| `KAKAO_REST_API_KEY` | 카카오 REST API (주소·경쟁업체) | Server only |
| `NEXT_PUBLIC_KAKAO_MAP_KEY` | 카카오 JavaScript 키 (지도) | Client |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | Client |
| `OPENROUTER_API_KEY` | OpenRouter API (무료 AI 모델) | Server only |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 서비스 롤 키 | Server only |

## 추가로 필요

| Vercel 환경변수명 | 설명 | 발급 위치 |
|------------------|------|----------|
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public 키 | Supabase → Settings → API |

## 앱 설정

| Vercel 환경변수명 | Production 값 |
|------------------|---------------|
| `NEXT_PUBLIC_MOCK_MODE` | `false` |
| `NEXT_PUBLIC_APP_URL` | 배포 URL (예: `https://xxx.vercel.app`) |

## 선택 (공공데이터)

| Vercel 환경변수명 | API |
|------------------|-----|
| `MOLIT_REAL_ESTATE_API_KEY` | 국토부 실거래가 |
| `SMALL_BUSINESS_API_KEY` | 소상공인365 |
| `TOUR_API_KEY` | TourAPI |
| `WEATHER_API_KEY` | 기상청 |

## OpenRouter 무료 모델

- 과금 0원 모델만 자동 선택
- 사용 불가 모델은 자동 제외 후 fallback
