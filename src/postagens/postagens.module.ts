import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Postagem } from './postagens.entity';
import { PostagensController } from './postagens.controller';
import { PostagensService } from './postagens.service';
import { User } from 'src/users/users.entity';
import { Comentario } from 'src/comentarios/comentarios.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Postagem, User, Comentario])],
    controllers: [PostagensController],
    providers: [PostagensService],
    exports: [PostagensService]
})
export class PostagensModule {}
