import {
  Table,
  Column,
  Model,
  DataType,
  Unique,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { User } from './user.model';
import { UserRating } from './user-rating.model';

@Table
export class Dish extends Model {
  @Unique
  @Column
  name: string;

  @Unique
  @Column
  description: string;

  @Column
  image: string;

  @Column(DataType.FLOAT)
  price: number;

  @Column(DataType.FLOAT) // Default value for ratings is 0
  ratings: number;

  @Column
  createdBy: number;

  @BelongsTo(() => User, 'createdBy')
  createdByUser: User;

  @Column
  updatedBy: number;

  @BelongsTo(() => User, 'updatedBy')
  updatedByUser: User;

  @HasMany(() => UserRating)
  userRatings: UserRating[];
}
