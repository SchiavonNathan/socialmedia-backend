import { Module } from '@nestjs/common';
import { ComentariosController } from './comentarios.controller';
import { ComentariosService } from './comentarios.service';
import { User } from 'src/users/users.entity';
import { Comentario } from './comentarios.entity';
import { Postagem } from 'src/postagens/postagens.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Postagem, User, Comentario])],
  controllers: [ComentariosController],
  providers: [ComentariosService]
})
export class ComentariosModule {}
