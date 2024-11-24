import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { User } from "src/users/users.entity";
import { Postagem } from "src/postagens/postagens.entity";

@Entity("Comentarios") 
export class Comentario {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (usuario) => usuario.comentarios, { onDelete: "CASCADE" })
    @JoinColumn({ name: "usuario_id" })
    usuario: User;

    @ManyToOne(() => Postagem, (postagem) => postagem.comentarios, { onDelete: "CASCADE" })
    @JoinColumn({ name: "postagem_id" })
    postagem: Postagem;

    @Column("text")
    conteudo: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    dataCriacao: Date;

    @Column({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
        onUpdate: "CURRENT_TIMESTAMP"
    })
    dataAtualizacao: Date;
}
