// 여행 팁 엔티티: 버스 가이드, 지하철 가이드, 맛집 북 등 여행 정보 관리
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { Like } from '../../interactions/entities/like.entity';
import { Scrap } from '../../interactions/entities/scrap.entity';

@Entity('tips') // 데이터베이스 테이블명을 'tips'로 지정
// 성능 최적화를 위한 인덱스 설정
@Index(['tip_type']) // 팁 타입으로 검색할 때 성능 향상
@Index(['author_id']) // 작성자 ID로 검색할 때 성능 향상
export class Tip {
  // 기본키: 자동 증가하는 큰 정수형 (unsigned)
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  // 팁 제목 (필수 필드)
  @Column()
  title: string;

  // 팁 내용 (longtext 타입으로 긴 텍스트 저장 가능)
  @Column('longtext')
  content: string;

  // 팁 타입: 버스 가이드, 지하철 가이드, 맛집 북
  @Column({ type: 'enum', enum: ['bus_guide', 'subway_guide', 'restaurant_book'] })
  tip_type: 'bus_guide' | 'subway_guide' | 'restaurant_book';

  // 조회수 (기본값: 0)
  @Column({ default: 0 })
  view_count: number;

  // 스크랩 수 (기본값: 0)
  @Column({ default: 0 })
  scrap_count: number;

  // 상단 고정 여부 (기본값: false)
  @Column({ default: false })
  is_pinned: boolean;

  // 생성일시 (자동으로 현재 시간 설정)
  @CreateDateColumn()
  created_at: Date;

  // 수정일시 (업데이트 시 자동으로 현재 시간 설정)
  @UpdateDateColumn()
  updated_at: Date;

  // 다대일 관계: 여러 팁이 하나의 사용자에 속함
  @ManyToOne(() => User, user => user.tips)
  @JoinColumn({ name: 'author_id' }) // 외래키 컬럼명 지정
  author: User;

  // 작성자 ID (외래키)
  @Column({ type: 'bigint', unsigned: true })
  author_id: number;

  // 일대다 관계: 하나의 팁에 여러 댓글이 달림
  @OneToMany(() => Comment, comment => comment.tip_post)
  comments: Comment[];

  // 일대다 관계: 하나의 팁에 여러 좋아요가 달림
  @OneToMany(() => Like, like => like.tip_post)
  likes: Like[];

  // 일대다 관계: 하나의 팁이 여러 스크랩에 포함됨
  @OneToMany(() => Scrap, scrap => scrap.tip_post)
  scraps: Scrap[];
}
