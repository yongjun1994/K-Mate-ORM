// K-Buzz 게시글 엔티티: 게시판의 게시글 정보 관리
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('k_buzz') // 데이터베이스 테이블명을 'k_buzz'로 지정
@Index(['author_id']) // 작성자 ID로 검색할 때 성능 향상을 위한 인덱스
export class KBuzz {
  // 기본키: 자동 증가하는 큰 정수형 (unsigned)
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  // 게시글 제목 (필수 필드)
  @Column()
  title: string;

  // 게시글 내용 (longtext 타입으로 긴 텍스트 저장 가능)
  @Column('longtext')
  content: string;

  // 조회수 (기본값: 0)
  @Column({ default: 0 })
  view_count: number;

  // 생성일시 (자동으로 현재 시간 설정)
  @CreateDateColumn()
  created_at: Date;

  // 수정일시 (업데이트 시 자동으로 현재 시간 설정)
  @UpdateDateColumn()
  updated_at: Date;

  // 다대일 관계: 여러 게시글이 하나의 사용자에 속함
  @ManyToOne(() => User, user => user.k_buzz_posts)
  @JoinColumn({ name: 'author_id' }) // 외래키 컬럼명 지정
  author: User;

  // 작성자 ID (외래키)
  @Column({ type: 'bigint', unsigned: true })
  author_id: number;
}
