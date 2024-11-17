import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Postagem } from './postagens.entity';
import { User } from 'src/users/users.entity';

@Injectable()
export class PostagensService {
    constructor(
        @InjectRepository(Postagem)
        private postagemRepository: Repository<Postagem>,

        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    findAll() {
        return this.postagemRepository.find();
    }

    findOne(id: number) {
        return this.postagemRepository.findOne({
            where: { id },
            relations: ['curtidoPor']
         });
    } //usuarios que ja curtiram -- metodo alterado

    create(postagem: Postagem) {
        return this.postagemRepository.save(postagem);
    }

    async update(id: number, postagem: Partial<Postagem>) {
        await this.postagemRepository.update(id, postagem);
        return this.findOne(id);
    }

    delete(id: number) {
        return this.postagemRepository.delete(id);
    }

    async toggleLike(postId: number, userId: number){
        const postagem = await this.postagemRepository.findOne({
            where: { id: postId },
            relations: ['curtifoPor'],
        });

        const usuario = await this.userRepository.findOne ({ where: { id: userId } });

        if (!postagem || !usuario){
            throw new Error('Postagem ou usuário não encontrado');
        }

        //logica para verificar se já curtiu
        const alreadyLiked = postagem.curtidoPor.some((user) => user.id === userId);

        if (alreadyLiked) {
            postagem.curtidoPor = postagem.curtidoPor.filter((user) => user.id !== userId);
            postagem.likes--;
        } else {
            postagem.curtidoPor.push(usuario);
            postagem.likes++;
        }

        await this.postagemRepository.save(postagem);
        return { likes: postagem.likes };
    }
}
