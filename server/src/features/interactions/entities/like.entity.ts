// 좋아요 엔티티: 게시글에 대한 좋아요 정보 관리
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, Unique, Column, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { KBuzz } from '../../posts/entities/k-buzz.entity';
import { Tip } from '../../tips/entities/tip.entity';

@Entity('likes') // 데이터베이스 테이블명을 'likes'로 지정
// 중복 좋아요 방지를 위한 유니크 제약조건
@Unique(['user_id', 'post_type', 'post_id']) // 한 사용자가 같은 게시글에 중복 좋아요 불가
// 성능 최적화를 위한 인덱스 설정
@Index(['post_type', 'post_id']) // 게시글 타입과 ID로 검색할 때 성능 향상
@Index(['user_id']) // 사용자 ID로 검색할 때 성능 향상
export class Like {
  // 기본키: 자동 증가하는 큰 정수형 (unsigned)
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  // 좋아요를 누른 사용자 ID (외래키)
  @Column({ type: 'bigint', unsigned: true })
  user_id: number;

  // 좋아요가 달린 게시글 타입: 'k_buzz' 또는 'tips'
  @Column({ type: 'enum', enum: ['k_buzz', 'tips'] })
  post_type: 'k_buzz' | 'tips';

  // 좋아요가 달린 게시글 ID
  @Column({ type: 'bigint', unsigned: true })
  post_id: number;

  // 좋아요 생성일시 (자동으로 현재 시간 설정)
  @CreateDateColumn()
  created_at: Date;

  // 다대일 관계: 여러 좋아요가 하나의 사용자에 속함
  @ManyToOne(() => User, user => user.likes)
  @JoinColumn({ name: 'user_id' }) // 외래키 컬럼명 지정
  user: User;

  // 다대일 관계: 여러 좋아요가 하나의 K-Buzz 게시글에 속함 (선택적)
  @ManyToOne(() => KBuzz, kBuzz => kBuzz.likes, { nullable: true })
  @JoinColumn({ name: 'post_id' }) // 외래키 컬럼명 지정
  k_buzz_post: KBuzz;

  // 다대일 관계: 여러 좋아요가 하나의 팁 게시글에 속함 (선택적)
  @ManyToOne(() => Tip, tip => tip.likes, { nullable: true })
  @JoinColumn({ name: 'post_id' }) // 외래키 컬럼명 지정
  tip_post: Tip;
}
