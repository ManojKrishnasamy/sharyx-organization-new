// src/Model/Admin/AiModelLanguage.model.ts
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { BaseModel } from '../Base.model';

export class AiModelLanguageModel extends BaseModel {
  @IsNotEmpty({ message: 'AI Model ID required' })
  @ApiProperty({ required: true })
  @Type(() => String)
  sub_ai_model_provider_id: string;

  @IsNotEmpty({ message: 'Language ID required' })
  @ApiProperty({ required: true })
  @Type(() => String)
  language_id: string;
}
