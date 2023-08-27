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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DishesService } from './dishes.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { RateDishDto } from './dto/rate-dish.dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Dish } from 'src/models/dish.model';

@ApiBearerAuth()
@ApiTags('dishes')
@Controller('dishes')
@UseGuards(ThrottlerGuard)
export class DishesController {
  constructor(private readonly dishesService: DishesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new dish' })
  @ApiBody({ type: CreateDishDto })
  @ApiResponse({
    status: 201,
    description: 'Dish created successfully',
    type: Dish,
  })
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
  @ApiOperation({ summary: 'Update a dish by ID' })
  @ApiBody({ type: UpdateDishDto })
  @ApiResponse({
    status: 200,
    description: 'Dish updated successfully',
    type: Dish,
  })
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
  @ApiOperation({ summary: 'Update a dish by ID' })
  @ApiParam({ name: 'id', description: 'ID of the dish', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Dish deleted successfully',
    type: Dish,
  })
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
  @Get(':id')
  @ApiOperation({ summary: 'Get dish by ID' })
  @ApiParam({ name: 'id', description: 'ID of the dish', type: Number })
  @ApiResponse({ status: 200, description: 'Dish found', type: Dish })
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
  @ApiOperation({ summary: 'Get all dishes' })
  @ApiQuery({
    name: 'name',
    description: 'Filter dishes by name',
    required: false,
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number',
    required: false,
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Items per page',
    required: false,
    type: Number,
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Dishes fetched successfully',
    type: [Dish],
  })
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

  @Post(':id/rate')
  @ApiOperation({ summary: 'Rate a dish' })
  @ApiBody({ type: RateDishDto })
  @ApiResponse({
    status: 200,
    description: 'Dish rated successfully',
    type: Dish,
  })
  async rateDish(
    @Param('id') id: number,
    @Body() rateDishDto: RateDishDto,
    @Request() req,
    @Response() res,
  ) {
    try {
      const user = req.user;
      const hasRated = await this.dishesService.hasUserRatedDish(id, user.sub);
      if (hasRated) {
        throw new Error('You have already rated this dish');
      }

      const updatedDish = await this.dishesService.rateDish(
        id,
        user.sub,
        rateDishDto.rating,
      );

      res.json({
        status: true,
        message: 'Dish rated successfully',
        data: updatedDish,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Error rating dish',
        error: error.message,
      });
    }
  }
}
