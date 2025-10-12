import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

import { User } from 'src/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto, UserDto } from './dto/auth-response.dto';
import { CreateAdminDto } from './dto/create-admin.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  private generateRefreshToken(): string {
    return randomBytes(32).toString('hex');
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, nickname } = registerDto;

    // 이메일 중복 체크
    const existingUser = await this.userRepository.findOne({
      where: { meEmail: email },
    });

    if (existingUser) {
      throw new ConflictException('이미 사용 중인 이메일입니다.');
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 12);

    // 사용자 생성
    const user = this.userRepository.create({
      meEmail: email,
      mePassword: hashedPassword,
      meNickname: nickname,
    });

    const savedUser = await this.userRepository.save(user);

    // JWT 토큰 및 RefreshToken 생성
    const payload = {
      sub: savedUser.meIdx,
      email: savedUser.meEmail,
      role: savedUser.meRole,
    };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.generateRefreshToken();

    // RefreshToken 저장
    savedUser.meRefreshToken = refreshToken;
    await this.userRepository.save(savedUser);

    return {
      data: {
        accessToken,
        refreshToken,
        user: {
          meIdx: savedUser.meIdx,
          meEmail: savedUser.meEmail,
          meNickname: savedUser.meNickname,
          meRole: savedUser.meRole,
          createdAt: savedUser.createdAt,
        },
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    // 사용자 찾기
    const user = await this.userRepository.findOne({
      where: { meEmail: email, meIsActive: true },
    });

    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 잘못되었습니다.');
    }

    // 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(password, user.mePassword);

    if (!isPasswordValid) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 잘못되었습니다.');
    }

    // JWT 토큰 및 RefreshToken 생성
    const payload = { sub: user.meIdx, email: user.meEmail, role: user.meRole };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.generateRefreshToken();

    // RefreshToken 저장
    user.meRefreshToken = refreshToken;
    await this.userRepository.save(user);

    return {
      data: {
        accessToken,
        refreshToken,
        user: {
          meIdx: user.meIdx,
          meEmail: user.meEmail,
          meNickname: user.meNickname,
          meRole: user.meRole,
          createdAt: user.createdAt,
        },
      },
    };
  }

  async validateUser(userId: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { meIdx: userId, meIsActive: true },
    });
  }

  async getUserProfile(userId: number): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      where: { meIdx: userId, meIsActive: true },
    });

    if (!user) {
      throw new BadRequestException('사용자를 찾을 수 없습니다.');
    }

    return {
      meIdx: user.meIdx,
      meEmail: user.meEmail,
      meNickname: user.meNickname,
      meRole: user.meRole,
      createdAt: user.createdAt,
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    const user = await this.userRepository.findOne({
      where: { meRefreshToken: refreshToken, meIsActive: true },
    });

    if (!user) {
      throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
    }

    // 새로운 토큰들 생성
    const payload = { sub: user.meIdx, email: user.meEmail, role: user.meRole };
    const accessToken = this.jwtService.sign(payload);
    const newRefreshToken = this.generateRefreshToken();

    // 새로운 RefreshToken 저장
    user.meRefreshToken = newRefreshToken;
    await this.userRepository.save(user);

    return {
      data: {
        accessToken,
        refreshToken: newRefreshToken,
        user: {
          meIdx: user.meIdx,
          meEmail: user.meEmail,
          meNickname: user.meNickname,
          meRole: user.meRole,
          createdAt: user.createdAt,
        },
      },
    };
  }

  async logout(userId: number): Promise<void> {
    await this.userRepository.update(
      { meIdx: userId },
      { meRefreshToken: null },
    );
  }

  async createAdmin(createAdminDto: CreateAdminDto): Promise<AuthResponseDto> {
    const { email, password, nickname, role } = createAdminDto;

    // 이메일 중복 체크
    const existingUser = await this.userRepository.findOne({
      where: { meEmail: email },
    });

    if (existingUser) {
      throw new ConflictException('이미 사용 중인 이메일입니다.');
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 12);

    // 관리자 사용자 생성
    const user = this.userRepository.create({
      meEmail: email,
      mePassword: hashedPassword,
      meNickname: nickname,
      meRole: role,
    });

    const savedUser = await this.userRepository.save(user);

    // JWT 토큰 및 RefreshToken 생성
    const payload = {
      sub: savedUser.meIdx,
      email: savedUser.meEmail,
      role: savedUser.meRole,
    };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.generateRefreshToken();

    // RefreshToken 저장
    savedUser.meRefreshToken = refreshToken;
    await this.userRepository.save(savedUser);

    return {
      data: {
        accessToken,
        refreshToken,
        user: {
          meIdx: savedUser.meIdx,
          meEmail: savedUser.meEmail,
          meNickname: savedUser.meNickname,
          meRole: savedUser.meRole,
          createdAt: savedUser.createdAt,
        },
      },
    };
  }
}
