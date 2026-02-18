import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  DateQueryDto,
  RecommendationQueryDto,
  SeatGuideQueryDto,
  StoryQueryDto,
  OptionalDateQueryDto,
} from './dto/public-query.dto';
import { PublicService } from './public.service';

@Controller()
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('dates')
  getDates() {
    return this.publicService.getDates();
  }

  @Get('recommendations')
  getRecommendations(@Query() query: RecommendationQueryDto) {
    return this.publicService.getRecommendations(query.date, query.mode, query.limit);
  }

  @Get('races')
  getRaces(@Query() query: DateQueryDto) {
    return this.publicService.getRacesByDate(query.date);
  }

  @Get('races/:raceId')
  getRaceDetail(@Param('raceId') raceId: string) {
    return this.publicService.getRaceDetail(raceId);
  }

  @Get('races/:raceId/participants')
  getParticipants(@Param('raceId') raceId: string) {
    return this.publicService.getParticipants(raceId);
  }

  @Get('stories')
  getStories(@Query() query: StoryQueryDto) {
    return this.publicService.getStories(query.type, query.query, query.tags);
  }

  @Get('guides/seats')
  getSeatGuide(@Query() query: SeatGuideQueryDto) {
    return this.publicService.getSeatGuide(query.mode);
  }

  @Get('events')
  getEvents(@Query() query: OptionalDateQueryDto) {
    return this.publicService.getEvents(query.date);
  }
}
