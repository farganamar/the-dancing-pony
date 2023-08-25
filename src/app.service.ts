import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { User } from './models/user.model';
import { Dish } from './models/dish.model';

@Injectable()
export class AppService {
  constructor(private sequelize: Sequelize) {
    sequelize.addModels([User, Dish]);
  }
  getHello(): string {
    return 'Hello World!';
  }
}
