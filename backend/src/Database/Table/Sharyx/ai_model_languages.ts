// src/Database/Table/Admin/ai_model_languages.ts
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseTable } from '../BaseTable';
import { sub_ai_model_provider } from './sub_ai_model_provider';
import { languages } from './languages';
import { AuditLogIdentity } from '@Helper/AuditLog.decorators';

@Entity()
export class ai_model_languages extends BaseTable {
  @ManyToOne(() => sub_ai_model_provider, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sub_ai_model_provider_id' })
  sub_ai_model_provider: sub_ai_model_provider;

  @AuditLogIdentity()
  @Column()
  sub_ai_model_provider_id: string;

  @ManyToOne(() => languages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'language_id' })
  language: languages;

  @Column()
  language_id: string;
}
