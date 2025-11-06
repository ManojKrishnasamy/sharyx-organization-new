import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseTable } from '../BaseTable';
import { ai_providers } from './ai_providers';

@Entity()
export class sub_ai_model_provider extends BaseTable {

  @ManyToOne(() => ai_providers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ai_provider_id' })
  ai_provider: ai_providers;

  @Column()
  ai_provider_id: string;

  @Column({ length: 100 })
  model_name: string;

  @Column({ type: 'jsonb', nullable: true })
  configuration: Record<string, any>;
}
