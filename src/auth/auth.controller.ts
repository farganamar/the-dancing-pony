import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() credentials: LoginUserDto) {
    try {
      const { username, password } = credentials;
      return this.authService.login(username, password);
    } catch (error) {
      throw new Error(error);
    }
  }
}
