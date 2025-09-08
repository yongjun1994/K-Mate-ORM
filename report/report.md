# K-Mate 백엔드 개발 발표 보고서
## NestJS + MySQL + TypeORM을 활용한 K-Buzz 게시판 시스템

---

## 1. 프로젝트 개요

### 1.1 프로젝트 소개
**K-Mate**는 한국 여행 정보 공유 플랫폼으로, K-Buzz 게시판을 핵심 기능으로 하는 웹 애플리케이션입니다.

### 1.2 주요 기능
- **K-Buzz 게시판**: 기본적인 게시글 CRUD 기능 (제목, 내용, 조회수)
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
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
// 모든 엔티티들을 import하여 TypeORM이 인식할 수 있도록 함
import { User, KBuzz, Tip, Comment, Like, Scrap, Place, Bookmark } from '../features';

@Global() // 전역 모듈로 설정하여 다른 모듈에서 자동으로 사용 가능
@Module({
  imports: [
    // TypeORM 비동기 설정: 환경변수를 사용하여 데이터베이스 연결 설정
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // 환경 변수 설정 모듈 import
      useFactory: (configService: ConfigService) => ({
        type: 'mysql', // 데이터베이스 타입 지정
        host: configService.get('database.host'), // DB 호스트 주소
        port: configService.get('database.port'), // DB 포트 번호
        username: configService.get('database.user'), // DB 사용자명
        password: configService.get('database.password'), // DB 비밀번호
        database: configService.get('database.database'), // DB 이름
        entities: [User, KBuzz, Tip, Comment, Like, Scrap, Place, Bookmark], // 사용할 엔티티들 등록
        synchronize: configService.get('app.nodeEnv') === 'development', // 개발 환경에서만 자동 스키마 동기화
        logging: configService.get('app.nodeEnv') === 'development', // 개발 환경에서만 SQL 로깅 활성화
      }),
      inject: [ConfigService], // ConfigService를 의존성 주입으로 사용
    }),
  ],
})
export class DatabaseModule {}
```

### 4.2 K-Buzz 엔티티 구현

```typescript
// src/features/posts/entities/k-buzz.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('k_buzz') // 데이터베이스 테이블명을 'k_buzz'로 지정
@Index(['author_id']) // 작성자 ID로 검색할 때 성능 향상을 위한 인덱스
export class KBuzz {
  // 기본키: 자동 증가하는 큰 정수형 (unsigned)
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  // 게시글 제목 (필수 필드)
  @Column()
  title: string;

  // 게시글 내용 (longtext 타입으로 긴 텍스트 저장 가능)
  @Column('longtext')
  content: string;

  // 조회수 (기본값: 0)
  @Column({ default: 0 })
  view_count: number;

  // 생성일시 (자동으로 현재 시간 설정)
  @CreateDateColumn()
  created_at: Date;

  // 수정일시 (업데이트 시 자동으로 현재 시간 설정)
  @UpdateDateColumn()
  updated_at: Date;

  // 다대일 관계: 여러 게시글이 하나의 사용자에 속함
  @ManyToOne(() => User, user => user.k_buzz_posts)
  @JoinColumn({ name: 'author_id' }) // 외래키 컬럼명 지정
  author: User;

  // 작성자 ID (외래키)
  @Column({ type: 'bigint', unsigned: true })
  author_id: number;
}
```

### 4.3 서비스 레이어 구현

```typescript
// src/features/posts/k-buzz.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KBuzz } from './entities/k-buzz.entity';
import { CreateKBuzzDto } from './dto/create-k-buzz.dto';
import { UpdateKBuzzDto } from './dto/update-k-buzz.dto';

@Injectable() // NestJS의 의존성 주입을 위한 데코레이터
export class KBuzzService {
  constructor(
    @InjectRepository(KBuzz) // KBuzz 엔티티 Repository 주입
    private kBuzzRepository: Repository<KBuzz>,
  ) {}

  // 새 게시글 생성
  async create(createKBuzzDto: CreateKBuzzDto, authorId: number): Promise<KBuzz> {
    // DTO와 작성자 ID를 결합하여 엔티티 인스턴스 생성
    const kBuzz = this.kBuzzRepository.create({
      ...createKBuzzDto, // DTO의 모든 속성 펼침
      author_id: authorId, // 작성자 ID 설정
    });

    // 데이터베이스에 저장하고 반환
    return await this.kBuzzRepository.save(kBuzz);
  }

  // 모든 게시글 조회 (최신순 정렬)
  async findAll(): Promise<KBuzz[]> {
    return await this.kBuzzRepository.find({
      relations: ['author'], // 작성자 정보도 함께 조회 (JOIN)
      order: {
        created_at: 'DESC', // 생성일시 내림차순 정렬 (최신순)
      },
    });
  }

  // 특정 게시글 조회 (조회수 증가 포함)
  async findOne(id: number): Promise<KBuzz> {
    // ID로 게시글 조회
    const kBuzz = await this.kBuzzRepository.findOne({
      where: { id },
      relations: ['author'], // 작성자 정보도 함께 조회
    });

    // 게시글이 존재하지 않으면 예외 발생
    if (!kBuzz) {
      throw new NotFoundException(`K-Buzz post with ID ${id} not found`);
    }

    // 조회수 1 증가
    await this.kBuzzRepository.increment({ id }, 'view_count', 1);

    return kBuzz;
  }

  // 게시글 수정 (작성자만 가능)
  async update(id: number, updateKBuzzDto: UpdateKBuzzDto, userId: number): Promise<KBuzz> {
    // 게시글 존재 여부 확인
    const kBuzz = await this.findOne(id);

    // 작성자가 아닌 경우 수정 권한 없음
    if (kBuzz.author_id !== userId) {
      throw new ForbiddenException('You can only update your own posts');
    }

    // DTO의 속성들을 기존 엔티티에 병합
    Object.assign(kBuzz, updateKBuzzDto);
    
    // 수정된 게시글 저장하고 반환
    return await this.kBuzzRepository.save(kBuzz);
  }

  // 게시글 삭제 (작성자만 가능)
  async remove(id: number, userId: number): Promise<void> {
    // 게시글 존재 여부 확인
    const kBuzz = await this.findOne(id);

    // 작성자가 아닌 경우 삭제 권한 없음
    if (kBuzz.author_id !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    // 게시글 삭제
    await this.kBuzzRepository.remove(kBuzz);
  }
}
```

### 4.4 DTO 구현

```typescript
// src/features/posts/dto/create-k-buzz.dto.ts
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

// K-Buzz 게시글 생성을 위한 DTO (Data Transfer Object)
export class CreateKBuzzDto {
  // 게시글 제목: 문자열, 필수, 최대 200자
  @IsString() // 문자열 타입 검증
  @IsNotEmpty() // 빈 값이 아닌지 검증
  @MaxLength(200) // 최대 길이 200자 제한
  title: string;

  // 게시글 내용: 문자열, 필수
  @IsString() // 문자열 타입 검증
  @IsNotEmpty() // 빈 값이 아닌지 검증
  content: string;
}

// src/features/posts/dto/update-k-buzz.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateKBuzzDto } from './create-k-buzz.dto';

// K-Buzz 게시글 수정을 위한 DTO
// PartialType을 사용하여 CreateKBuzzDto의 모든 속성을 선택적(optional)으로 만듦
export class UpdateKBuzzDto extends PartialType(CreateKBuzzDto) {}
```

---

## 5. NestJS 의존성 주입 (Dependency Injection) 흐름

### 5.1 의존성 주입이란?
**의존성 주입(Dependency Injection)**은 객체가 필요한 의존성을 외부에서 주입받는 디자인 패턴입니다. NestJS는 내장된 IoC(Inversion of Control) 컨테이너를 통해 의존성 주입을 자동으로 관리합니다.

### 5.2 의존성 주입 흐름 분석

#### 5.2.1 애플리케이션 부트스트랩 과정
```typescript
// main.ts - 애플리케이션 진입점
async function bootstrap() {
  // 1. AppModule을 루트 모듈로 NestJS 애플리케이션 생성
  const app = await NestFactory.create(AppModule);
  // 2. 전역 파이프, 가드, 필터 등 설정
  app.useGlobalPipes(new ValidationPipe({...}));
  app.useGlobalFilters(new HttpExceptionFilter());
  // 3. 서버 시작
  await app.listen(process.env.PORT || 3000);
}
```

#### 5.2.2 모듈 계층 구조
```typescript
// app.module.ts - 루트 모듈
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // 전역 설정 모듈
    DatabaseModule,                           // 전역 데이터베이스 모듈
    AuthModule,                              // 인증 모듈
    PostsModule,                             // 게시글 모듈
    // ... 기타 기능 모듈들
  ],
})
export class AppModule {}
```

#### 5.2.3 전역 모듈 설정
```typescript
// database.module.ts - 전역 데이터베이스 모듈
@Global() // 전역 모듈로 설정
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // ConfigService 의존성 주입
      useFactory: (configService: ConfigService) => ({
        // 데이터베이스 연결 설정
        type: 'mysql',
        host: configService.get('database.host'),
        // ... 기타 설정
        entities: [User, KBuzz, Tip, Comment, Like, Scrap, Place, Bookmark],
      }),
      inject: [ConfigService], // ConfigService 주입
    }),
  ],
})
export class DatabaseModule {}
```

#### 5.2.4 기능 모듈에서 Repository 주입
```typescript
// posts.module.ts - 게시글 모듈
@Module({
  imports: [
    // KBuzz, User 엔티티 Repository 등록
    TypeOrmModule.forFeature([KBuzz, User])
  ],
  controllers: [KBuzzController],
  providers: [KBuzzService],
  exports: [KBuzzService], // 다른 모듈에서 사용 가능하도록 export
})
export class PostsModule {}
```

#### 5.2.5 서비스에서 Repository 주입
```typescript
// k-buzz.service.ts - 서비스 레이어
@Injectable() // 의존성 주입 가능한 클래스로 표시
export class KBuzzService {
  constructor(
    // @InjectRepository 데코레이터로 Repository 주입
    @InjectRepository(KBuzz)
    private kBuzzRepository: Repository<KBuzz>,
  ) {}
  
  // Repository를 사용한 비즈니스 로직
  async create(createKBuzzDto: CreateKBuzzDto, authorId: number): Promise<KBuzz> {
    const kBuzz = this.kBuzzRepository.create({
      ...createKBuzzDto,
      author_id: authorId,
    });
    return await this.kBuzzRepository.save(kBuzz);
  }
}
```

#### 5.2.6 컨트롤러에서 서비스 주입
```typescript
// k-buzz.controller.ts - 컨트롤러 레이어
@Controller('k-buzz')
export class KBuzzController {
  constructor(
    // 생성자 주입으로 서비스 인스턴스 주입
    private readonly kBuzzService: KBuzzService
  ) {}
  
  @Post()
  @UseGuards(JwtAuthGuard) // 가드도 의존성 주입으로 관리
  create(@Body() createKBuzzDto: CreateKBuzzDto, @Request() req) {
    return this.kBuzzService.create(createKBuzzDto, req.user.id);
  }
}
```

### 5.3 의존성 주입의 장점

#### 5.3.1 코드 결합도 감소
- **Before**: 하드코딩된 의존성
```typescript
class KBuzzService {
  private repository = new KBuzzRepository(); // 강한 결합
}
```

- **After**: 의존성 주입
```typescript
class KBuzzService {
  constructor(
    @InjectRepository(KBuzz)
    private kBuzzRepository: Repository<KBuzz>, // 느슨한 결합
  ) {}
}
```

#### 5.3.2 테스트 용이성
```typescript
// 테스트에서 Mock Repository 주입 가능
const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
};

const service = new KBuzzService(mockRepository);
```

#### 5.3.3 생명주기 관리
- **Singleton**: 기본적으로 모든 프로바이더는 싱글톤
- **Request-scoped**: 요청마다 새로운 인스턴스 생성
- **Transient**: 매번 새로운 인스턴스 생성

### 5.4 의존성 주입 흐름 다이어그램

```
1. 애플리케이션 시작
   ↓
2. AppModule 로드
   ↓
3. 하위 모듈들 순차 로드
   - ConfigModule (전역)
   - DatabaseModule (전역)
   - AuthModule
   - PostsModule
   ↓
4. 각 모듈의 프로바이더 등록
   - Services
   - Repositories
   - Guards
   - Strategies
   ↓
5. 의존성 그래프 생성 및 해결
   ↓
6. 인스턴스 생성 및 주입
   ↓
7. 애플리케이션 실행 준비 완료
```

### 5.5 실제 의존성 주입 예시

#### 5.5.1 인증 서비스 의존성 주입
```typescript
// auth.service.ts
@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,           // JWT 서비스 주입
    @InjectRepository(User)                     // User Repository 주입
    private readonly userRepository: Repository<User>
  ) {}
}
```

#### 5.5.2 가드에서 서비스 주입
```typescript
// jwt-auth.guard.ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly authService: AuthService   // AuthService 주입
  ) {
    super();
  }
}
```

### 5.6 의존성 주입의 핵심 원칙

1. **Inversion of Control (IoC)**: 의존성 생성과 관리의 제어권을 프레임워크에 위임
2. **Single Responsibility**: 각 클래스는 하나의 책임만 가짐
3. **Dependency Inversion**: 구체적인 구현이 아닌 추상화에 의존
4. **Loose Coupling**: 클래스 간의 결합도를 낮춤

---

## 6. TypeORM 사용 경험

#### 긍정적인 경험
1. **개발 생산성**: SQL 작성 없이 빠른 개발 가능
2. **타입 안정성**: TypeScript와의 완벽한 통합으로 오류 사전 방지
3. **관계 매핑**: 복잡한 관계형 데이터 모델링이 직관적
4. **마이그레이션**: 스키마 변경 관리가 체계적

#### 어려웠던 점
1. **복잡한 쿼리**: 특수한 쿼리는 여전히 QueryBuilder 사용 필요
2. **디버깅**: 생성된 SQL 쿼리 추적의 어려움
3. **학습 곡선**: 데코레이터 문법과 관계 설정 학습 필요

