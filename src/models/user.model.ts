import { Table, Column, Model, HasMany } from 'sequelize-typescript';
import { UserRating } from './user-rating.model';

@Table
export class User extends Model {
  @Column({ unique: true })
  username: string;

  @Column
  password: string;

  @Column
  nickname: string;

  @HasMany(() => UserRating)
  userRatings: UserRating[];
}
