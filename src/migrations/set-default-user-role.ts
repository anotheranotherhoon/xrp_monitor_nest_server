import { DataSource } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { XrpHolding } from '../entities/xrp-holding.entity';
import { AppVersion } from '../entities/app-version.entity';

/**
 * 기존 회원들을 모두 USER 타입으로 설정하는 마이그레이션
 * 실행 방법: npm run migration:set-user-role
 */
export async function setDefaultUserRole() {
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

    // role이 null인 모든 사용자를 USER로 설정
    const result = await userRepository
      .createQueryBuilder()
      .update(User)
      .set({ role: UserRole.USER })
      .where('role IS NULL')
      .execute();

    console.log(
      `${result.affected}명의 사용자가 USER 타입으로 설정되었습니다.`,
    );
  } catch (error) {
    console.error('마이그레이션 실행 중 오류:', error);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

// 직접 실행할 때
if (require.main === module) {
  setDefaultUserRole();
}
