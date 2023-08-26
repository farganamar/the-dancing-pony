import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { createWriteStream } from 'fs';
import { Dish } from 'src/models/dish.model';
import { CreateDishDto } from './dto/create-dish.dto';
import { Sequelize } from 'sequelize-typescript';
import { UpdateDishDto } from './dto/update-dish.dto';

@Injectable()
export class DishesService {
  constructor(
    @InjectModel(Dish)
    private dishModel: typeof Dish,
    private sequelize: Sequelize,
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
        const imageStream = createWriteStream(`./temp/${image.originalname}`);
        imageStream.write(image.buffer);

        dish.image = `./temp/${image.originalname}`; // Store the image path in the database
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
}
