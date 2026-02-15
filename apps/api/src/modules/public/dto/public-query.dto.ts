import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export enum AudienceMode {
  beginner = 'beginner',
  date = 'date',
  family = 'family',
  photo = 'photo',
  indoor = 'indoor',
}

export enum StoryType {
  horse = 'horse',
  jockey = 'jockey',
  trainer = 'trainer',
  race = 'race',
}

export class DateQueryDto {
  @IsDateString()
  date!: string;
}


export class OptionalDateQueryDto {
  @IsOptional()
  @IsDateString()
  date?: string;
}

export class RecommendationQueryDto extends DateQueryDto {
  @IsOptional()
  @IsEnum(AudienceMode)
  mode?: AudienceMode;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  limit = 5;
}

export class StoryQueryDto {
  @IsOptional()
  @IsEnum(StoryType)
  type?: StoryType;

  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsString()
  tags?: string;
}

export class SeatGuideQueryDto {
  @IsEnum(AudienceMode)
  mode!: AudienceMode;
}
