import { Controller, Get, Post, Param, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from 'src/likes/likes.entity';
import { Postagem } from 'src/postagens/postagens.entity';
import { User } from 'src/users/users.entity';
import { Public } from 'src/auth/constants';

@Controller('likes')
export class LikesController {
    constructor(
        @InjectRepository(Like)
        private likeRepository: Repository<Like>,
        @InjectRepository(Postagem)
        private postagemRepository: Repository<Postagem>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    @Public()
    @Get()
    async getAllLikes() {
        const likes = await this.likeRepository.find({
            relations: ['postagem', 'usuario'],
        });
        return likes;
    }
    @Public()
    @Get(":postagem_id")
    async getLikeById(@Param("postagem_id") postagem_id: number) {
    
        if (isNaN(postagem_id)) {
            throw new NotFoundException("O ID da postagem deve ser um número válido.");
        }

        const likes = await this.likeRepository.find({
            where: { postagem: { id: postagem_id } },
            relations: ["usuario", "postagem"],
        });
    
        return likes;
    }
    @Public()
    @Post(':postId/:userId')
    async toggleLike(
        @Param('postId') postId: number,
        @Param('userId') userId: number,
    ) {
        // Verificar se a postagem e o usuário existem
        const postagem = await this.postagemRepository.findOne({ where: { id: postId } });
        const usuario = await this.userRepository.findOne({ where: { id: userId } });

        if (!postagem || !usuario) {
            throw new NotFoundException('Postagem ou usuário não encontrado');
        }

        // Verifica se o like já existe
        const existingLike = await this.likeRepository.findOne({
            where: { postagem: { id: postId }, usuario: { id: userId } },
        });

        if (existingLike) {
            // Se o like já existe, removemos ele (descurtir)
            await this.likeRepository.delete(existingLike.id);
        } else {
            // Caso contrário, criamos um novo like (curtir)
            const like = this.likeRepository.create({ postagem, usuario });
            await this.likeRepository.save(like);
        }

        // Atualizar a contagem de likes
        const likesCount = await this.likeRepository.count({
            where: { postagem: { id: postId } },
        });

        // Atualiza a contagem no banco (opcional, se houver o campo na tabela Postagem)
        await this.postagemRepository.update(postId, { likesCount });

        return {
            message: existingLike
                ? 'Like removido com sucesso'
                : 'Like adicionado com sucesso',
            likesCount,
        };
    }
}
