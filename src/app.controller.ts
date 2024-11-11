import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { Public } from './auth/constants';
import { User } from "src/users/users.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Controller('google')
export class AppController {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly appService: AppService) {}

  @Public()
  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}


  @Public()
  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {

    const email = req.user.email
    
    const response = await this.userRepository.find({where: { email }})

    if (response.length === 0){
    //cria o user
    const user = await this.userRepository.create();

      const fullName = `${req.user.firstName} ${req.user.lastName}`;

      user.name = fullName
      user.email = req.user.email
      user.fotoPerfil = req.user.picture

    await this.userRepository.save(user)
    
    }
    
    const valida = await this.userRepository.find({where: { email }})
    
    if(valida.length !== 0){
    return await res.redirect(`http://localhost:3000/home`);
    }
  }

}