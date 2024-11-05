import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Public } from './constants';
import { FacebookAuthGuard } from './facebook-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string,any >) {
    return this.authService.signIn(signInDto.name,signInDto.email, signInDto.password);
  }

  @Public()
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

   // Rota de login via Facebook
  @Get('facebook')
  @UseGuards(FacebookAuthGuard)
  async facebookLogin() {
    // O Passport redireciona o usuário para o Facebook
  }

  @Public()
  @Post('facebook')
  async loginWithFacebook(@Body() body: { accessToken: string }) {
    const user = await this.authService.validateFacebookUser(body.accessToken);
    return { access_token: user.access_token };  // Retorne o token JWT para o frontend

  }
}
