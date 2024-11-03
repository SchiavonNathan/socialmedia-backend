
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(
    name: string,
    email: string,
    password: string
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(name);
    if (user?.password !== password) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.userId, username: user.name };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
