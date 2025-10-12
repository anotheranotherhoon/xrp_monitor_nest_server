import {
  Body,
  Controller,
  Post,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import {
  AuthResponseDto,
  LogoutResponseDto,
  UserDto,
} from './dto/auth-response.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Public } from './decorators/public.decorator';
import { User } from './decorators/user.decorator';
import { SuperAdmin } from './decorators/admin.decorator';
import { User as UserEntity } from '../entities/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateAdminDto } from './dto/create-admin.dto';

@ApiTags('🔐 인증')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 409, description: '이미 사용 중인 이메일' })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '로그인' })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: '인증 실패' })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '토큰 갱신' })
  @ApiResponse({
    status: 200,
    description: '토큰 갱신 성공',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: '유효하지 않은 리프레시 토큰' })
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthResponseDto> {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '로그아웃' })
  @ApiResponse({
    status: 200,
    description: '로그아웃 성공',
    type: LogoutResponseDto,
  })
  async logout(@User() user: UserEntity): Promise<LogoutResponseDto> {
    await this.authService.logout(user.meIdx);
    return {
      message: '로그아웃이 성공적으로 처리되었습니다.',
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '사용자 프로필 조회' })
  @ApiResponse({
    status: 200,
    description: '프로필 조회 성공',
    type: UserDto,
  })
  async getProfile(@User() user: UserEntity): Promise<UserDto> {
    return this.authService.getUserProfile(user.meIdx);
  }

  @Post('admin/create')
  @SuperAdmin()
  @ApiBearerAuth()
  @ApiOperation({ summary: '관리자 계정 생성 (슈퍼관리자용)' })
  @ApiResponse({
    status: 201,
    description: '관리자 계정 생성 성공',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 409, description: '이미 사용 중인 이메일' })
  async createAdmin(
    @Body() createAdminDto: CreateAdminDto,
  ): Promise<AuthResponseDto> {
    return this.authService.createAdmin(createAdminDto);
  }
}
