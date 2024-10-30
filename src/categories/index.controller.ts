import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from "@nestjs/common";
import { Repository } from "typeorm";
import { Category } from "./category.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoryDTO } from "./DTO/categories.dto";

@Controller("categories")
export class IndexController {

    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>
    ) { }

    @Get()
    index() {
        return this.categoryRepository.find();
    }

    @Get(":id")
    find(@Param("id") id: number) {
        return this.categoryRepository.findOneBy({ id });
    }

    @Post()
    create(@Body() categoryDto: CategoryDTO) {
        const category = this.categoryRepository.create(categoryDto);
        return this.categoryRepository.save(category);
    }

    @Put(":id")
    async update(@Param("id") id: number, @Body() categoryDTO: CategoryDTO) {
        const category = await this.categoryRepository.findOneBy({ id });
        if (category === null) {
            throw new NotFoundException(`Categoria com id '${id}' não encontrada`);
        }

        category.name = categoryDTO.name;
        category.description = categoryDTO.description;
        category.isActive = categoryDTO.isActive;

        return this.categoryRepository.save(category);
    }

    @Delete(":id")
    async delete(@Param("id") id: number) {
        await this.categoryRepository.delete(id);
    }
}