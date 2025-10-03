import { ApiProperty } from '@nestjs/swagger';

export class VersionCheckResponseDto {
  @ApiProperty({
    example: '1.0.1',
    description: '최신 버전',
  })
  latestVersion: string;

  @ApiProperty({
    example: '1.0.0',
    description: '최소 지원 버전',
  })
  minimumVersion: string;

  @ApiProperty({
    example: false,
    description: '업데이트가 필요한지 여부',
  })
  needsUpdate: boolean;

  @ApiProperty({
    example: false,
    description: '강제 업데이트가 필요한지 여부',
  })
  forceUpdate: boolean;

  @ApiProperty({
    example: 'https://apps.apple.com/app/xrp-monitor/id123456789',
    description: '다운로드 URL',
    nullable: true,
  })
  downloadUrl: string | null;

  @ApiProperty({
    example: ['버그 수정', '성능 개선', '새로운 기능 추가'],
    description: '릴리스 노트',
    nullable: true,
  })
  releaseNotes: string[] | null;
}

export class CreateVersionDto {
  @ApiProperty({
    example: '1.0.1',
    description: '버전',
  })
  version: string;

  @ApiProperty({
    example: 'ios',
    description: '플랫폼',
    enum: ['ios', 'android', 'web'],
  })
  platform: string;

  @ApiProperty({
    example: '1.0.0',
    description: '최소 지원 버전',
  })
  minimumVersion: string;

  @ApiProperty({
    example: false,
    description: '강제 업데이트 여부',
    required: false,
  })
  forceUpdate?: boolean;

  @ApiProperty({
    example: '버그 수정 및 성능 개선',
    description: '릴리스 노트',
    required: false,
  })
  releaseNotes?: string;

  @ApiProperty({
    example: 'https://apps.apple.com/app/xrp-monitor/id123456789',
    description: '다운로드 URL',
    required: false,
  })
  downloadUrl?: string;
}
