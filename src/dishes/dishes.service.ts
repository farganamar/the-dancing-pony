import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { Dish } from '../models/dish.model';
import { CreateDishDto } from './dto/create-dish.dto';
import { Sequelize } from 'sequelize-typescript';
import { UpdateDishDto } from './dto/update-dish.dto';
import { UserRating } from '../models/user-rating.model';
import { User } from '../models/user.model';

@Injectable()
export class DishesService {
  constructor(
    @InjectModel(Dish)
    private dishModel: typeof Dish,
    private sequelize: Sequelize,
    @InjectModel(UserRating)
    private userRatingModel: typeof UserRating,
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async create(
    createDishDto: CreateDishDto,
    user: any,
    image: Express.Multer.File,
  ): Promise<Dish> {
    const t = await this.sequelize.transaction();
    try {
      const dish = this.dishModel.build({
        ...createDishDto,
        createdBy: user.sub,
        updatedBy: user.sub,
      });

      // Save the image to a temporary folder
      if (![null, undefined].includes(image)) {
        const dir = './temp/';
        if (!existsSync(dir)) {
          mkdirSync(dir);
        }
        const imageStream = createWriteStream(`${dir}${image.originalname}`);
        imageStream.write(image.buffer);

        dish.image = `${dir}${image.originalname}`; // Store the image path in the database
      }

      const createdDish = await dish.save({ transaction: t });
      await t.commit();

      return createdDish;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async update(
    id: number,
    updateDishDto: UpdateDishDto,
    user: any,
  ): Promise<Dish> {
    const t = await this.sequelize.transaction();

    try {
      const dish = await this.dishModel.findOne({
        where: { id },
      });

      if (!dish) {
        throw new Error('Dish not found or not allowed to update');
      }

      dish.set(updateDishDto);
      dish.updatedBy = user.sub;

      const updatedDish = await dish.save({ transaction: t });

      await t.commit();
      return updatedDish;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async delete(id: number, user: any): Promise<void> {
    const t = await this.sequelize.transaction();

    try {
      const dish = await this.dishModel.findOne({
        where: { id, createdBy: user.sub },
      });

      if (!dish) {
        throw new Error('Dish not found or not allowed to delete');
      }

      await dish.destroy({ transaction: t });

      await t.commit();
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async findOne(id: number): Promise<Dish | null> {
    return this.dishModel.findByPk(id);
  }

  async findAll(
    name: string,
    page: number,
    limit: number,
  ): Promise<{ dishes: Dish[]; total: number }> {
    const offset = (page - 1) * limit;
    const whereClause = name ? { name } : {};
    limit = limit * 1;

    const [dishes, total] = await Promise.all([
      this.dishModel.findAll({
        where: whereClause,
        limit,
        offset,
      }),
      this.dishModel.count({ where: whereClause }),
    ]);

    return { dishes, total };
  }

  async rateDish(
    dishId: number,
    userId: number,
    rating: number,
  ): Promise<Dish> {
    // Retrieve the user's username
    const user = await this.userModel.findByPk(userId);
    if (user.username === 'Sméagol') {
      throw new Error('User "Sméagol" is not allowed to rate dishes');
    }

    const userRating = await this.userRatingModel.findOne({
      where: { dishId, userId },
    });

    if (userRating) {
      throw new Error('You have already rated this dish');
    }

    const dish = await this.dishModel.findByPk(dishId);

    if (!dish) {
      throw new Error('Dish not found');
    }

    const transaction = await this.dishModel.sequelize.transaction();
    try {
      dish.ratings += 1; // Increase the total ratings count

      await dish.save({ transaction });

      await this.userRatingModel.create(
        { dishId, userId, rating },
        { transaction },
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }

    return dish;
  }

  async hasUserRatedDish(dishId: number, userId: number): Promise<boolean> {
    const userRating = await this.userRatingModel.findOne({
      where: { dishId, userId },
    });
    return !!userRating;
  }
}
