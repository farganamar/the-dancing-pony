import { Table, Column, Model, DataType, Unique } from 'sequelize-typescript';

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
}
