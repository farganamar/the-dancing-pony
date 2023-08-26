import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  Response,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { DishesService } from './dishes.service';
// import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';

@Controller('dishes')
export class DishesController {
  constructor(private readonly dishesService: DishesService) {}

  // @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createDishDto: CreateDishDto,
    @Request() req,
    @Response() res,
    @UploadedFile() image: Express.Multer.File,
  ) {
    try {
      const user = req.user;
      const createdDish = await this.dishesService.create(
        createDishDto,
        user,
        image,
      );
      res.json({
        status: true,
        message: 'Dish created successfully',
        data: createdDish,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Error creating dish',
        error: error.message,
      });
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateDishDto: UpdateDishDto,
    @Request() req,
    @Response() res,
  ) {
    try {
      const user = req.user;
      const updatedDish = await this.dishesService.update(
        id,
        updateDishDto,
        user,
      );
      res.json({
        status: true,
        message: 'Dish updated successfully',
        data: updatedDish,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Error updating dish',
        error: error.message,
      });
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: number, @Request() req, @Response() res) {
    try {
      const user = req.user;
      const deleteDish = await this.dishesService.delete(id, user);
      res.json({
        status: true,
        message: 'Dish deleted successfully',
        data: deleteDish,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Error deleting dish',
        error: error.message,
      });
    }
  }

  @Get(':id')
  async detail(@Param('id') id: number, @Response() res) {
    try {
      const dish = await this.dishesService.findOne(id);
      if (!dish) {
        res.status(404).json({
          status: false,
          message: 'Dish not found',
          error: null,
        });
      }
      res.json({
        status: true,
        message: 'ok',
        data: dish,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Error fetching dish details',
        error: error.message,
      });
    }
  }

  @Get()
  async getAll(
    @Response() res,
    @Query('name') name: string, // Query parameter for filtering by name
    @Query('page') page: number = 1, // Default page is 1
    @Query('limit') limit: number = 10, // Default limit is 10)
  ) {
    try {
      const result = await this.dishesService.findAll(name, page, limit);
      const { dishes, total } = result;

      const totalPages = Math.ceil(total / limit);

      res.json({
        status: true,
        message: 'ok',
        data: dishes,
        metadata: {
          total,
          totalPages,
          currentPage: page,
          perPage: limit,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Error fetching dishes',
        error: error.message,
      });
    }
  }
}
