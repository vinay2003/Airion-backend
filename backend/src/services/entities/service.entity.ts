import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Vendor } from '../../vendors/entities/vendor.entity';
import { Category } from '../../categories/entities/category.entity';
import { Subcategory } from '../../categories/entities/subcategory.entity';
import { ServicePackage } from './service-package.entity';

@Entity('services')
export class Service {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Vendor)
    @JoinColumn({ name: 'vendor_id' })
    vendor: Vendor;

    @Column({ name: 'vendor_id' })
    vendorId: string;

    @ManyToOne(() => Category)
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @Column({ name: 'category_id' })
    categoryId: string;

    @ManyToOne(() => Subcategory)
    @JoinColumn({ name: 'subcategory_id' })
    subcategory: Subcategory;

    @Column({ name: 'subcategory_id' })
    subcategoryId: string;

    @Column()
    title: string;

    @Column({ unique: true })
    slug: string;

    @Column('text', { nullable: true })
    description: string;

    @Column('decimal', { name: 'base_price', precision: 10, scale: 2 })
    basePrice: number;

    @Column({ default: 'INR' })
    currency: string;

    @Column('int', { name: 'duration_hours', nullable: true })
    durationHours: number;

    @Column('text', { array: true, nullable: true })
    images: string[];

    @Column('jsonb', { nullable: true })
    features: Array<{ name: string; included: boolean }>;

    @Column('text', { nullable: true })
    requirements: string;

    @Column({ name: 'location_type', default: 'onsite' })
    locationType: string;

    @Column('jsonb', { name: 'available_locations', nullable: true })
    availableLocations: string[];

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @OneToMany(() => ServicePackage, (pkg) => pkg.service)
    packages: ServicePackage[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
