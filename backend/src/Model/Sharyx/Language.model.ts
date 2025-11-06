// src/Model/Admin/Language.model.ts
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsEnum } from 'class-validator';
import { BaseModel } from '../Base.model';
import { AIProviderTypeEnum } from '@Root/Helper/Enum/AIProviderTypeEnum';

export class LanguageModel extends BaseModel {
  @IsNotEmpty({ message: 'Language name is required' })
  @ApiProperty({ required: true })
  @Type(() => String)
  name: string;

  @IsNotEmpty({ message: 'Language code is required' })
  @ApiProperty({ required: true })
  @Type(() => String)
  code: string;

  @IsNotEmpty({ message: "Provider type required" })
  @ApiProperty({ enum: AIProviderTypeEnum })
  @IsEnum(AIProviderTypeEnum)
  type: AIProviderTypeEnum;
}
