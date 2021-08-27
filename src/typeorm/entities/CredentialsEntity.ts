import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Credentials {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column("longtext")
  client_id?: string;

  @Column("longtext")
  server_token?: string;

  @Column("longtext")
  client_token?: string;

  @Column("longtext")
  enc_key?: string;

  @Column("longtext")
  mac_key?: string;
}

export default Credentials;
