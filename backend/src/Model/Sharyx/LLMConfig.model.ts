import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsNumber, IsObject } from "class-validator";
import { BaseModel } from "../Base.model";

export class LLMConfigModel extends BaseModel {
  @IsOptional()
  @ApiProperty({ required: false, description: "Welcome message displayed to users" })
  @IsString()
  welcome_message?: string;

  @IsOptional()
  @ApiProperty({ required: false, description: "Objective or purpose of this LLM configuration" })
  @IsString()
  objective?: string;

  @IsOptional()
  @ApiProperty({ required: false, description: "System prompt or context for the model" })
  @IsString()
  system_prompt?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsString()
  language_id?: string;

  @IsOptional()
  @ApiProperty({ required: false, type: Object, description: "Additional configuration in JSON format" })
  @IsObject()
  config_json?: Record<string, any>;

  @IsOptional()
  @ApiProperty({ required: false, default: 1.0, description: "Temperature value for model randomness" })
  @Type(() => Number)
  @IsNumber()
  temperature?: number;

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
