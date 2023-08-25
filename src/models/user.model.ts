import { Table, Column, Model } from 'sequelize-typescript';

@Table
export class User extends Model {
  @Column({ unique: true })
  username: string;

  @Column
  password: string;

  @Column
  nickname: string;

  @Column
  roles: string;
}
