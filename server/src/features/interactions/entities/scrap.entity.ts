// 스크랩 엔티티: 사용자가 게시글을 스크랩한 정보 관리
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, Unique, Column, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { KBuzz } from '../../posts/entities/k-buzz.entity';
import { Tip } from '../../tips/entities/tip.entity';

@Entity('scraps') // 데이터베이스 테이블명을 'scraps'로 지정
// 중복 스크랩 방지를 위한 유니크 제약조건
@Unique(['user_id', 'post_type', 'post_id']) // 한 사용자가 같은 게시글을 중복 스크랩할 수 없음
// 성능 최적화를 위한 인덱스 설정
@Index(['post_type', 'post_id']) // 게시글 타입과 ID로 검색할 때 성능 향상
@Index(['user_id']) // 사용자 ID로 검색할 때 성능 향상
export class Scrap {
  // 기본키: 자동 증가하는 큰 정수형 (unsigned)
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  // 스크랩한 사용자 ID (외래키)
  @Column({ type: 'bigint', unsigned: true })
  user_id: number;

  // 스크랩한 게시글 타입: 'k_buzz' 또는 'tips'
  @Column({ type: 'enum', enum: ['k_buzz', 'tips'] })
  post_type: 'k_buzz' | 'tips';

  // 스크랩한 게시글 ID
  @Column({ type: 'bigint', unsigned: true })
  post_id: number;

  // 스크랩 생성일시 (자동으로 현재 시간 설정)
  @CreateDateColumn()
  created_at: Date;

  // 다대일 관계: 여러 스크랩이 하나의 사용자에 속함
  @ManyToOne(() => User, user => user.scraps)
  @JoinColumn({ name: 'user_id' }) // 외래키 컬럼명 지정
  user: User;

  // 다대일 관계: 여러 스크랩이 하나의 K-Buzz 게시글에 속함 (nullable)
  @ManyToOne(() => KBuzz, kBuzz => kBuzz.scraps, { nullable: true })
  @JoinColumn({ name: 'post_id' }) // 외래키 컬럼명 지정
  k_buzz_post: KBuzz;

  // 다대일 관계: 여러 스크랩이 하나의 팁에 속함 (nullable)
  @ManyToOne(() => Tip, tip => tip.scraps, { nullable: true })
  @JoinColumn({ name: 'post_id' }) // 외래키 컬럼명 지정
  tip_post: Tip;
}
