import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Subcategory } from './subcategory.entity';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    slug: string;

    @Column({ nullable: true })
    icon: string;

    @Column('text', { nullable: true })
    description: string;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @Column({ name: 'sort_order', default: 0 })
    sortOrder: number;

    @OneToMany(() => Subcategory, (subcategory) => subcategory.category)
    subcategories: Subcategory[];
}
