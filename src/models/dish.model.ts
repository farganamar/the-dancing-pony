import {
  Table,
  Column,
  Model,
  DataType,
  Unique,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.model';

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

  @Column(DataType.JSON)
  rating: number;

  @Column
  createdBy: number;

  @BelongsTo(() => User, 'createdBy')
  createdByUser: User;

  @Column
  updatedBy: number;

  @BelongsTo(() => User, 'updatedBy')
  updatedByUser: User;
}
