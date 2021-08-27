import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  phone!: string;

  @Column()
  name!: string;
}
