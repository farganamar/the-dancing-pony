import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { User } from './models/user.model';
import { Dish } from './models/dish.model';
import { UserRating } from './models/user-rating.model';

@Injectable()
export class AppService {
  constructor(private sequelize: Sequelize) {
    sequelize.addModels([User, Dish, UserRating]);
  }
  getHello(): string {
    return 'Hello World!';
  }
}
