import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsBoolean,
  IsIn,
  IsEnum,
} from 'class-validator';
import { DeploymentStatus } from 'src/entities/app-version.entity';

export class VersionCheckResponseDto {
  @ApiProperty({
    example: '1.0.1',
    description: '최신 버전',
  })
  @IsString()
  veLatestVersion: string;

  @ApiProperty({
    example: '1.0.0',
    description: '최소 지원 버전',
  })
  @IsString()
  veMinimumVersion: string;

  @ApiProperty({
    example: false,
    description: '업데이트가 필요한지 여부',
  })
  @IsBoolean()
  veNeedsUpdate: boolean;

  @ApiProperty({
    example: 1,
    description: '앱 상태 (1: 정상, 2: 강제업데이트, 3: 점검중)',
    enum: [1, 2, 3],
  })
  @IsNumber()
  @IsIn([1, 2, 3])
  veAppStatus: number;

  @ApiProperty({
    example: 'https://apps.apple.com/app/xrp-monitor/id123456789',
    description: '다운로드 URL',
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsString()
  veDownloadUrl: string | null;

  @ApiProperty({
    example: 'https://api.xrp-monitor.com',
    description: 'API 도메인',
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsString()
  veApiDomain: string | null;

  @ApiProperty({
    example: ['버그 수정', '성능 개선', '새로운 기능 추가'],
    description: '릴리스 노트',
    nullable: true,
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  veReleaseNotes: string[] | null;

  @ApiProperty({
    example: '1.0.1-review',
    description: '심사버전',
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsString()
  veReviewVersion: string | null;

  @ApiProperty({
    example: '1.0.1+1',
    description: 'Shorebird 버전',
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsString()
  veShorebirdVersion: string | null;

  @ApiProperty({
    example: DeploymentStatus.DEVELOPMENT,
    description: '배포상태 (배포중, 심사중, 심사완료, 개발중)',
    enum: DeploymentStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(DeploymentStatus)
  veDeploymentStatus: DeploymentStatus;
}

export class CreateVersionDto {
  @ApiProperty({
    example: '1.0.1',
    description: '버전',
  })
  @IsString()
  veVersion: string;

  @ApiProperty({
    example: 'ios',
    description: '플랫폼',
    enum: ['ios', 'android', 'web'],
  })
  @IsString()
  @IsIn(['ios', 'android', 'web'])
  vePlatform: string;

  @ApiProperty({
    example: '1.0.0',
    description: '최소 지원 버전',
  })
  @IsString()
  veMinimumVersion: string;

  @ApiProperty({
    example: 1,
    description: '앱 상태 (1: 정상, 2: 강제업데이트, 3: 점검중)',
    enum: [1, 2, 3],
    required: false,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  @IsIn([1, 2, 3])
  veAppStatus?: number;

  @ApiProperty({
    example: '버그 수정 및 성능 개선',
    description: '릴리스 노트',
    required: false,
  })
  @IsOptional()
  @IsString()
  veReleaseNotes?: string;

  @ApiProperty({
    example: 'https://apps.apple.com/app/xrp-monitor/id123456789',
    description: '다운로드 URL',
    required: false,
  })
  @IsOptional()
  @IsString()
  veDownloadUrl?: string;

  @ApiProperty({
    example: 'https://api.xrp-monitor.com',
    description: 'API 도메인',
    required: false,
  })
  @IsOptional()
  @IsString()
  veApiDomain?: string;

  @ApiProperty({
    example: true,
    description: '활성화 상태',
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  veIsActive?: boolean;

  @ApiProperty({
    example: '1.0.1-review',
    description: '심사버전',
    required: false,
  })
  @IsOptional()
  @IsString()
  veReviewVersion?: string;

  @ApiProperty({
    example: '1.0.1+1',
    description: 'Shorebird 버전',
    required: false,
  })
  @IsOptional()
  @IsString()
  veShorebirdVersion?: string;

  @ApiProperty({
    example: DeploymentStatus.DEVELOPMENT,
    description: '배포상태 (배포중, 심사중, 심사완료, 개발중)',
    enum: DeploymentStatus,
    required: false,
    default: DeploymentStatus.DEVELOPMENT,
  })
  @IsOptional()
  @IsEnum(DeploymentStatus)
  veDeploymentStatus?: DeploymentStatus;
}

// 버전 업데이트용 DTO
export class UpdateVersionDto {
  @ApiProperty({
    example: '1.0.2',
    description: '버전',
    required: false,
  })
  @IsOptional()
  @IsString()
  veVersion?: string;

  @ApiProperty({
    example: 'ios',
    description: '플랫폼',
    enum: ['ios', 'android', 'web'],
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(['ios', 'android', 'web'])
  vePlatform?: string;

  @ApiProperty({
    example: '1.0.1',
    description: '최소 지원 버전',
    required: false,
  })
  @IsOptional()
  @IsString()
  veMinimumVersion?: string;

  @ApiProperty({
    example: 2,
    description: '앱 상태 (1: 정상, 2: 강제업데이트, 3: 점검중)',
    enum: [1, 2, 3],
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsIn([1, 2, 3])
  veAppStatus?: number;

  @ApiProperty({
    example: '새로운 기능 추가 및 버그 수정',
    description: '릴리스 노트',
    required: false,
  })
  @IsOptional()
  @IsString()
  veReleaseNotes?: string;

  @ApiProperty({
    example: 'https://apps.apple.com/app/xrp-monitor/id123456789',
    description: '다운로드 URL',
    required: false,
  })
  @IsOptional()
  @IsString()
  veDownloadUrl?: string;

  @ApiProperty({
    example: 'https://api.xrp-monitor.com',
    description: 'API 도메인',
    required: false,
  })
  @IsOptional()
  @IsString()
  veApiDomain?: string;

  @ApiProperty({
    example: false,
    description: '활성화 상태',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  veIsActive?: boolean;

  @ApiProperty({
    example: '1.0.2-review',
    description: '심사버전',
    required: false,
  })
  @IsOptional()
  @IsString()
  veReviewVersion?: string;

  @ApiProperty({
    example: '1.0.2+2',
    description: 'Shorebird 버전',
    required: false,
  })
  @IsOptional()
  @IsString()
  veShorebirdVersion?: string;

  @ApiProperty({
    example: DeploymentStatus.IN_REVIEW,
    description: '배포상태 (배포중, 심사중, 심사완료, 개발중)',
    enum: DeploymentStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(DeploymentStatus)
  veDeploymentStatus?: DeploymentStatus;
}

// 버전 목록 응답 DTO
export class VersionItemDto {
  @ApiProperty({
    example: 1,
    description: '버전 ID',
  })
  @IsNumber()
  veIdx: number;

  @ApiProperty({
    example: '1.0.1',
    description: '버전',
  })
  @IsString()
  veVersion: string;

  @ApiProperty({
    example: 'ios',
    description: '플랫폼',
    enum: ['ios', 'android', 'web'],
  })
  @IsString()
  @IsIn(['ios', 'android', 'web'])
  vePlatform: string;

  @ApiProperty({
    example: '1.0.1',
    description: '최소 지원 버전',
  })
  @IsString()
  veMinimumVersion: string;

  @ApiProperty({
    example: 1,
    description: '앱 상태 (1: 정상, 2: 강제업데이트, 3: 점검중)',
    enum: [1, 2, 3],
  })
  @IsNumber()
  @IsIn([1, 2, 3])
  veAppStatus: number;

  @ApiProperty({
    example: '버그 수정 및 성능 개선',
    description: '릴리스 노트',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  veReleaseNotes: string | null;

  @ApiProperty({
    example: 'https://apps.apple.com/app/xrp-monitor/id123456789',
    description: '다운로드 URL',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  veDownloadUrl: string | null;

  @ApiProperty({
    example: 'https://api.xrp-monitor.com',
    description: 'API 도메인',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  veApiDomain: string | null;

  @ApiProperty({
    example: true,
    description: '활성화 상태',
  })
  @IsBoolean()
  veIsActive: boolean;

  @ApiProperty({
    example: '1.0.1-review',
    description: '심사버전',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  veReviewVersion: string | null;

  @ApiProperty({
    example: '1.0.1+1',
    description: 'Shorebird 버전',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  veShorebirdVersion: string | null;

  @ApiProperty({
    example: DeploymentStatus.DEVELOPMENT,
    description: '배포상태 (배포중, 심사중, 심사완료, 개발중)',
    enum: DeploymentStatus,
  })
  @IsEnum(DeploymentStatus)
  veDeploymentStatus: DeploymentStatus;

  @ApiProperty({
    example: '2025-10-06 17:19:18',
    description: '생성일시 (한국시간)',
  })
  createdAt: string;

  @ApiProperty({
    example: '2025-10-06 17:19:18',
    description: '수정일시 (한국시간)',
  })
  updatedAt: string;
}

// 버전 목록 응답 래퍼 DTO
export class VersionListResponseDto {
  @ApiProperty({
    type: [VersionItemDto],
    description: '버전 목록',
  })
  list: VersionItemDto[];
}

// 버전 체크 응답 래퍼 DTO
export class VersionCheckWrapperDto {
  @ApiProperty({
    type: VersionCheckResponseDto,
    description: '버전 체크 데이터',
  })
  data: VersionCheckResponseDto;
}
