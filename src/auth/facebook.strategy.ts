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
      callbackURL: 'google.com',
      scope: ['email'],
    });
  }
}
