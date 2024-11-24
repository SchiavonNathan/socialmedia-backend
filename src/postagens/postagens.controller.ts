import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from "@nestjs/common";
import { Repository } from "typeorm";
import { Postagem } from "./postagens.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { PostagemDTO } from "./DTO/postagens.dto";
import { Public } from "src/auth/constants";
import { User } from "src/users/users.entity";
import { PostagensService } from "./postagens.service";
import slugify from "slugify";
import { Like } from "typeorm";

@Controller("postagens")
export class PostagensController {
    constructor(
        @InjectRepository(Postagem)
        private postagemRepository: Repository<Postagem>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private postagensService: PostagensService,
    ) { }

    @Public()
    @Get()
    getPostagensList() {
        return this.postagemRepository.find({ relations: ["usuario"] });
    }

    @Public()
    @Get(":id")
    async getPostagemById(@Param("id") id: number) {
        const postagem = await this.postagemRepository.findOne({ where: { id }, relations: ["usuario"] });
        if (!postagem) {
            throw new NotFoundException("Postagem não encontrada");
        }
        return postagem;
    }

    @Public()
    @Get("/search/:titulo")
    async getPostagemByTitulo(@Param("titulo") titulo: string) {
        const postagem = await this.postagemRepository.find({ where: { titulo: Like(`%${titulo}%`) },  relations: ["usuario"]});
        if (!postagem) {
            throw new NotFoundException("Postagem não encontrada");
        }
        return postagem;
    }

    //rota para compartilhamento
    @Public()
    @Get("/share/:id")
    async getPostagemForShare(@Param("id") id:number){
        const postagem = await this.postagemRepository.findOne({where: {id}, relations: ["usuario"] });
        if (!postagem){
            throw new NotFoundException("Postagem não encontrada");
        }

        //gerar slug com base no título
        const slug = slugify(postagem.titulo, { lower: true});
        const shareUrl = `https://blog.com/postagens/${id}/${slug}`;

        return { shareUrl };
    }

    @Public()
    @Post()
    async createPostagem(@Body() postagemDto: PostagemDTO) {
        const usuario = await this.userRepository.findOneBy({ id: postagemDto.usuarioId });
        
        if (!usuario) {
            throw new NotFoundException("Usuário não encontrado");
        }

        const postagem = this.postagemRepository.create({
            ...postagemDto,
            usuario,
            slug: slugify(postagemDto.titulo, { lower: true }),
        });

        return this.postagemRepository.save(postagem);
    }

    @Public()
    @Put(":id")
    async updatePostagem(@Param("id") id: number, @Body() postagemDto: PostagemDTO) {
        const postagem = await this.postagemRepository.findOne({ where: { id }, relations: ["usuario"] });
        if (!postagem) {
            throw new NotFoundException("Postagem não encontrada");
        }

        const usuario = await this.userRepository.findOneBy({ id: postagemDto.usuarioId });
        
        if (!usuario) {
            throw new NotFoundException("Usuário não encontrado");
        }

        this.postagemRepository.merge(postagem, postagemDto);
        postagem.usuario = usuario;

        return this.postagemRepository.save(postagem);
    }

    @Public()
    @Delete(":id")
    async deletePostagemById(@Param("id") id: number) {
        const postagem = await this.postagemRepository.findOneBy({ id });
        if (!postagem) {
            throw new NotFoundException("Postagem não encontrada");
        }
        await this.postagemRepository.delete(id);
    }

    @Post(":postId/like/:userId")
    async toggleLike(
        @Param("postId") postId: number,
        @Param("userId") userId: number,
    ) {
        const result = await this.postagensService.toggleLike(postId, userId);
        return result;
    }
}
