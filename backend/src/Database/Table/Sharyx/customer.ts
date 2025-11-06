import { Column, Entity } from 'typeorm';
import { BaseTable } from '../BaseTable';
import { AuditLogIdentity } from '@Helper/AuditLog.decorators';
import { PricingPlanEnum } from '@Root/Helper/Enum/PricingPlanEnum';

@Entity()
export class customer extends BaseTable {

  @AuditLogIdentity()
  @Column({ length: 150 })
  name: string;

  @Column({ unique: true, length: 100 })
  workspace_name: string;

  @Column({ unique: true, length: 120 })
  email: string;

  @Column({ nullable: true, length: 20 })
  phone: string;

  @Column({ nullable: true, length: 100 })
  industry: string;

  @Column({ enum:PricingPlanEnum })
  plan_type: PricingPlanEnum;

  @Column({ nullable: true, length: 255 })
  api_key: string;

}
