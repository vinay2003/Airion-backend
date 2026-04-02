import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from './category.entity';

@Entity('subcategories')
export class Subcategory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Category, (category) => category.subcategories)
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @Column({ name: 'category_id' })
    categoryId: string;

    @Column()
    name: string;

    @Column({ unique: true })
    slug: string;

    @Column('text', { nullable: true })
    description: string;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;
}
