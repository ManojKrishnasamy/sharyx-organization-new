import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { BaseModel } from "../Base.model";
import { AIProviderTypeEnum } from "@Root/Helper/Enum/AIProviderTypeEnum";

export class AIProviderModel extends BaseModel {
  @IsNotEmpty({ message: "Provider name required" })
  @ApiProperty({ required: true })
  @Type(() => String)
  name: string;

  @IsNotEmpty({ message: "Provider type required" })
  @ApiProperty({ enum: AIProviderTypeEnum })
  @IsEnum(AIProviderTypeEnum)
  type: AIProviderTypeEnum;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsString()
  api_key?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsString()
  base_url?: string;
}
