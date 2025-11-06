import {
  AuditLogIdentity,
  AuditLogTableRemoveColumns,
} from "@Helper/AuditLog.decorators";
import { Entity, Column, JoinColumn, ManyToOne, Index } from "typeorm";
import { BaseTable } from "../BaseTable";
import { user_role } from "./user_role";
import { customer } from "../Sharyx/customer";
import { workspace } from "../Sharyx/workspace";

@Entity()
export class user extends BaseTable {

  @ManyToOne(() => user_role, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "user_role_id" })
  user_role: user_role;

  @Column({ type: "uuid" })
  @Index()
  user_role_id: string;

  @ManyToOne(() => customer, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "customer_id" })
  customer: customer;
    
  @Column({ type: "uuid",nullable: true })
  @Index()
  customer_id: string;

  @ManyToOne(() => workspace, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "workspace_id" })
  workspace: workspace;
      
  @Column({ type: "uuid",nullable: true })
  @Index()
  workspace_id: string;

  @Column({ type: "text", nullable: true })
  first_name: string;

  @Column({ type: "text", nullable: true })
  last_name: string;

  @AuditLogIdentity()
  @Column({ unique: true })
  email: string;

  @AuditLogTableRemoveColumns()
  @Column({ type: "text" })
  password: string;

  @Column({ nullable: true })
  mobile: string;

  @Column({ type: "bigint", nullable: true })
  reset_otp: number;
}
