import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

import { Admin } from '../auth/decorators/admin.decorator';
import { AdminService } from './admin.service';
import { User } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/admin-user.dto';

@ApiTags('🔧 관리자 페이지')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @Admin()
  @ApiBearerAuth()
  @ApiOperation({ summary: '관리자 대시보드 정보' })
  @ApiResponse({
    status: 200,
    description: '대시보드 정보 조회 성공',
  })
  async getDashboard() {
    return this.adminService.getDashboard();
  }

  @Get('users')
  @Admin()
  @ApiBearerAuth()
  @ApiOperation({ summary: '사용자 목록 조회 (기본값: USER 역할만)' })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
    description: '페이지 번호',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
    description: '페이지당 항목 수',
  })
  @ApiQuery({
    name: 'role',
    required: false,
    example: 'USER',
    description:
      '사용자 권한 필터 (기본값: USER, ADMIN/SUPER_ADMIN도 조회 가능)',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 목록 조회 성공',
    type: [User],
  })
  async getUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('role') role?: string,
  ) {
    return this.adminService.getUsers(page, limit, role);
  }

  @Get('users/:id')
  @Admin()
  @ApiBearerAuth()
  @ApiOperation({ summary: '사용자 상세 정보 조회' })
  @ApiParam({ name: 'id', example: 1, description: '사용자 ID' })
  @ApiResponse({
    status: 200,
    description: '사용자 상세 정보 조회 성공',
    type: User,
  })
  async getUser(@Param('id') id: number) {
    return this.adminService.getUser(id);
  }

  @Post('users')
  @Admin()
  @ApiBearerAuth()
  @ApiOperation({ summary: '새 사용자 생성 (관리자용)' })
  @ApiResponse({
    status: 201,
    description: '사용자 생성 성공',
    type: User,
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.adminService.createUser(createUserDto);
  }

  @Put('users/:id')
  @Admin()
  @ApiBearerAuth()
  @ApiOperation({ summary: '사용자 정보 수정' })
  @ApiParam({ name: 'id', example: 1, description: '사용자 ID' })
  @ApiResponse({
    status: 200,
    description: '사용자 정보 수정 성공',
    type: User,
  })
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.adminService.updateUser(id, updateUserDto);
  }

  @Put('users/:id/role')
  @Admin()
  @ApiBearerAuth()
  @ApiOperation({ summary: '사용자 권한 변경 (관리자용)' })
  @ApiParam({ name: 'id', example: 1, description: '사용자 ID' })
  @ApiResponse({
    status: 200,
    description: '사용자 권한 변경 성공',
    type: User,
  })
  async updateUserRole(@Param('id') id: number, @Body('role') role: string) {
    return this.adminService.updateUserRole(id, role);
  }

  @Put('users/:id/status')
  @Admin()
  @ApiBearerAuth()
  @ApiOperation({ summary: '사용자 계정 활성화/비활성화' })
  @ApiParam({ name: 'id', example: 1, description: '사용자 ID' })
  @ApiResponse({
    status: 200,
    description: '사용자 상태 변경 성공',
    type: User,
  })
  async updateUserStatus(@Param('id') id: number) {
    return this.adminService.updateUserStatus(id);
  }

  @Delete('users/:id')
  @Admin()
  @ApiBearerAuth()
  @ApiOperation({ summary: '사용자 삭제 (관리자용)' })
  @ApiParam({ name: 'id', example: 1, description: '사용자 ID' })
  @ApiResponse({
    status: 200,
    description: '사용자 삭제 성공',
  })
  async deleteUser(@Param('id') id: number) {
    await this.adminService.deleteUser(id);
    return { message: '사용자가 삭제되었습니다.' };
  }
}
