import { Module } from '@nestjs/common';
import { IndexController } from './index.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [IndexController]
})
export class CategoriesModule {}
