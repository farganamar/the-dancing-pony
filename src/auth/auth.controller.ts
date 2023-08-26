import {
  Body,
  Controller,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login.dto';
import { Response } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login User' })
  @ApiResponse({ status: 200, description: 'Successful response' })
  @UsePipes(new ValidationPipe())
  async login(@Res() res: Response, @Body() credentials: LoginUserDto) {
    try {
      const { username, password } = credentials;
      const result = await this.authService.login(username, password);

      return res.status(200).json({
        status: true,
        message: 'ok',
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Error login',
        error: error.message,
      });
    }
  }
}
