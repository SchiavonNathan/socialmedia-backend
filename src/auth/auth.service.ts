
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/users.entity';
import axios from 'axios';

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
    const payload = { sub: user.id, name: user.name };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

   // Função para validar o token do Facebook e autenticar o usuário
   async validateFacebookUser(accessToken: string): Promise<any> {
    // 1. Verificar se o token do Facebook é válido, fazendo uma requisição para a API Graph do Facebook
    const url = `https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email,picture`;
    try {
      const response = await axios.get(url);

      const { id, name, email, picture } = response.data;
      let user = await this.usersService.findOrCreate(id);
      //Gera Jwt
      const payload = { userId: user.id, name: user.name, email: user.email };
      const accessTokenJWT = this.jwtService.sign(payload);
      //Retornar o token JWT
      return {
        access_token: accessTokenJWT,
        user,
      };
    } catch (error) {
      throw new Error('Erro ao validar o token do Facebook');
    }
  }
}
