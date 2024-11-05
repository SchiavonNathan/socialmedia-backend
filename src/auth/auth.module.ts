
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { UsersService } from '../users/users.service';
import { PassportModule } from '@nestjs/passport';
import { FacebookStrategy } from './facebook.strategy';


@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'facebook' }),
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  providers: [AuthService, UsersModule, FacebookStrategy, {
    provide: APP_GUARD,
    useClass: AuthGuard,
  }],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
