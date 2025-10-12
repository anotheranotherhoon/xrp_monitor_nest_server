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
      { keKeyword: '상승', keWeight: 1.5, keType: KeywordType.POSITIVE },
      { keKeyword: '성장', keWeight: 1.2, keType: KeywordType.POSITIVE },
      { keKeyword: 'pump', keWeight: 2.0, keType: KeywordType.POSITIVE },
      { keKeyword: 'bullish', keWeight: 1.8, keType: KeywordType.POSITIVE },
      { keKeyword: '호재', keWeight: 1.6, keType: KeywordType.POSITIVE },
      { keKeyword: '급등', keWeight: 2.2, keType: KeywordType.POSITIVE },

      // 부정적 키워드
      { keKeyword: '하락', keWeight: 1.5, keType: KeywordType.NEGATIVE },
      { keKeyword: '급락', keWeight: 2.0, keType: KeywordType.NEGATIVE },
      { keKeyword: 'dump', keWeight: 2.0, keType: KeywordType.NEGATIVE },
      { keKeyword: 'bearish', keWeight: 1.8, keType: KeywordType.NEGATIVE },
      { keKeyword: '악재', keWeight: 1.6, keType: KeywordType.NEGATIVE },
      { keKeyword: '폭락', keWeight: 2.2, keType: KeywordType.NEGATIVE },

      // 중요 키워드
      { keKeyword: 'xrp', keWeight: 3.0, keType: KeywordType.IMPORTANT },
      { keKeyword: 'ripple', keWeight: 3.0, keType: KeywordType.IMPORTANT },
      { keKeyword: 'sec', keWeight: 2.5, keType: KeywordType.IMPORTANT },
      {
        keKeyword: 'partnership',
        keWeight: 2.0,
        keType: KeywordType.IMPORTANT,
      },
      { keKeyword: 'ledger', keWeight: 2.3, keType: KeywordType.IMPORTANT },
      {
        keKeyword: 'cross-border',
        keWeight: 2.1,
        keType: KeywordType.IMPORTANT,
      },
    ];

    // 키워드 생성
    const keywords = keywordRepository.create(initialKeywords);
    await keywordRepository.save(keywords);

    console.log(`${keywords.length}개의 키워드가 생성되었습니다.`);
    console.log('\n=== 생성된 키워드 ===');

    const positiveKeywords = keywords.filter(
      (k) => k.keType === KeywordType.POSITIVE,
    );
    const negativeKeywords = keywords.filter(
      (k) => k.keType === KeywordType.NEGATIVE,
    );
    const importantKeywords = keywords.filter(
      (k) => k.keType === KeywordType.IMPORTANT,
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
