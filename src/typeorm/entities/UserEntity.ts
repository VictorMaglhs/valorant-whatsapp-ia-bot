import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  step!: number;

  @Column()
  phone!: string;

  @Column()
  user?: string;

  @Column()
  password?: string;

  @Column()
  token?: string;
}
