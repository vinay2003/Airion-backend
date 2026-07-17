import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './entities/category.entity';
import { Subcategory } from './entities/subcategory.entity';
import { Location } from './entities/location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Subcategory, Location])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule { }
