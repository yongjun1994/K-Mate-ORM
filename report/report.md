# K-Mate 백엔드 개발 발표 보고서
## NestJS + MySQL + TypeORM을 활용한 K-Buzz 게시판 시스템

---

## 1. 프로젝트 개요

### 1.1 프로젝트 소개
**K-Mate**는 한국 여행 정보 공유 플랫폼으로, K-Buzz 게시판을 핵심 기능으로 하는 웹 애플리케이션입니다.

### 1.2 주요 기능
- **K-Buzz 게시판**: 트렌드 게시글과 커뮤니티 게시글 관리
- **사용자 인증**: Google OAuth 2.0 기반 인증 시스템
- **상호작용**: 좋아요, 스크랩, 댓글, 북마크 기능
- **팁 시스템**: 버스 가이드, 지하철 가이드, 맛집 예약 가이드
- **장소 관리**: 여행 관련 장소 정보 관리

### 1.3 개발 환경
- **Backend**: NestJS (Node.js Framework)
- **Database**: MySQL 8.0
- **ORM**: TypeORM
- **Authentication**: JWT + Google OAuth
- **Testing**: Postman


### 설치 명령어

# TypeORM과 MySQL 드라이버 설치
npm install @nestjs/typeorm typeorm mysql2

---

## 2. ORM 도입 배경 및 목적

### 2.1 ORM이란?
**Object-Relational Mapping (ORM)**은 객체지향 프로그래밍 언어와 관계형 데이터베이스 간의 호환되지 않는 데이터를 변환하는 프로그래밍 기법입니다.

### 2.2 ORM 도입 배경
1. **개발 생산성 향상**: SQL 쿼리 작성 없이 객체지향적 방식으로 데이터 조작
2. **타입 안정성**: TypeScript와의 완벽한 통합으로 컴파일 타임 오류 검출
3. **코드 재사용성**: 엔티티 기반의 재사용 가능한 데이터 모델
4. **유지보수성**: 스키마 변경 시 코드 수정 최소화
5. **팀 협업**: 일관된 데이터 접근 패턴으로 팀원 간 협업 효율성 증대

### 2.3 ORM의 장단점

#### 장점
- **생산성**: SQL 작성 시간 단축
- **타입 안정성**: 컴파일 타임 오류 검출
- **데이터베이스 독립성**: DB 변경 시 코드 수정 최소화
- **관계 매핑**: 복잡한 관계형 데이터 모델링 간소화
- **캐싱**: 내장된 쿼리 캐싱으로 성능 향상

#### 단점
- **성능 오버헤드**: 복잡한 쿼리에서 성능 저하 가능
- **학습 곡선**: ORM 프레임워크 학습 필요
- **복잡한 쿼리**: 특수한 쿼리는 여전히 SQL 작성 필요
- **디버깅 어려움**: 생성된 SQL 쿼리 추적의 어려움

---

## 3. TypeORM 상세 분석

### 3.1 TypeORM이란?
TypeORM은 TypeScript와 JavaScript를 위한 가장 강력한 ORM 중 하나로, Active Record와 Data Mapper 패턴을 모두 지원합니다.

### 3.2 TypeORM 특징
1. **TypeScript First**: TypeScript와 완벽한 통합
2. **Active Record & Data Mapper**: 두 가지 패턴 모두 지원
3. **데코레이터 기반**: ES7 데코레이터를 활용한 직관적인 문법
4. **마이그레이션**: 데이터베이스 스키마 버전 관리
5. **쿼리 빌더**: 복잡한 쿼리 작성 지원
6. **관계 매핑**: 다양한 관계 타입 지원

### 3.3 TypeORM 선택 이유
1. **NestJS 통합**: @nestjs/typeorm으로 완벽한 통합
2. **TypeScript 지원**: 타입 안정성과 개발자 경험 향상
3. **풍부한 기능**: 관계 매핑, 마이그레이션, 쿼리 빌더 등
4. **활발한 커뮤니티**: 문제 해결과 학습 자료 풍부
5. **MySQL 지원**: MySQL 8.0과의 완벽한 호환성

---

## 4. 구현 코드 분석

### 4.1 데이터베이스 모듈 설정

```typescript
// src/database/database.module.ts
@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.user'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [User, KBuzz, Tip, Comment, Like, Scrap, Place, Bookmark],
        synchronize: configService.get('app.nodeEnv') === 'development',
        logging: configService.get('app.nodeEnv') === 'development',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
```

### 4.2 K-Buzz 엔티티 구현

```typescript
// src/features/posts/entities/k-buzz.entity.ts
@Entity('k_buzz')
@Index(['post_type'])
@Index(['trend_week', 'trend_rank'])
@Index(['category'])
@Index(['author_id'])
export class KBuzz {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column()
  title: string;

  @Column('longtext')
  content: string;

  @Column({ type: 'enum', enum: ['trend', 'community'] })
  post_type: 'trend' | 'community';

  @Column({ type: 'enum', enum: ['travel_tip', 'food_review', 'cafe_review'], nullable: true })
  category: 'travel_tip' | 'food_review' | 'cafe_review';

  @Column({ nullable: true })
  trend_week: number;

  @Column({ nullable: true })
  trend_rank: number;

  @Column({ default: 0 })
  view_count: number;

  @Column({ default: 0 })
  scrap_count: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, user => user.k_buzz_posts)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({ type: 'bigint', unsigned: true })
  author_id: number;

  @OneToMany(() => Comment, comment => comment.k_buzz_post)
  comments: Comment[];

  @OneToMany(() => Like, like => like.k_buzz_post)
  likes: Like[];

  @OneToMany(() => Scrap, scrap => scrap.k_buzz_post)
  scraps: Scrap[];
}
```

### 4.3 서비스 레이어 구현

```typescript
// src/features/posts/k-buzz.service.ts
@Injectable()
export class KBuzzService {
  constructor(
    @InjectRepository(KBuzz)
    private kBuzzRepository: Repository<KBuzz>,
  ) {}

  async create(createKBuzzDto: CreateKBuzzDto, userId: number): Promise<KBuzz> {
    const kBuzz = this.kBuzzRepository.create({
      ...createKBuzzDto,
      author_id: userId,
    });
    
    return await this.kBuzzRepository.save(kBuzz);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<PaginatedResult<KBuzz>> {
    const [items, total] = await this.kBuzzRepository.findAndCount({
      relations: ['author'],
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findTrendPosts(week: number): Promise<KBuzz[]> {
    return await this.kBuzzRepository.find({
      where: { 
        post_type: 'trend',
        trend_week: week 
      },
      relations: ['author'],
      order: { trend_rank: 'ASC' },
    });
  }
}
```

### 4.4 복잡한 쿼리 예시

```typescript
// src/features/posts/k-buzz.service.ts
async getPostStatistics(): Promise<PostStatistics> {
  const queryBuilder = this.kBuzzRepository.createQueryBuilder('kbuzz');
  
  const result = await queryBuilder
    .select([
      'kbuzz.post_type',
      'COUNT(*) as count',
      'AVG(kbuzz.view_count) as avg_views',
      'SUM(kbuzz.scrap_count) as total_scraps'
    ])
    .groupBy('kbuzz.post_type')
    .getRawMany();

  return result.reduce((acc, row) => {
    acc[row.post_type] = {
      count: parseInt(row.count),
      avgViews: parseFloat(row.avg_views),
      totalScraps: parseInt(row.total_scraps),
    };
    return acc;
  }, {});
}
```

---

## 5. TypeORM 사용 경험

#### 긍정적인 경험
1. **개발 생산성**: SQL 작성 없이 빠른 개발 가능
2. **타입 안정성**: TypeScript와의 완벽한 통합으로 오류 사전 방지
3. **관계 매핑**: 복잡한 관계형 데이터 모델링이 직관적
4. **마이그레이션**: 스키마 변경 관리가 체계적

#### 어려웠던 점
1. **복잡한 쿼리**: 특수한 쿼리는 여전히 QueryBuilder 사용 필요
2. **디버깅**: 생성된 SQL 쿼리 추적의 어려움
3. **학습 곡선**: 데코레이터 문법과 관계 설정 학습 필요

