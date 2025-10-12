import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/entities/user.entity';

export class UserDto {
  @ApiProperty({ example: 1, description: '사용자 고유 식별자' })
  meIdx: number;

  @ApiProperty({ example: 'user@example.com', description: '사용자 이메일' })
  meEmail: string;

  @ApiProperty({
    example: 'XRP투자자',
    description: '사용자 닉네임',
    nullable: true,
  })
  meNickname: string | null;

  @ApiProperty({
    example: 'USER',
    description: '사용자 권한',
    enum: UserRole,
  })
  meRole: UserRole;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: '계정 생성일',
  })
  createdAt: Date;
}

export class AuthDataDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSJ9...',
    description: 'JWT 액세스 토큰',
  })
  accessToken: string;

  @ApiProperty({
    example: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6',
    description: '리프레시 토큰',
  })
  refreshToken: string;

  @ApiProperty({ type: UserDto, description: '사용자 정보' })
  user: UserDto;
}

export class AuthResponseDto {
  @ApiProperty({ type: AuthDataDto, description: '인증 데이터' })
  data: AuthDataDto;
}

export class LogoutResponseDto {
  @ApiProperty({
    example: '로그아웃이 성공적으로 처리되었습니다.',
    description: '로그아웃 메시지',
  })
  message: string;
}
