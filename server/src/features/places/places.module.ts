// 장소 관리 모듈
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Place } from './entities/place.entity';

@Module({
  imports: [
    // Place 엔티티를 TypeORM에 등록하여 Repository 사용 가능
    TypeOrmModule.forFeature([Place])
  ],
  exports: [
    // 다른 모듈에서 Place Repository 사용 가능하도록 export
    TypeOrmModule
  ],
})
export class PlacesModule {}
