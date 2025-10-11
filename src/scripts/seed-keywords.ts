import { DataSource } from 'typeorm';
import { Keyword, KeywordType } from '../entities/keyword.entity';
import { XrpHolding } from '../entities/xrp-holding.entity';
import { AppVersion } from '../entities/app-version.entity';
import { User } from '../entities/user.entity';

/**
 * 초기 키워드 데이터를 생성하는 스크립트
 * 실행 방법: npm run seed-keywords
 */
async function seedKeywords() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'xrp',
    entities: [User, XrpHolding, AppVersion, Keyword],
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    console.log('데이터베이스 연결 성공');

    const keywordRepository = dataSource.getRepository(Keyword);

    // 기존 키워드 삭제
    await keywordRepository.clear();
    console.log('기존 키워드 삭제 완료');

    // 초기 키워드 데이터
    const initialKeywords = [
      // 긍정적 키워드
      { keyword: '상승', weight: 1.5, type: KeywordType.POSITIVE },
      { keyword: '성장', weight: 1.2, type: KeywordType.POSITIVE },
      { keyword: 'pump', weight: 2.0, type: KeywordType.POSITIVE },
      { keyword: 'bullish', weight: 1.8, type: KeywordType.POSITIVE },
      { keyword: '호재', weight: 1.6, type: KeywordType.POSITIVE },
      { keyword: '급등', weight: 2.2, type: KeywordType.POSITIVE },

      // 부정적 키워드
      { keyword: '하락', weight: 1.5, type: KeywordType.NEGATIVE },
      { keyword: '급락', weight: 2.0, type: KeywordType.NEGATIVE },
      { keyword: 'dump', weight: 2.0, type: KeywordType.NEGATIVE },
      { keyword: 'bearish', weight: 1.8, type: KeywordType.NEGATIVE },
      { keyword: '악재', weight: 1.6, type: KeywordType.NEGATIVE },
      { keyword: '폭락', weight: 2.2, type: KeywordType.NEGATIVE },

      // 중요 키워드
      { keyword: 'xrp', weight: 3.0, type: KeywordType.IMPORTANT },
      { keyword: 'ripple', weight: 3.0, type: KeywordType.IMPORTANT },
      { keyword: 'sec', weight: 2.5, type: KeywordType.IMPORTANT },
      { keyword: 'partnership', weight: 2.0, type: KeywordType.IMPORTANT },
      { keyword: 'ledger', weight: 2.3, type: KeywordType.IMPORTANT },
      { keyword: 'cross-border', weight: 2.1, type: KeywordType.IMPORTANT },
    ];

    // 키워드 생성
    const keywords = keywordRepository.create(initialKeywords);
    await keywordRepository.save(keywords);

    console.log(`${keywords.length}개의 키워드가 생성되었습니다.`);
    console.log('\n=== 생성된 키워드 ===');

    const positiveKeywords = keywords.filter(
      (k) => k.type === KeywordType.POSITIVE,
    );
    const negativeKeywords = keywords.filter(
      (k) => k.type === KeywordType.NEGATIVE,
    );
    const importantKeywords = keywords.filter(
      (k) => k.type === KeywordType.IMPORTANT,
    );

    console.log(`긍정적 키워드: ${positiveKeywords.length}개`);
    console.log(`부정적 키워드: ${negativeKeywords.length}개`);
    console.log(`중요 키워드: ${importantKeywords.length}개`);
    console.log('========================\n');
  } catch (error) {
    console.error('키워드 생성 중 오류:', error);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

// 직접 실행할 때
if (require.main === module) {
  seedKeywords();
}
