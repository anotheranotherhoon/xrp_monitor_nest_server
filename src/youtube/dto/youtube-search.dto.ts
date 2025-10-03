import { ApiProperty } from '@nestjs/swagger';

class YoutubeThumbnailDto {
  @ApiProperty({ example: 'https://i.ytimg.com/vi/VIDEO_ID/default.jpg' })
  url: string;

  @ApiProperty({ example: 120 })
  width: number;

  @ApiProperty({ example: 90 })
  height: number;
}

class YoutubeThumbnailsDto {
  @ApiProperty({ type: YoutubeThumbnailDto })
  default: YoutubeThumbnailDto;

  @ApiProperty({ type: YoutubeThumbnailDto, required: false })
  medium?: YoutubeThumbnailDto;

  @ApiProperty({ type: YoutubeThumbnailDto, required: false })
  high?: YoutubeThumbnailDto;
}

export class YoutubeSearchItemDto {
  @ApiProperty({ example: 'dQw4w9WgXcQ', description: 'Youtube 동영상 ID' })
  yoVideoId: string;

  @ApiProperty({
    example: 'XRP 급등 소식과 리플 최신 이슈',
    description: 'Youtube 동영상 제목',
  })
  yoTitle: string;

  @ApiProperty({
    example: '리플(XRP) 가격 급등 관련 소식 정리...',
    description: 'Youtube 동영상 설명',
  })
  yoDescription: string;

  @ApiProperty({
    example: '2024-01-01T12:34:56Z',
    description: 'Youtube 동영상 작성 시간',
  })
  yoCreatedAt: string;

  @ApiProperty({
    example: 'UC_x5XG1OV2P6uZZ5FSM9Ttw',
    description: 'Youtube 채널 ID',
  })
  yoChannelId: string;

  @ApiProperty({ example: '크립토 채널', description: 'Youtube 채널 제목' })
  yoChannelTitle: string;

  @ApiProperty({ type: YoutubeThumbnailsDto })
  thumbnails: YoutubeThumbnailsDto;
}

export class YoutubeSearchResponseDto {
  @ApiProperty({
    example: 'CAoQAA',
    nullable: true,
    description: '다음 호출에 사용할 커서(없으면 null)',
  })
  nextCursorId: string | null;

  @ApiProperty({ example: 10, description: '이번 응답의 아이템 개수' })
  pageSize: number;

  @ApiProperty({
    example: 100000,
    required: false,
    description: '전체 개수(알 수 없으면 생략)',
  })
  total?: number;

  @ApiProperty({ type: [YoutubeSearchItemDto] })
  items: YoutubeSearchItemDto[];
}
