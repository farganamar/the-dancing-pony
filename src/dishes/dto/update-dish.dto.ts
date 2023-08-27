import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateDishDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsOptional() // This decorator allows the field to be optional during update
  name?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  price?: number;
}
