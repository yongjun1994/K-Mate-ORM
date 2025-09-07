// 사용자 관리 모듈
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [
    // User 엔티티를 TypeORM에 등록하여 Repository 사용 가능
    TypeOrmModule.forFeature([User])
  ],
  exports: [
    // 다른 모듈에서 User Repository 사용 가능하도록 export
    TypeOrmModule
  ],
})
export class UsersModule {}
