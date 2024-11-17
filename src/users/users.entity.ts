import { Column, Entity, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from "typeorm";
import { Postagem } from "src/postagens/postagens.entity";

@Entity("Usuarios")
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    

    @Column({ length: 100 })
    name: string;

    @Column({ length: 150, unique: true })
    email: string;

    @Column({ length: 255, nullable: true })
    password: string;

    @Column({ default: true })
    isActive: boolean

    @Column({ length: 255, nullable: true })
    fotoPerfil: string;

    @Column("text", { nullable: true })
    biografia: string;

    @CreateDateColumn({ type: "timestamp" })
    dataCriacao: Date;

    @Column({ length: 255, nullable: true })
    googleId: string;

    @Column({ length: 255, nullable: true })
    facebookId: string;

    @OneToMany(() => Postagem, (postagem) => postagem.usuario, { cascade: true })
    postagens: Postagem[];
}
