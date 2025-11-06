import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseTable } from '../BaseTable';
import { customer } from './customer';
import { workspace } from './workspace';

@Entity()
export class ai_agents extends BaseTable {

  @ManyToOne(() => customer, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  customer: customer;

  @Column()
  customer_id: string;

  @ManyToOne(() => workspace, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspace_id' })
  workspace: workspace;

  @Column()
  workspace_id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100 })
  secure_id: string;


}
