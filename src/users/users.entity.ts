import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    email: string

    @Column()
    password: string

    @Column({ default: true })
    isActive: boolean

    @Column({ nullable: true })
    facebookId: string; // Facebook ID, para associar ao perfil do usuário

    @Column({ nullable: true })
    photoUrl: string; // Opcional: Se você quiser armazenar a foto do usuário
}