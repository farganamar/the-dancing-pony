import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDecimal } from 'class-validator';

export class CreateDishDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDecimal()
  price: number;

  @ApiProperty({
    description: 'Attachments',
    type: 'file',
    format: 'binary',
  })
  image?: any;
}
