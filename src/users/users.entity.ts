import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    lastName: string

    @Column()
    picture: string

    @Column()
    email: string

    @Column()
    password: string

    @Column({ default: true })
    isActive: boolean
}