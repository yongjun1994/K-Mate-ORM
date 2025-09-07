// 장소 엔티티: 여행지, 맛집, 카페 등 위치 정보 관리
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Bookmark } from '../../bookmarks/entities/bookmark.entity';

@Entity('places') // 데이터베이스 테이블명을 'places'로 지정
export class Place {
  // 기본키: 자동 증가하는 큰 정수형 (unsigned)
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  // 장소 타입: 여행지, 맛집, 카페
  @Column({ type: 'enum', enum: ['travel', 'food', 'cafe'] })
  type: 'travel' | 'food' | 'cafe';

  // 장소명 (필수 필드)
  @Column()
  name: string;

  // 장소 설명 (선택 필드)
  @Column({ nullable: true })
  description: string;

  // Google Places API ID (선택 필드)
  @Column({ nullable: true })
  google_place_id: string;

  // 위도 (decimal 타입으로 정밀한 좌표 저장)
  @Column({ type: 'decimal', precision: 9, scale: 6 })
  lat: number;

  // 경도 (decimal 타입으로 정밀한 좌표 저장)
  @Column({ type: 'decimal', precision: 9, scale: 6 })
  lng: number;

  // 주소 (선택 필드)
  @Column({ nullable: true })
  address: string;

  // 전화번호 (선택 필드)
  @Column({ nullable: true })
  phone: string;

  // 웹사이트 URL (선택 필드)
  @Column({ nullable: true })
  website: string;

  // 일대다 관계: 하나의 장소가 여러 북마크에 포함됨
  @OneToMany(() => Bookmark, bookmark => bookmark.place)
  bookmarks: Bookmark[];
}
