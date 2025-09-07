import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KBuzz } from './entities/k-buzz.entity';
import { CreateKBuzzDto } from './dto/create-k-buzz.dto';
import { UpdateKBuzzDto } from './dto/update-k-buzz.dto';

@Injectable()
export class KBuzzService {
  constructor(
    @InjectRepository(KBuzz)
    private kBuzzRepository: Repository<KBuzz>,
  ) {}

  async create(createKBuzzDto: CreateKBuzzDto, authorId: number): Promise<KBuzz> {
    const kBuzz = this.kBuzzRepository.create({
      ...createKBuzzDto,
      author_id: authorId,
    });

    return await this.kBuzzRepository.save(kBuzz);
  }

  async findAll(): Promise<KBuzz[]> {
    return await this.kBuzzRepository.find({
      relations: ['author'],
      order: {
        created_at: 'DESC',
      },
    });
  }


  async findOne(id: number): Promise<KBuzz> {
    const kBuzz = await this.kBuzzRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!kBuzz) {
      throw new NotFoundException(`K-Buzz post with ID ${id} not found`);
    }

    await this.kBuzzRepository.increment({ id }, 'view_count', 1);

    return kBuzz;
  }

  async update(id: number, updateKBuzzDto: UpdateKBuzzDto, userId: number): Promise<KBuzz> {
    const kBuzz = await this.findOne(id);

    if (kBuzz.author_id !== userId) {
      throw new ForbiddenException('You can only update your own posts');
    }

    Object.assign(kBuzz, updateKBuzzDto);
    
    return await this.kBuzzRepository.save(kBuzz);
  }

  async remove(id: number, userId: number): Promise<void> {
    const kBuzz = await this.findOne(id);

    if (kBuzz.author_id !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.kBuzzRepository.remove(kBuzz);
  }
}
