import { Entity, Column, OneToMany, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseTable } from '../BaseTable';
import { user } from '../Admin/user';
import { message_stream } from './message';

@Entity()
export class conversation extends BaseTable {

  @ManyToOne(() => user, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "user_id" })
  user: user;

  @Column({ type: "uuid" })
  @Index()
  user_id: string;


  @Column({ type: 'timestamp', nullable: true })
  ended_at: Date;

  @OneToMany(() => message_stream, message => message.conversation)
  messages: message_stream[];
}