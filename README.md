# Seoul Derby Viewer MVP (Auth-free first)

서울 경마공원 초보 관람객을 위한 **관람 추천 웹앱**의 초기 구현 버전입니다.

## Scope (현재 구현 범위)

- 로그인/회원 기능 제외
- 날짜별 레이스 목록 조회
- 추천 레이스 TOP N 조회
- 레이스 상세 + 관전 포인트 + 참가 주체 카드 조회
- 스토리(말/기수/조교사/레이스) 조회
- 좌석/동선 가이드 조회
- 이벤트/푸드 정보 조회

## Implemented now

- `apps/api`: NestJS Public API 모듈 + ValidationPipe + mock 추천 로직
  - `/v1/dates`
  - `/v1/recommendations`
  - `/v1/races`
  - `/v1/races/:raceId`
  - `/v1/races/:raceId/participants`
  - `/v1/stories`
  - `/v1/guides/seats`
  - `/v1/events`
- `prisma/schema.prisma`: MVP DB 스키마 초안
- `docs/api-public.yaml`: Public API OpenAPI 스펙
- `docs/ia.md`: 화면 IA + 사용자 플로우
- `docs/recommendation-rules.md`: 룰 기반 추천 점수 정의

## Quick start (API)

```bash
cd apps/api
npm install
npm run start:dev
```

앱 실행 후 `http://localhost:3000/v1/dates` 등으로 확인할 수 있습니다.

## Next step

1. PublicService의 mock 데이터를 Prisma 조회로 교체
2. 추천 점수 배치(하루 1회) 및 import-trigger 재계산 추가
3. CSV 임포트(admin) 추가
4. Next.js 화면 6개 라우팅 연결
5. 로그인/즐겨찾기/플래너는 2차 스프린트에서 추가


## GitHub 업로드 가이드

- GitHub Desktop으로 올리는 방법: `docs/github-desktop-publish.md`
