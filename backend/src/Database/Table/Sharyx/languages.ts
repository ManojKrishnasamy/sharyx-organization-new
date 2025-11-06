// src/Database/Table/Admin/languages.ts
import { Column, Entity } from 'typeorm';
import { BaseTable } from '../BaseTable';
import { AuditLogIdentity } from '@Helper/AuditLog.decorators';
import { AIProviderTypeEnum } from '@Root/Helper/Enum/AIProviderTypeEnum';

@Entity()
export class languages extends BaseTable {
  @AuditLogIdentity()
  @Column({ length: 100 })
  name: string;

  @Column({ length: 10, unique: true })
  code: string;

  @Column({ type: 'enum', enum: AIProviderTypeEnum })
  type: AIProviderTypeEnum;
}
