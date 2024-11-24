import {  Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { Repository } from "typeorm";
import { Postagem } from "../postagens/postagens.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ComentarioDTO } from "../comentarios/DTO/comentarios.dto";
import { Public } from "src/auth/constants";
import { User } from "src/users/users.entity";
import { Comentario } from './comentarios.entity';

@Controller('comentarios')
export class ComentariosController {
    constructor(
        @InjectRepository(Postagem)
        private postagemRepository: Repository<Postagem>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Comentario)
        private comentarioRepository: Repository<Comentario>,
    ) {}

    @Public()
    @Get()
    getComentariosList(){
        return this.comentarioRepository.find({ relations: ["usuario", "postagem"] });
    }

    @Public()
    @Get(":postagem_id")
    async getComentarioById(@Param("postagem_id") postagem_id: number) {
    
        if (isNaN(postagem_id)) {
            throw new NotFoundException("O ID da postagem deve ser um número válido.");
        }

        const comentarios = await this.comentarioRepository.find({
            where: { postagem: { id: postagem_id } },
            relations: ["usuario", "postagem"],
        });
    
        return comentarios;
    }

    @Public()
    @Post()
    async createComentario(@Body() comentarioDTO: ComentarioDTO){
        const usuario = await this.userRepository.findOneBy({ id: comentarioDTO.usuarioId });
        const postagem = await this.userRepository.findOneBy({ id: comentarioDTO.postagemId });
        
        if (!usuario) {
            throw new NotFoundException("Usuário não encontrado");
        }
        if (!postagem) {
            throw new NotFoundException("Postagem não encontrado");
        }

        const comentario = this.comentarioRepository.create({
            ...comentarioDTO,
            usuario,
            postagem
        });

        return this.comentarioRepository.save(comentario);
    }

}
