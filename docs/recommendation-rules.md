# Recommendation Rules (MVP)

로그인/개인화가 없는 1차 MVP에서는 룰 기반 점수로 추천 정렬을 수행한다.

## Score

`score = storyLink + themeTag + beginnerFriendly + peakTime + modeMatch`

- `storyLink` (0~3): 연결된 스토리 수
- `themeTag` (0~2): 데뷔/복귀/라이벌/연승도전 등 태그 매칭
- `beginnerFriendly` (0~2): 초보용 설명 카드 존재 여부
- `peakTime` (0~1): 14:00~16:00 경기 가산점
- `modeMatch` (0~2): 요청한 mode와 audienceModes 매칭

## Tie-breaker

1. `score` 내림차순
2. `startTime` 오름차순
3. `raceNo` 오름차순

## Batch

- 하루 1회 `race_recommendations` 재계산
- 임포트 완료 시 해당 날짜 즉시 재계산
