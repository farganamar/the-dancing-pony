import { ApiProperty } from '@nestjs/swagger';
import { Dish } from '../../models/dish.model'; // Import the Dish model

export class GetDishesResponseDto {
  @ApiProperty({ type: [Dish] }) // Specify the type as an array of Dish objects
  dishes: Dish[];

  @ApiProperty({ example: 10 }) // Example value for total
  total: number;
}
