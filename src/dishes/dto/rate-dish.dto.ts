import { IsDecimal, IsNotEmpty } from 'class-validator';

export class RateDishDto {
  @IsNotEmpty()
  @IsDecimal()
  rating: number;
}
