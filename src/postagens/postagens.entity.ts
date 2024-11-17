import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { User } from "src/users/users.entity";
import { Comentario } from "src/comentarios/comentarios.entity";

@Entity("Postagens") 
export class Postagem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (usuario) => usuario.postagens, { onDelete: "CASCADE" })
    @JoinColumn({ name: "usuario_id" })
    usuario: User;

    @Column({ length: 255 })
    titulo: string;

    @Column("text")
    conteudo: string;

    @Column()
    foto: string;

    @Column({ length: 255, nullable: true })
    tags: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    data_criacao: Date;

    @Column({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
        onUpdate: "CURRENT_TIMESTAMP"
    })
    data_atualizacao: Date;


    @OneToMany(() => Comentario, (comentario) => comentario.postagem)
    comentarios: Comentario[]; // Relacionamento com os Comentarios
}
