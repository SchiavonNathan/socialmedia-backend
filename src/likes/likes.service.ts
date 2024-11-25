import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './likes.entity';
import { Postagem } from 'src/postagens/postagens.entity';
import { User } from 'src/users/users.entity';
import { PostagensService } from 'src/postagens/postagens.service';

@Injectable()
export class LikesService {
    constructor(
        @InjectRepository(Like)
        private likeRepository: Repository<Like>,
        @InjectRepository(Postagem)
        private postagemRepository: Repository<Postagem>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private postagensService: PostagensService, // Injeção do PostagensService
    ) {}

    
    
}
