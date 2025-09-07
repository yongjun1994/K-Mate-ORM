// 사용자 엔티티: Google OAuth를 통한 사용자 정보 관리
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { KBuzz } from '../../posts/entities/k-buzz.entity';
import { Tip } from '../../tips/entities/tip.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { Like } from '../../interactions/entities/like.entity';
import { Scrap } from '../../interactions/entities/scrap.entity';
import { Bookmark } from '../../bookmarks/entities/bookmark.entity';

@Entity('users') // 데이터베이스 테이블명을 'users'로 지정
export class User {
  // 기본키: 자동 증가하는 큰 정수형 (unsigned)
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  // 이메일 주소 (고유값)
  @Column({ unique: true })
  email: string;

  // 사용자 이름
  @Column()
  name: string;

  // 프로필 이미지 URL (선택적)
  @Column({ nullable: true })
  avatar_url: string;

  // Google OAuth 고유 사용자 ID (고유값)
  @Column({ unique: true })
  google_sub: string;

  // 이메일 인증 여부 (기본값: false)
  @Column({ type: 'boolean', default: false })
  email_verified: boolean;

  // 사용자 역할: 'user' 또는 'admin' (기본값: 'user')
  @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
  role: 'user' | 'admin';

  // 계정 생성일시 (자동으로 현재 시간 설정)
  @CreateDateColumn()
  created_at: Date;

  // 일대다 관계: 사용자가 작성한 K-Buzz 게시글들
  @OneToMany(() => KBuzz, kBuzz => kBuzz.author)
  k_buzz_posts: KBuzz[];

  // 일대다 관계: 사용자가 작성한 팁들
  @OneToMany(() => Tip, tip => tip.author)
  tips: Tip[];

  // 일대다 관계: 사용자가 작성한 댓글들
  @OneToMany(() => Comment, comment => comment.author)
  comments: Comment[];

  // 일대다 관계: 사용자가 누른 좋아요들
  @OneToMany(() => Like, like => like.user)
  likes: Like[];

  // 일대다 관계: 사용자가 스크랩한 게시글들
  @OneToMany(() => Scrap, scrap => scrap.user)
  scraps: Scrap[];

  // 일대다 관계: 사용자가 북마크한 항목들
  @OneToMany(() => Bookmark, bookmark => bookmark.user)
  bookmarks: Bookmark[];
}
