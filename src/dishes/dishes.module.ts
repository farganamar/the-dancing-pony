import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Dish } from 'src/models/dish.model';
import { DishesService } from './dishes.service';
import { DishesController } from './dishes.controller';

@Module({
  imports: [SequelizeModule.forFeature([Dish])],
  providers: [SequelizeModule, DishesService],
  controllers: [DishesController],
})
export class DishesModule {}
