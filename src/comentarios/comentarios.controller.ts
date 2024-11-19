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
    @Get(":id")
    async getComentarioById(@Param("id") id: number) {
        const comentario = await this.postagemRepository.findOne({
            where: { id },
            relations: ["usuario", "comentario"]
        });

        if (!comentario) {
            throw new NotFoundException("Comentário não encontrado");
        }

        return comentario;
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
