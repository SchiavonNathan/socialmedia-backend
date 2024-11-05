import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(name: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { name } });
  }

   // Função para encontrar ou criar o usuário Facebook
  async findOrCreate(profile: any): Promise<User> {
    let user = await this.usersRepository.findOne({
      where: { facebookId: profile.id },
    });

    if (!user) {
      // Se não encontrar, cria um novo usuário
      user = this.usersRepository.create({
        facebookId: profile.id,
        name: profile.displayName,
        email: profile.emails ? profile.emails[0].value : null,
      });

      // Salva o novo usuário no banco
      await this.usersRepository.save(user);
    }

    return user;
  }
}
