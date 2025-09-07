// K-Mate 애플리케이션의 루트 모듈
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';

// 기능별 모듈들 import
import { AuthModule } from './features/auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './features/users/users.module';
import { PlacesModule } from './features/places/places.module';
import { PostsModule } from './features/posts/posts.module';
import { TipsModule } from './features/tips/tips.module';
import { BookmarksModule } from './features/bookmarks/bookmarks.module';
import { InteractionsModule } from './features/interactions/interactions.module';
import { CommentsModule } from './features/comments/comments.module';

@Module({
  imports: [
    // 환경 설정 모듈: 전역으로 설정하여 모든 모듈에서 사용 가능
    ConfigModule.forRoot({
      isGlobal: true, // 전역 모듈로 설정
      load: [appConfig, databaseConfig], // 커스텀 설정 파일들 로드
      envFilePath: ['.env', '.env.local', '.env.development'], // 환경변수 파일 경로들
    }),
    // 데이터베이스 연결 모듈
    DatabaseModule,
    // 인증 관련 모듈
    AuthModule,
    // 사용자 관리 모듈
    UsersModule,
    // 장소 관리 모듈
    PlacesModule,
    // 게시글 관리 모듈 (K-Buzz)
    PostsModule,
    // 팁 관리 모듈
    TipsModule,
    // 북마크 관리 모듈
    BookmarksModule,
    // 상호작용 관리 모듈 (좋아요, 스크랩)
    InteractionsModule,
    // 댓글 관리 모듈
    CommentsModule,
  ],
})
export class AppModule {}
