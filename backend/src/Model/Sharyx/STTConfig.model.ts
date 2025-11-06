import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsObject } from "class-validator";
import { BaseModel } from "../Base.model";

export class SSTConfigModel extends BaseModel {
  @IsOptional()
  @ApiProperty({ required: false })
  @IsString()
  language_id?: string;

  @IsOptional()
  @ApiProperty({ required: false, type: Object, description: "Additional configuration parameters in JSON format" })
  @IsObject()
  config_json?: Record<string, any>;

  @IsNotEmpty({ message: "AI provider ID required" })
  @ApiProperty({ required: true, description: "Reference ID of the AI provider" })
  @Type(() => String)
  ai_provider_id: string;

  @IsNotEmpty({ message: "Sub AI model provider ID required" })
  @ApiProperty({ required: true, description: "Reference ID of the sub AI model provider" })
  @Type(() => String)
  sub_ai_model_provider_id: string;

  @IsNotEmpty({ message: "Agent ID required" })
  @ApiProperty({ required: true, description: "" })
  @Type(() => String)
  agent_id: string;
}
