import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  Redirect,
  Query,
  Res
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Public } from './constants';
import { FacebookAuthGuard } from './facebook-auth.guard';
import axios from 'axios';
import { Response } from 'express';

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

  private facebookAuthUrl = 'https://www.facebook.com/v10.0/dialog/oauth';
  private clientId = '1963945814110125';
  private clientSecret = '424d6e2a90cc2ea88a1d82f7e2b49bcc';
  private redirectUri = 'http://localhost:3001/auth/facebook/callback';

  @Public()
  @Get('facebook')
  @Redirect()
  redirectToFacebook() {
    const facebookUrl = `${this.facebookAuthUrl}?client_id=${this.clientId}&redirect_uri=${encodeURIComponent(this.redirectUri)}&scope=email,public_profile`;
    return { url: facebookUrl };
  }

  @Public()
  @Get('facebook/callback')
  async facebookCallback(@Query('code') code: string, @Res() res: Response) {
    try {
      // Trocar o código de autorização pelo token de acesso
      const tokenResponse = await axios.get(
        `https://graph.facebook.com/v10.0/oauth/access_token`, {
        params: {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          redirect_uri: this.redirectUri,
          code,
        },
      });

      const { access_token } = tokenResponse.data;

      // Opcional: Validar o token e obter dados do usuário
      const userProfileResponse = await axios.get(
        `https://graph.facebook.com/me?fields=id,name,email,picture`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      const userProfile = userProfileResponse.data;
      
      // Aqui, você pode criar/atualizar o usuário no seu banco e gerar um JWT para ele
      // const jwtToken = this.authService.generateToken(userProfile);

      // Retorna o JWT para o frontend ou faz o redirecionamento com o token
      return res.json({
        message: 'Login bem-sucedido!',
        user: userProfile,
        //token: jwtToken,  // opcional
      });
    } catch (error) {
      console.error('Erro ao autenticar com o Facebook', error);
      return res.status(500).json({ error: 'Erro ao autenticar com o Facebook' });
      return res.redirect('/login?auth=failed')
    }
  }
}
