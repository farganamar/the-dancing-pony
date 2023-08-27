import { Test, TestingModule } from '@nestjs/testing';
import { DishesService } from './dishes.service';
import { Dish } from '../models/dish.model';
import { UserRating } from '../models/user-rating.model';
import { User } from '../models/user.model';
import { SequelizeModule, getModelToken } from '@nestjs/sequelize';
import { DishesController } from './dishes.controller';
import { ThrottlerModule } from '@nestjs/throttler';

describe('DishesService', () => {
  let dishesService: DishesService;

  const mockDishModel = {
    findByPk: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    build: jest.fn(),
  };

  const mockUserRatingModel = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  const mockUserModel = {
    findByPk: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRoot({
          dialect: 'mysql', // Set your database dialect
          host: 'localhost', // Set your database host
          username: 'root', // Set your database username
          password: '', // Set your database password
          database: 'dancing_poly', // Set your test database name
          autoLoadModels: true,
          synchronize: true,
        }),
        SequelizeModule.forFeature([Dish, UserRating, User]),
        ThrottlerModule.forRoot({
          ttl: 60, // Set your throttler configuration
          limit: 10,
        }),
      ],
      providers: [
        DishesService,
        {
          provide: getModelToken(Dish),
          useValue: mockDishModel,
        },
        {
          provide: getModelToken(UserRating),
          useValue: mockUserRatingModel,
        },
        {
          provide: getModelToken(User),
          useValue: mockUserModel,
        },
      ],
      controllers: [DishesController],
    }).compile();

    dishesService = module.get<DishesService>(DishesService);
  });

  describe('rateDish', () => {
    it('should throw an error if user is "Sméagol"', async () => {
      const mockUser = new User();
      mockUser.username = 'Sméagol';

      mockUserModel.findByPk.mockResolvedValue(mockUser);

      await expect(dishesService.rateDish(1, 1, 5)).rejects.toThrowError(
        'User "Sméagol" is not allowed to rate dishes',
      );
    });

    it('should throw an error if user has already rated the dish', async () => {
      const mockUser = new User();
      mockUser.username = 'SomeUsername';

      const mockUserRating = new UserRating();

      mockUserModel.findByPk.mockResolvedValue(mockUser);
      mockUserRatingModel.findOne.mockResolvedValue(mockUserRating);

      await expect(dishesService.rateDish(1, 1, 5)).rejects.toThrowError(
        'You have already rated this dish',
      );
    });
  });

  describe('hasUserRatedDish', () => {
    it('should return true if user has rated the dish', async () => {
      mockUserRatingModel.findOne.mockResolvedValue(new UserRating());

      const result = await dishesService.hasUserRatedDish(1, 1);

      expect(result).toBe(true);
    });

    it('should return false if user has not rated the dish', async () => {
      mockUserRatingModel.findOne.mockResolvedValue(null);

      const result = await dishesService.hasUserRatedDish(1, 1);

      expect(result).toBe(false);
    });
  });
});
