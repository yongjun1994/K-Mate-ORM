// 상호작용 관리 모듈 (좋아요, 스크랩)
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { Scrap } from './entities/scrap.entity';

@Module({
  imports: [
    // Like, Scrap 엔티티를 TypeORM에 등록하여 Repository 사용 가능
    TypeOrmModule.forFeature([Like, Scrap])
  ],
  exports: [
    // 다른 모듈에서 Like, Scrap Repository 사용 가능하도록 export
    TypeOrmModule
  ],
})
export class InteractionsModule {}
