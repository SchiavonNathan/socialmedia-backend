import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { GoogleStrategy } from './strategies/google.strategy'
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User])],
    controllers: [UsersController],
    providers: [UsersService, GoogleStrategy],
    exports: [UsersService]
})
export class UsersModule { }
