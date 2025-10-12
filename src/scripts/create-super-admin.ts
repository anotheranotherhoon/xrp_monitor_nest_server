import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../entities/user.entity';
import { XrpHolding } from '../entities/xrp-holding.entity';
import { AppVersion } from '../entities/app-version.entity';

/**
 * 슈퍼관리자 계정을 직접 생성하는 스크립트
 * 실행 방법: npm run create-super-admin
 */
async function createSuperAdmin() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'xrp',
    entities: [User, XrpHolding, AppVersion],
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    console.log('데이터베이스 연결 성공');

    const userRepository = dataSource.getRepository(User);

    // 슈퍼관리자 정보
    const email = 'superadmin@xrpmonitor.com';
    const password = 'superadmin123!';
    const nickname = '슈퍼관리자';

    // 기존 슈퍼관리자 확인
    const existingAdmin = await userRepository.findOne({
      where: { meEmail: email },
    });

    if (existingAdmin) {
      console.log('슈퍼관리자가 이미 존재합니다. 권한을 업데이트합니다.');
      existingAdmin.meRole = UserRole.SUPER_ADMIN;
      await userRepository.save(existingAdmin);
      console.log('슈퍼관리자 권한이 업데이트되었습니다.');
    } else {
      // 비밀번호 해시화
      const hashedPassword = await bcrypt.hash(password, 12);

      // 슈퍼관리자 생성
      const superAdmin = userRepository.create({
        meEmail: email,
        mePassword: hashedPassword,
        meNickname: nickname,
        meRole: UserRole.SUPER_ADMIN,
        meIsActive: true,
      });

      await userRepository.save(superAdmin);
      console.log('슈퍼관리자가 생성되었습니다.');
    }

    console.log('\n=== 슈퍼관리자 계정 정보 ===');
    console.log(`이메일: ${email}`);
    console.log(`비밀번호: ${password}`);
    console.log(`닉네임: ${nickname}`);
    console.log('===========================\n');
  } catch (error) {
    console.error('슈퍼관리자 생성 중 오류:', error);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

// 직접 실행할 때
if (require.main === module) {
  createSuperAdmin();
}
