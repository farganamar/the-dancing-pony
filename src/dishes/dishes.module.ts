import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Dish } from 'src/models/dish.model';

@Module({
  imports: [SequelizeModule.forFeature([Dish])],
  providers: [SequelizeModule],
})
export class DishesModule {}
