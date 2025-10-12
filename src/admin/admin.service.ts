import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { User, UserRole } from '../entities/user.entity';
import {
  CreateUserDto,
  UpdateUserDto,
  DashboardDto,
} from './dto/admin-user.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private formatToKoreanTime(date: Date): string {
    if (!date) return '';
    const koreanTime = new Date(
      date.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }),
    );
    const year = koreanTime.getFullYear();
    const month = String(koreanTime.getMonth() + 1).padStart(2, '0');
    const day = String(koreanTime.getDate()).padStart(2, '0');
    const hours = String(koreanTime.getHours()).padStart(2, '0');
    const minutes = String(koreanTime.getMinutes()).padStart(2, '0');
    const seconds = String(koreanTime.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  async getDashboard(): Promise<DashboardDto> {
    const [
      totalUsers,
      activeUsers,
      inactiveUsers,
      adminCount,
      superAdminCount,
      userCount,
    ] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.count({ where: { meIsActive: true } }),
      this.userRepository.count({ where: { meIsActive: false } }),
      this.userRepository.count({ where: { meRole: UserRole.ADMIN } }),
      this.userRepository.count({ where: { meRole: UserRole.SUPER_ADMIN } }),
      this.userRepository.count({ where: { meRole: UserRole.USER } }),
    ]);

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      adminCount,
      superAdminCount,
      userCount,
    };
  }

  async getUsers(
    page: number = 1,
    limit: number = 10,
    role?: string,
  ): Promise<{
    page: {
      total: number;
      perPage: number;
      currentPage: number;
      lastPage: number;
    };
    list: any[];
  }> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    // 기본적으로 USER 역할만 조회, role 파라미터가 있으면 해당 역할 조회
    const targetRole = role || UserRole.USER;
    queryBuilder.where('user.meRole = :role', { role: targetRole });

    const [list, total] = await queryBuilder
      .select([
        'user.meIdx',
        'user.meEmail',
        'user.meNickname',
        'user.meIsActive',
        'user.meRole',
        'user.createdAt',
        'user.updatedAt',
      ])
      .orderBy('user.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const lastPage = Math.ceil(total / limit);

    const formattedList = list.map((user) => ({
      ...user,
      createdAt: this.formatToKoreanTime(user.createdAt),
      updatedAt: this.formatToKoreanTime(user.updatedAt),
    }));

    return {
      page: {
        total,
        perPage: limit,
        currentPage: page,
        lastPage,
      },
      list: formattedList,
    };
  }

  async getUser(id: number): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { meIdx: id },
      relations: ['xrpHolding'],
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return {
      ...user,
      createdAt: this.formatToKoreanTime(user.createdAt),
      updatedAt: this.formatToKoreanTime(user.updatedAt),
    };
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const {
      meEmail,
      mePassword,
      meNickname,
      meRole = UserRole.USER,
    } = createUserDto;

    // 이메일 중복 체크
    const existingUser = await this.userRepository.findOne({
      where: { meEmail },
    });

    if (existingUser) {
      throw new ConflictException('이미 사용 중인 이메일입니다.');
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(mePassword, 12);

    // 사용자 생성
    const user = this.userRepository.create({
      meEmail,
      mePassword: hashedPassword,
      meNickname,
      meRole,
    });

    return this.userRepository.save(user);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { meIdx: id },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async updateUserRole(id: number, role: string): Promise<User> {
    if (!Object.values(UserRole).includes(role as UserRole)) {
      throw new BadRequestException('유효하지 않은 권한입니다.');
    }

    const user = await this.userRepository.findOne({
      where: { meIdx: id },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    user.meRole = role as UserRole;
    return this.userRepository.save(user);
  }

  async updateUserStatus(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { meIdx: id },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    user.meIsActive = !user.meIsActive;
    return this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { meIdx: id },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    await this.userRepository.remove(user);
  }
}
