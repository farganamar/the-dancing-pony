import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ where: { username } });
    const comparePass = await this.comparePasswords(user, password);
    if (!user || !comparePass) {
      throw new HttpException('Invalid Credentials', HttpStatus.BAD_REQUEST);
    }

    const payload = { username: user.username, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async comparePasswords(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
}
