import { IsNotEmpty, IsOptional, IsString, MaxLength, IsInt } from "class-validator";

export class ComentarioDTO {
    @IsInt()
    @IsNotEmpty()
    usuarioId: number;

    @IsInt()
    @IsNotEmpty()
    postagemId: number;

    @IsString()
    @IsNotEmpty()
    conteudo: string;
}
