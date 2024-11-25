import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, Unique } from 'typeorm';
import { User } from 'src/users/users.entity';
import { Postagem } from 'src/postagens/postagens.entity';

@Entity()
@Unique(['postagem', 'usuario'])  // Garantir que a combinação postagem-usuario seja única
export class Like {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Postagem, (postagem) => postagem.likes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'postagem_id' })
    postagem: Postagem;

    @ManyToOne(() => User, (usuario) => usuario.likes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'usuario_id' })
    usuario: User;

    @Column({ default: true })
    status: boolean;
}
