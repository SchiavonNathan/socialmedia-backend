import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { AuthService } from './auth.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private authService: AuthService) {
    super({
      clientID: '1963945814110125',
      clientSecret: '424d6e2a90cc2ea88a1d82f7e2b49bcc',
      callbackURL: 'http://localhost:3000/auth/facebook/callback',
      scope: ['email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    // Chama a função findOrCreate do UsersService
    const user = await this.authService.validateUser(profile);
    return user; // Retorna o usuário para ser usado pelo NestJS
  }
}
