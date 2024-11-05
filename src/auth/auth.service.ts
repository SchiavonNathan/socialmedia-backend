
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

  //Metodos de autenticacao facebook
  async validateUser(profile: any): Promise<User> {
    // Procura o usuário pelo Facebook ID ou cria um novo usuário
    const user = await this.usersService.findOrCreate(profile);
    return user;
  }

  async login(user: User) {
    const payload = { username: user.name, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

   // Função para validar o token do Facebook e autenticar o usuário
   async validateFacebookUser(accessToken: string): Promise<any> {
    // 1. Verificar se o token do Facebook é válido, fazendo uma requisição para a API Graph do Facebook
    const url = `https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email,picture`;
    try {
      const response = await axios.get(url);

      // 2. Obter dados do usuário do Facebook
      const { id, name, email, picture } = response.data;

      // 3. Verificar se o usuário já existe na base de dados
      let user = await this.usersService.findOrCreate(id);

      // 4. Gerar um token JWT para o usuário
      const payload = { userId: user.id, name: user.name, email: user.email };
      const accessTokenJWT = this.jwtService.sign(payload);

      // 5. Retornar o token JWT e os dados do usuário
      return {
        access_token: accessTokenJWT,
        user,
      };
    } catch (error) {
      throw new Error('Erro ao validar o token do Facebook');
    }
  }
}
