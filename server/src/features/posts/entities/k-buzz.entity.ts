import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('k_buzz')
@Index(['author_id'])
export class KBuzz {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column()
  title: string;

  @Column('longtext')
  content: string;

  @Column({ default: 0 })
  view_count: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, user => user.k_buzz_posts)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({ type: 'bigint', unsigned: true })
  author_id: number;
}
