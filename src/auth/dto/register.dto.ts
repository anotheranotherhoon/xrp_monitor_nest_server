import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: '사용자 이메일',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: '비밀번호 (최소 6자)',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'XRP투자자',
    description: '닉네임 (선택사항)',
    required: false,
  })
  @IsOptional()
  @IsString()
  nickname?: string;
}
