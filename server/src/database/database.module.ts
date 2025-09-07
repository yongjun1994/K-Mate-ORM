// TypeORM 데이터베이스 연결 설정 모듈
import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";

// 모든 엔티티들을 import하여 TypeORM이 인식할 수 있도록 함
import { User } from "../features/users/entities/user.entity";
import { KBuzz } from "../features/posts/entities/k-buzz.entity";
import { Tip } from "../features/tips/entities/tip.entity";
import { Comment } from "../features/comments/entities/comment.entity";
import { Like } from "../features/interactions/entities/like.entity";
import { Scrap } from "../features/interactions/entities/scrap.entity";
import { Place } from "../features/places/entities/place.entity";
import { Bookmark } from "../features/bookmarks/entities/bookmark.entity";

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
export class DatabaseModule {
}
