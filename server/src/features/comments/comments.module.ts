// 댓글 관리 모듈
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [
    // Comment 엔티티를 TypeORM에 등록하여 Repository 사용 가능
    TypeOrmModule.forFeature([Comment])
  ],
  exports: [
    // 다른 모듈에서 Comment Repository 사용 가능하도록 export
    TypeOrmModule
  ],
})
export class CommentsModule {}
