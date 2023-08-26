import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateDishDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
