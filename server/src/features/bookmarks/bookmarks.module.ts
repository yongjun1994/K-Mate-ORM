// 북마크 관리 모듈
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bookmark } from './entities/bookmark.entity';

@Module({
  imports: [
    // Bookmark 엔티티를 TypeORM에 등록하여 Repository 사용 가능
    TypeOrmModule.forFeature([Bookmark])
  ],
  exports: [
    // 다른 모듈에서 Bookmark Repository 사용 가능하도록 export
    TypeOrmModule
  ],
})
export class BookmarksModule {}
