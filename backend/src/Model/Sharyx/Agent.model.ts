import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { BaseModel } from "../Base.model";

export class AgentModel extends BaseModel {
  @IsNotEmpty({ message: "Customer ID required" })
  @ApiProperty({ required: true })
  @Type(() => String)
  customer_id: string;

  @IsNotEmpty({ message: "Workspace ID required" })
  @ApiProperty({ required: true })
  @Type(() => String)
  workspace_id: string;

  @IsNotEmpty({ message: "Agent name required" })
  @ApiProperty({ required: true })
  @IsString()
  name: string;

  @IsOptional({ message: "Auto Generate" })
  @ApiProperty({ required: false })
  @IsString()
  secure_id?: string;
}
