import {
  Model,
  Column,
  Table,
  ForeignKey,
  DataType,
} from 'sequelize-typescript';
import { Dish } from './dish.model';
import { User } from './user.model';

@Table
export class UserRating extends Model<UserRating> {
  @ForeignKey(() => Dish)
  @Column
  dishId: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @Column(DataType.FLOAT)
  rating: number;
}
