import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsOptional,
  IsEnum,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'admin@example.com', description: '사용자 이메일' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: '비밀번호',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: '관리자', description: '닉네임', required: false })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiProperty({
    example: 'ADMIN',
    description: '사용자 권한',
    enum: UserRole,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

export class UpdateUserDto {
  @ApiProperty({ example: '관리자', description: '닉네임', required: false })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiProperty({
    example: true,
    description: '계정 활성화 상태',
    required: false,
  })
  @IsOptional()
  isActive?: boolean;
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
