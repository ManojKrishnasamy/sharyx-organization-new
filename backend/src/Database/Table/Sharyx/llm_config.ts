import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseTable } from '../BaseTable';
import { ai_providers } from './ai_providers';
import { sub_ai_model_provider } from './sub_ai_model_provider';
import { ai_agents } from './agent';
import { languages } from './languages';
import { AuditLogIdentity } from '@Root/Helper/AuditLog.decorators';

@Entity()
export class llm_config extends BaseTable {

  @Column({ type: 'text', nullable: true })
  welcome_message: string;

  @Column({ type: 'text', nullable: true })
  objective: string;

  @Column({ type: 'text', nullable: true })
  system_prompt: string;

  @ManyToOne(() => languages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'language_id' })
  language: languages;

  @Column()
  language_id: string;

    @AuditLogIdentity()
  @Column({ type: 'json', nullable: true })
  config_json: Record<string, any>;

  @Column({ type: 'float', nullable: true, default: 1.0 })
  temperature: number;

  @ManyToOne(() => ai_providers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ai_provider_id' })
  ai_provider: ai_providers;

  @Column()
  ai_provider_id: string;

  @ManyToOne(() => sub_ai_model_provider, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sub_ai_model_provider_id' })
  sub_ai_model_provider: sub_ai_model_provider;

  @Column()
  sub_ai_model_provider_id: string;

  @ManyToOne(() => ai_agents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'agent_id' })
  ai_agent: ai_agents;

  @Column()
  agent_id: string;
}
