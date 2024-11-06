import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { Public } from './auth/constants';

@Controller('google')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}


  @Public()
  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.appService.googleLogin(req)
  }
}