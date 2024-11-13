import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Req, Res } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./users.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { UserDTO } from "./DTO/users.dto";
import { Public } from "src/auth/constants";


@Controller("users")
export class UsersController {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }

    @Public()
    @Get()
    getUsersList() {
        return this.userRepository.find();
    }

    @Public()
    @Get(":id")
    async getUserById(@Param("id") id: number) {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new NotFoundException("Usuário não encontrado");
        }

        return user;
    }

    @Public()
    @Post()
    createUser(@Body() userDto: UserDTO) {
        const user = this.userRepository.create();

        user.name = userDto.name;
        user.email = userDto.email;
        user.password = userDto.password;
        user.isActive = userDto.isActive;

        this.userRepository.save(user);

        return user;
    }

    @Delete(":id")
    async deleteUserById(@Param("id") id: number) {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new NotFoundException("Usuário não encontrado");
        }

        this.userRepository.delete({ id: user.id });
    }

    @Public()
    @Post("googlelogin")
    async loginGoogle(@Req() req, @Res() res) {

        const { email, given_name, family_name, picture } = req.body;
        
        const response = await this.userRepository.find({where: { email }})
    
        if (response.length === 0){
        const user = await this.userRepository.create();
    
          const fullName = `${given_name} ${family_name}`;
    
          user.name = fullName
          user.email = email
          user.fotoPerfil = picture
    
        await this.userRepository.save(user)
        
        }
        
        const valida = await this.userRepository.find({where: { email }})
        
        return res.json(valida);
      }


}