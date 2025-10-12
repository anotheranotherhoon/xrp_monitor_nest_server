import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsEnum, MinLength } from 'class-validator';
import { UserRole } from 'src/entities/user.entity';

export class CreateAdminDto {
  @ApiProperty({ example: 'admin@example.com', description: '관리자 이메일' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'admin123', description: '비밀번호', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: '관리자', description: '닉네임' })
  @IsString()
  nickname: string;

  @ApiProperty({
    example: 'ADMIN',
    description: '관리자 권한',
    enum: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
    default: UserRole.ADMIN,
  })
  @IsEnum([UserRole.ADMIN, UserRole.SUPER_ADMIN])
  role: UserRole.ADMIN | UserRole.SUPER_ADMIN;
}
