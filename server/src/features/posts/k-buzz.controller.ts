// K-Buzz 게시판 컨트롤러: 게시글 CRUD API 엔드포인트
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { KBuzzService } from './k-buzz.service';
import { CreateKBuzzDto } from './dto/create-k-buzz.dto';
import { UpdateKBuzzDto } from './dto/update-k-buzz.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('k-buzz') // '/k-buzz' 경로로 라우팅
export class KBuzzController {
  constructor(private readonly kBuzzService: KBuzzService) {}

  // 새 게시글 생성
  @Post()
  @UseGuards(JwtAuthGuard) // JWT 인증 가드 적용
  create(@Body() createKBuzzDto: CreateKBuzzDto, @Request() req) {
    // 요청 본문의 DTO와 인증된 사용자 ID로 게시글 생성
    return this.kBuzzService.create(createKBuzzDto, req.user.id);
  }

  // 모든 게시글 조회 (인증 불필요)
  @Get()
  findAll() {
    return this.kBuzzService.findAll();
  }

  // 특정 게시글 조회 (인증 불필요)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    // URL 파라미터를 정수로 변환하여 게시글 조회
    return this.kBuzzService.findOne(id);
  }

  // 게시글 수정
  @Patch(':id')
  @UseGuards(JwtAuthGuard) // JWT 인증 가드 적용
  update(@Param('id', ParseIntPipe) id: number, @Body() updateKBuzzDto: UpdateKBuzzDto, @Request() req) {
    // 게시글 ID, 수정할 데이터, 인증된 사용자 ID로 게시글 수정
    return this.kBuzzService.update(id, updateKBuzzDto, req.user.id);
  }

  // 게시글 삭제
  @Delete(':id')
  @UseGuards(JwtAuthGuard) // JWT 인증 가드 적용
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    // 게시글 ID와 인증된 사용자 ID로 게시글 삭제
    return this.kBuzzService.remove(id, req.user.id);
  }
}
