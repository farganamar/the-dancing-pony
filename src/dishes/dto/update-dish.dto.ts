import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateDishDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional() // This decorator allows the field to be optional during update
  name?: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  price?: number;
}
