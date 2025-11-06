import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseTable } from '../BaseTable';
import { AuditLogIdentity } from '@Helper/AuditLog.decorators';
import { customer } from './customer';

@Entity()
export class workspace extends BaseTable {
    
  @ManyToOne(() => customer, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "customer_id" })
  customer: customer;
  
  @Column({ type: "uuid" })
  @Index()
  customer_id: string;

  @AuditLogIdentity()
  @Column({ length: 100 })
  name: string;

    @Column({ unique: true })
  slug: string;



}
