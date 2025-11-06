import { Column, Entity } from 'typeorm';
import { BaseTable } from '../BaseTable';
import { AuditLogIdentity } from '@Helper/AuditLog.decorators';
import { AIProviderTypeEnum } from '@Root/Helper/Enum/AIProviderTypeEnum';



@Entity()
export class ai_providers extends BaseTable {

  @AuditLogIdentity()
  @Column({ length: 100, unique: true })
  name: string; 

  @Column({ type: 'enum', enum: AIProviderTypeEnum })
  type: AIProviderTypeEnum; 

  @Column({ type: 'text', nullable: true })
  api_key: string;

  @Column({ nullable: true, length: 255 })
  base_url: string;
}
