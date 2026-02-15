import { Injectable, NotFoundException } from '@nestjs/common';
import { AudienceMode, StoryType } from './dto/public-query.dto';

type RaceSeed = {
  id: string;
  raceDate: string;
  raceNo: number;
  startTime: string;
  distance: number;
  grade: string;
  title: string;
  storyLink: number;
  themeTag: number;
  beginnerFriendly: number;
  audienceModes: AudienceMode[];
  reasons: string[];
};

@Injectable()
export class PublicService {
  private readonly dates = ['2026-02-21', '2026-02-22'];

  private readonly races: RaceSeed[] = [
    {
      id: 'd9b31dca-2894-4e8f-93a5-79ec3c00f601',
      raceDate: '2026-02-21',
      raceNo: 8,
      startTime: '14:30:00',
      distance: 1400,
      grade: 'Class 3',
      title: '겨울 스프린트 챌린지',
      storyLink: 3,
      themeTag: 2,
      beginnerFriendly: 2,
      audienceModes: [AudienceMode.beginner, AudienceMode.date, AudienceMode.photo],
      reasons: ['라이벌 스토리 2건 연결', '초보 설명 카드 연결', '피크타임 관람 추천'],
    },
    {
      id: '9e862df6-2fba-43ca-84f4-e2f4f7df66be',
      raceDate: '2026-02-21',
      raceNo: 10,
      startTime: '15:40:00',
      distance: 1800,
      grade: 'Class 2',
      title: '서울 패밀리 컵',
      storyLink: 2,
      themeTag: 1,
      beginnerFriendly: 2,
      audienceModes: [AudienceMode.family, AudienceMode.beginner, AudienceMode.indoor],
      reasons: ['가족 모드 추천 태그', '실내석 동선 안내와 연결'],
    },
    {
      id: '87ce8abf-6de7-486d-8f5b-c86f3f027ab7',
      raceDate: '2026-02-22',
      raceNo: 6,
      startTime: '13:20:00',
      distance: 1200,
      grade: 'Class 4',
      title: '선데이 루키 매치',
      storyLink: 1,
      themeTag: 2,
      beginnerFriendly: 1,
      audienceModes: [AudienceMode.beginner, AudienceMode.family],
      reasons: ['데뷔/복귀 테마 집중 관전 카드 제공'],
    },
  ];

  private readonly stories = [
    {
      id: 'story-1',
      type: StoryType.horse,
      title: '돌아온 스프린터 "은빛질주"',
      body: '최근 공백을 깨고 복귀하는 단거리 강자 이야기',
      tags: ['comeback', 'beginner'],
    },
    {
      id: 'story-2',
      type: StoryType.jockey,
      title: '베테랑 기수의 코너 공략 포인트',
      body: '초보도 쉽게 볼 수 있는 관전 포인트 정리',
      tags: ['guide', 'family'],
    },
    {
      id: 'story-3',
      type: StoryType.race,
      title: '라이벌 구도가 재밌는 오늘의 한 판',
      body: '두 말의 최근 기록 비교로 보는 재미 요소',
      tags: ['rivalry', 'date'],
    },
  ];

  getDates() {
    return { dates: this.dates };
  }

  getRacesByDate(date: string) {
    return this.races.filter((race) => race.raceDate === date);
  }

  private getPeakTimeScore(startTime: string) {
    return startTime >= '14:00:00' && startTime <= '16:00:00' ? 1 : 0;
  }

  private getModeMatchScore(mode: AudienceMode | undefined, race: RaceSeed) {
    if (!mode) {
      return 0;
    }

    return race.audienceModes.includes(mode) ? 2 : 0;
  }

  getRecommendations(date: string, mode?: AudienceMode, limit = 5) {
    const items = this.getRacesByDate(date)
      .map((race) => {
        const peakTime = this.getPeakTimeScore(race.startTime);
        const modeMatch = this.getModeMatchScore(mode, race);
        const score = race.storyLink + race.themeTag + race.beginnerFriendly + peakTime + modeMatch;

        return {
          ...race,
          score,
          scoreBreakdown: {
            storyLink: race.storyLink,
            themeTag: race.themeTag,
            beginnerFriendly: race.beginnerFriendly,
            peakTime,
            modeMatch,
          },
        };
      })
      .filter((race) => (mode ? race.audienceModes.includes(mode) : true))
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (a.startTime !== b.startTime) return a.startTime.localeCompare(b.startTime);
        return a.raceNo - b.raceNo;
      })
      .slice(0, limit);

    return { items };
  }

  getRaceDetail(raceId: string) {
    const race = this.races.find((item) => item.id === raceId);
    if (!race) {
      throw new NotFoundException('Race not found');
    }

    return {
      ...race,
      recommendationReasons: race.reasons,
      seatGuideHint: '가족/데이트 모드라면 실내석 B를 먼저 확인하세요.',
      stories: this.stories.filter((story) => race.reasons.some((reason) => reason.includes('스토리')) || story.type !== StoryType.race),
    };
  }

  getParticipants(raceId: string) {
    const exists = this.races.some((race) => race.id === raceId);
    if (!exists) {
      throw new NotFoundException('Race not found');
    }

    return [
      { gate: 2, horse: '은빛질주', jockey: '김민수', trainer: '박정훈' },
      { gate: 7, horse: '한강스톰', jockey: '이수현', trainer: '정우진' },
    ];
  }

  getStories(type?: StoryType, query?: string, tags?: string) {
    const tagsFilter = tags?.split(',').map((item) => item.trim()).filter(Boolean) ?? [];

    const items = this.stories.filter((story) => {
      const typeOk = type ? story.type === type : true;
      const queryOk = query
        ? `${story.title} ${story.body}`.toLowerCase().includes(query.toLowerCase())
        : true;
      const tagsOk = tagsFilter.length > 0 ? tagsFilter.every((tag) => story.tags.includes(tag)) : true;

      return typeOk && queryOk && tagsOk;
    });

    return { items };
  }

  getSeatGuide(mode: AudienceMode) {
    const guideMap: Record<AudienceMode, { zone: string; title: string; body: string; tips: string[] }> = {
      beginner: {
        zone: '실내 B구역',
        title: '초보 친화 좌석',
        body: '전광판과 트랙 시야가 균형 잡힌 구역입니다.',
        tips: ['레이스 20분 전 자리 확보', '첫 방문은 실내 동선 우선'],
      },
      family: {
        zone: '가족석 C구역',
        title: '가족 관람 최적 동선',
        body: '푸드존, 휴게 공간, 실내 화장실 접근이 편리합니다.',
        tips: ['유모차 이동 동선 우선 체크', '피크타임 전 간식 구매'],
      },
      date: {
        zone: '테라스 A구역',
        title: '데이트 뷰 포인트',
        body: '트랙 전경과 사진 포인트가 좋은 구역입니다.',
        tips: ['역광 시간대 확인', '레이스 전후 산책 동선 추천'],
      },
      photo: {
        zone: '코너뷰 D구역',
        title: '사진 촬영 추천 좌석',
        body: '코너 진입 구간을 포착하기 좋은 시야를 제공합니다.',
        tips: ['망원 렌즈 권장', '연사 타이밍은 3코너 진입'],
      },
      indoor: {
        zone: '실내 B구역',
        title: '실내 관람 추천',
        body: '날씨 영향이 적고 편의시설 접근성이 좋습니다.',
        tips: ['혼잡 시간대 좌석 선점', '출입구 가까운 좌석 우선'],
      },
    };

    return { mode, ...guideMap[mode] };
  }

  getEvents(date?: string) {
    const items = [
      {
        id: 'event-1',
        eventDate: '2026-02-21',
        title: '주말 푸드 트럭 페스티벌',
        category: 'food',
        place: '중앙광장',
      },
      {
        id: 'event-2',
        eventDate: '2026-02-22',
        title: '어린이 체험 이벤트',
        category: 'family',
        place: '패밀리존',
      },
    ];

    return {
      items: date ? items.filter((event) => event.eventDate === date) : items,
    };
  }
}
