// 북마크 엔티티: 사용자가 장소를 북마크한 정보 관리
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, Unique, Column, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Place } from '../../places/entities/place.entity';

@Entity('bookmarks') // 데이터베이스 테이블명을 'bookmarks'로 지정
// 중복 북마크 방지를 위한 유니크 제약조건
@Unique(['user_id', 'place_id']) // 한 사용자가 같은 장소를 중복 북마크할 수 없음
// 성능 최적화를 위한 인덱스 설정
@Index(['user_id']) // 사용자 ID로 검색할 때 성능 향상
@Index(['place_id']) // 장소 ID로 검색할 때 성능 향상
export class Bookmark {
  // 기본키: 자동 증가하는 큰 정수형 (unsigned)
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  // 북마크한 사용자 ID (외래키)
  @Column({ type: 'bigint', unsigned: true })
  user_id: number;

  // 북마크한 장소 ID (외래키)
  @Column({ type: 'bigint', unsigned: true })
  place_id: number;

  // 북마크 생성일시 (자동으로 현재 시간 설정)
  @CreateDateColumn()
  created_at: Date;

  // 다대일 관계: 여러 북마크가 하나의 사용자에 속함
  @ManyToOne(() => User, user => user.bookmarks)
  @JoinColumn({ name: 'user_id' }) // 외래키 컬럼명 지정
  user: User;

  // 다대일 관계: 여러 북마크가 하나의 장소에 속함
  @ManyToOne(() => Place, place => place.bookmarks)
  @JoinColumn({ name: 'place_id' }) // 외래키 컬럼명 지정
  place: Place;
}
