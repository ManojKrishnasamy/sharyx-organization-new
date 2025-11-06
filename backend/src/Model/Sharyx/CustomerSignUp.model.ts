import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CustomerSignUpModel {
    
  @IsNotEmpty({ message: 'company name is required' })
  @ApiProperty({ required: true })
  @Type(() => String)
  company_name: string;

  @IsNotEmpty({ message: 'Workspace name is required' })
  @ApiProperty({ required: true})
  @Type(() => String)
  workspace_name: string;

  @IsNotEmpty({ message: 'Workspace name is required' })
  @ApiProperty({ required: true })
  @Type(() => String)
  user_name: string;

  @IsEmail({}, { message: 'Invaild Email format' })
  @IsNotEmpty({ message: 'Email required' })
  @ApiProperty({ required: true })
  @Type(() => String)
  email: string;

  @IsNotEmpty({ message: 'Password required' })
  @ApiProperty({ required: true })
  @Type(() => String)
  password: string;

}
