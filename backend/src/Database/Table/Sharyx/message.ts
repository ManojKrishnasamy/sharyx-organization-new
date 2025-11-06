////

import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseTable } from '../BaseTable';
import { conversation } from './conversation';

@Entity()
export class message_stream extends BaseTable {

  @ManyToOne(() => conversation, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "conversation_id" })
  conversation: conversation;

  @Column({ type: "uuid" })
  @Index()
  conversation_id: string;

  @Column({ type: 'varchar', length: 50 })
  role: string;

  @Column({ type: 'text' })
  content: string;

}