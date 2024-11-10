import { IsNotEmpty, IsOptional, IsString, MaxLength, IsInt } from "class-validator";

export class PostagemDTO {
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    titulo: string;

    @IsNotEmpty()
    @IsString()
    conteudo: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    tags?: string;

    @IsInt()
    usuarioId: number;  // ID do usuário
}
