// import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
// import { workspace } from "./workspace";
// import { ai_models } from "./ai_models";
// import { BaseTable } from "../BaseTable";

// @Entity({ name: "knowledge_bases" })
// export class knowledge_base extends BaseTable {
    
//   @ManyToOne(() => workspace, { onDelete: "CASCADE" })
//   @JoinColumn({ name: "workspace_id" })
//   workspace: workspace;

//   @Column({ type: "uuid" })
//   workspace_id: string;

//   @Column({ length: 150 })
//   title: string;

//   @Column({ length: 50 })
//   type: string;

//   @Column({ type: "text", nullable: true })
//   source_url: string;

//   @Column({ type: "jsonb", nullable: true })
//   data: Record<string, any>;

//   @ManyToOne(() => ai_models, { onDelete: "SET NULL" })
//   @JoinColumn({ name: "embedding_model" })
//   embedding_model: ai_models;

//   @Column({ length: 100, nullable: true })
//   embedding_model_id: string;

// }
