import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsOptional,
  IsEnum,
  MinLength,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { UserRole } from '../../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'admin@example.com', description: '사용자 이메일' })
  @IsEmail()
  meEmail: string;

  @ApiProperty({
    example: 'password123',
    description: '비밀번호',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  mePassword: string;

  @ApiProperty({ example: '관리자', description: '닉네임', required: false })
  @IsOptional()
  @IsString()
  meNickname?: string;

  @ApiProperty({
    example: 'ADMIN',
    description: '사용자 권한',
    enum: UserRole,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole)
  meRole?: UserRole;
}

export class UpdateUserDto {
  @ApiProperty({ example: '관리자', description: '닉네임', required: false })
  @IsOptional()
  @IsString()
  meNickname?: string;

  @ApiProperty({
    example: true,
    description: '계정 활성화 상태',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  meIsActive?: boolean;
}

export class UserDto {
  @ApiProperty({
    example: 1,
    description: '사용자 고유 식별자',
    type: 'integer',
  })
  @IsNumber()
  meIdx: number;

  @ApiProperty({
    example: 'user@example.com',
    description: '사용자 이메일 주소',
    type: 'string',
    format: 'email',
  })
  @IsEmail()
  meEmail: string;

  @ApiProperty({
    example: '사용자',
    description: '사용자 닉네임',
    type: 'string',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  meNickname: string;

  @ApiProperty({
    example: true,
    description: '계정 활성화 상태 - true: 활성, false: 비활성',
    type: 'boolean',
    default: true,
  })
  @IsBoolean()
  meIsActive: boolean;

  @ApiProperty({
    example: UserRole.USER,
    description:
      '사용자 권한 - USER: 일반사용자, ADMIN: 관리자, SUPER_ADMIN: 슈퍼관리자',
    enum: UserRole,
    enumName: 'UserRole',
  })
  @IsEnum(UserRole)
  meRole: UserRole;

  @ApiProperty({
    example: '2025-10-12T15:30:00.000Z',
    description: '사용자 계정 생성 일시 (UTC)',
    type: 'string',
    format: 'date-time',
  })
  createdAt: string;

  @ApiProperty({
    example: '2025-10-12T15:30:00.000Z',
    description: '사용자 정보 수정 일시 (UTC)',
    type: 'string',
    format: 'date-time',
  })
  updatedAt: string;
}

export class UserListResponseDto {
  @ApiProperty({
    type: Object,
    description: '페이지네이션 정보',
    properties: {
      total: { type: 'number', example: 50, description: '전체 사용자 수' },
      perPage: {
        type: 'number',
        example: 10,
        description: '페이지당 아이템 수',
      },
      currentPage: { type: 'number', example: 1, description: '현재 페이지' },
      lastPage: { type: 'number', example: 5, description: '마지막 페이지' },
    },
  })
  page: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
  };

  @ApiProperty({
    type: [UserDto],
    description: '사용자 목록',
  })
  list: UserDto[];
}

export class DashboardDto {
  @ApiProperty({ example: 150, description: '전체 사용자 수' })
  totalUsers: number;

  @ApiProperty({ example: 145, description: '활성 사용자 수' })
  activeUsers: number;

  @ApiProperty({ example: 5, description: '비활성 사용자 수' })
  inactiveUsers: number;

  @ApiProperty({ example: 3, description: '관리자 수' })
  adminCount: number;

  @ApiProperty({ example: 1, description: '슈퍼관리자 수' })
  superAdminCount: number;

  @ApiProperty({ example: 146, description: '일반 사용자 수' })
  userCount: number;
}
