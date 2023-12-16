import {
  Entity,
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("product")
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column("text") name: string;
  @Column("numeric") qunatity: number;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
