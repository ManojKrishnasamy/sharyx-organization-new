// import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
// import { knowledge_base } from "./knowledge_bases";
// import { BaseTable } from "../BaseTable";


// @Entity({ name: "knowledge_documents" })
// export class knowledge_documents extends BaseTable {
//   @PrimaryGeneratedColumn("uuid")
//   id: string;

//   @ManyToOne(() => knowledge_base, { onDelete: "CASCADE" })
//   @JoinColumn({ name: "kb_id" })
//   knowledge_base: knowledge_base;

//   @Column({ type: "uuid" })
//   kb_id: string;

//   @Column({ length: 255 })
//   file_name: string;

//   @Column({ type: "text" })
//   file_path: string; // path or S3 URL

//   @Column({ length: 20 })
//   file_type: string; // pdf / txt / docx

//   @Column({ type: "int" })
//   size_kb: number;

// }
