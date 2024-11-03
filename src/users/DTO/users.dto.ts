import { IsBoolean, IsEmail, IsNotEmpty, isNotEmpty } from "class-validator"

export class UserDTO {
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    password: string

    @IsNotEmpty()
    @IsBoolean()
    isActive: boolean
}