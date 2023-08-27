import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsNotEmpty } from 'class-validator';

export class RateDishDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsDecimal()
  rating: number;
}
