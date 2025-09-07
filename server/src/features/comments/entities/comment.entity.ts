// 댓글 엔티티: 게시글에 대한 댓글 정보 관리
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('comments') // 데이터베이스 테이블명을 'comments'로 지정
// 성능 최적화를 위한 인덱스 설정
@Index(['post_type', 'post_id']) // 게시글 타입과 ID로 검색할 때 성능 향상
@Index(['author_id']) // 작성자 ID로 검색할 때 성능 향상
export class Comment {
  // 기본키: 자동 증가하는 큰 정수형 (unsigned)
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  // 댓글이 달린 게시글 타입: 'k_buzz' 또는 'tips'
  @Column({ type: 'enum', enum: ['k_buzz', 'tips'] })
  post_type: 'k_buzz' | 'tips';

  // 댓글이 달린 게시글 ID
  @Column({ type: 'bigint', unsigned: true })
  post_id: number;

  // 댓글 작성자 ID (외래키)
  @Column({ type: 'bigint', unsigned: true })
  author_id: number;

  // 댓글 내용 (text 타입으로 긴 텍스트 저장 가능)
  @Column('text')
  content: string;

  // 댓글 생성일시 (자동으로 현재 시간 설정)
  @CreateDateColumn()
  created_at: Date;

  // 댓글 수정일시 (업데이트 시 자동으로 현재 시간 설정)
  @UpdateDateColumn()
  updated_at: Date;

  // 다대일 관계: 여러 댓글이 하나의 사용자에 속함
  @ManyToOne(() => User, user => user.comments)
  @JoinColumn({ name: 'author_id' }) // 외래키 컬럼명 지정
  author: User;
}
