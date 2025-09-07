// K-Buzz 게시판 서비스: 게시글 비즈니스 로직 처리
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KBuzz } from './entities/k-buzz.entity';
import { CreateKBuzzDto } from './dto/create-k-buzz.dto';
import { UpdateKBuzzDto } from './dto/update-k-buzz.dto';

@Injectable()
export class KBuzzService {
  constructor(
    @InjectRepository(KBuzz) // KBuzz 엔티티 Repository 주입
    private kBuzzRepository: Repository<KBuzz>,
  ) {}

  // 새 게시글 생성
  async create(createKBuzzDto: CreateKBuzzDto, authorId: number): Promise<KBuzz> {
    // DTO와 작성자 ID를 결합하여 엔티티 인스턴스 생성
    const kBuzz = this.kBuzzRepository.create({
      ...createKBuzzDto, // DTO의 모든 속성 펼침
      author_id: authorId, // 작성자 ID 설정
    });

    // 데이터베이스에 저장하고 반환
    return await this.kBuzzRepository.save(kBuzz);
  }

  // 모든 게시글 조회 (최신순 정렬)
  async findAll(): Promise<KBuzz[]> {
    return await this.kBuzzRepository.find({
      relations: ['author'], // 작성자 정보도 함께 조회 (JOIN)
      order: {
        created_at: 'DESC', // 생성일시 내림차순 정렬 (최신순)
      },
    });
  }

  // 특정 게시글 조회 (조회수 증가 포함)
  async findOne(id: number): Promise<KBuzz> {
    // ID로 게시글 조회
    const kBuzz = await this.kBuzzRepository.findOne({
      where: { id },
      relations: ['author'], // 작성자 정보도 함께 조회
    });

    // 게시글이 존재하지 않으면 예외 발생
    if (!kBuzz) {
      throw new NotFoundException(`K-Buzz post with ID ${id} not found`);
    }

    // 조회수 1 증가
    await this.kBuzzRepository.increment({ id }, 'view_count', 1);

    return kBuzz;
  }

  // 게시글 수정 (작성자만 가능)
  async update(id: number, updateKBuzzDto: UpdateKBuzzDto, userId: number): Promise<KBuzz> {
    // 게시글 존재 여부 확인
    const kBuzz = await this.findOne(id);

    // 작성자가 아닌 경우 수정 권한 없음
    if (kBuzz.author_id !== userId) {
      throw new ForbiddenException('You can only update your own posts');
    }

    // DTO의 속성들을 기존 엔티티에 병합
    Object.assign(kBuzz, updateKBuzzDto);
    
    // 수정된 게시글 저장하고 반환
    return await this.kBuzzRepository.save(kBuzz);
  }

  // 게시글 삭제 (작성자만 가능)
  async remove(id: number, userId: number): Promise<void> {
    // 게시글 존재 여부 확인
    const kBuzz = await this.findOne(id);

    // 작성자가 아닌 경우 삭제 권한 없음
    if (kBuzz.author_id !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    // 게시글 삭제
    await this.kBuzzRepository.remove(kBuzz);
  }
}
