// 게시글 관리 모듈: K-Buzz 게시판 기능을 담당
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KBuzzController } from './k-buzz.controller';
import { KBuzzService } from './k-buzz.service';
import { KBuzz } from './entities/k-buzz.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    // KBuzz와 User 엔티티를 TypeORM에 등록하여 Repository 사용 가능
    TypeOrmModule.forFeature([KBuzz, User])
  ],
  controllers: [
    KBuzzController // K-Buzz 게시판 API 엔드포인트
  ],
  providers: [
    KBuzzService // K-Buzz 게시판 비즈니스 로직
  ],
  exports: [
    KBuzzService // 다른 모듈에서 KBuzzService 사용 가능하도록 export
  ],
})
export class PostsModule {}
