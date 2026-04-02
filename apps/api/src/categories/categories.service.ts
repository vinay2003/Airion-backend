import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { Subcategory } from './entities/subcategory.entity';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
        @InjectRepository(Subcategory)
        private subcategoryRepository: Repository<Subcategory>,
    ) { }

    async findAll(): Promise<Category[]> {
        return this.categoryRepository.find({
            where: { isActive: true },
            order: { sortOrder: 'ASC' },
        });
    }

    async findAllSubcategories(categoryId: string): Promise<Subcategory[]> {
        return this.subcategoryRepository.find({
            where: { categoryId, isActive: true },
        });
    }
}
