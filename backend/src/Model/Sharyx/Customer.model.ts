import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BaseModel } from '../Base.model';
import { PricingPlanEnum } from '@Root/Helper/Enum/PricingPlanEnum';

export class CustomerModel extends BaseModel {
    
  @IsNotEmpty({ message: 'Customer name is required' })
  @ApiProperty({ required: true, example: 'Acme Corp' })
  @Type(() => String)
  name: string;

  @IsNotEmpty({ message: 'Workspace name is required' })
  @ApiProperty({ required: true, example: 'acme-ai' })
  @Type(() => String)
  workspace_name: string;

  @IsEmail({}, { message: 'Valid email is required' })
  @ApiProperty({ required: true, example: 'contact@acme.com' })
  @Type(() => String)
  email: string;

  @IsOptional()
  @ApiProperty({ required: false, example: '+1-555-1234567' })
  @Type(() => String)
  phone?: string;

  @IsOptional()
  @ApiProperty({ required: false, example: 'Technology' })
  @Type(() => String)
  industry?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  @Type(() => IsEnum)
  plan_type?: PricingPlanEnum;

  @IsOptional()
  @ApiProperty({ required: false })
  @Type(() => String)
  api_key?: string;

}
