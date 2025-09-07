// K-Buzz 게시글 수정을 위한 DTO (Data Transfer Object)
import { PartialType } from '@nestjs/mapped-types';
import { CreateKBuzzDto } from './create-k-buzz.dto';

// CreateKBuzzDto의 모든 필드를 선택적(optional)으로 만든 수정용 DTO
// PartialType을 사용하여 CreateKBuzzDto의 모든 필드를 ?로 변환
export class UpdateKBuzzDto extends PartialType(CreateKBuzzDto) {}
