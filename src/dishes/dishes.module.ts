import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Dish } from '../models/dish.model';
import { DishesService } from './dishes.service';
import { DishesController } from './dishes.controller';
import { UserRating } from '../models/user-rating.model';
import { User } from '../models/user.model';

@Module({
  imports: [SequelizeModule.forFeature([Dish, UserRating, User])],
  providers: [DishesService],
  controllers: [DishesController],
})
export class DishesModule {}
