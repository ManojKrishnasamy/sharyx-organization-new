import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional } from "class-validator";
import { BaseModel } from "../Base.model";


export class SubAIModelProviderModel extends BaseModel {

  @IsNotEmpty({ message: "AI Provider ID required" })
  @ApiProperty({ required: true })
  @Type(() => String)
  ai_provider_id: string;

  @IsNotEmpty({ message: "Model name required" })
  @ApiProperty({ required: true })
  @Type(() => String)
  model_name: string;

  @IsOptional()
  @ApiProperty({ required: false, description: "Configuration JSON" })
  configuration?: Record<string, any>;

  @IsOptional()
  @IsArray()
  @ApiProperty({ required: false, type: [String], description: "List of Language IDs" })
  language_ids?: string[];

}
