// 팁 관리 모듈
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tip } from './entities/tip.entity';

@Module({
  imports: [
    // Tip 엔티티를 TypeORM에 등록하여 Repository 사용 가능
    TypeOrmModule.forFeature([Tip])
  ],
  exports: [
    // 다른 모듈에서 Tip Repository 사용 가능하도록 export
    TypeOrmModule
  ],
})
export class TipsModule {}
