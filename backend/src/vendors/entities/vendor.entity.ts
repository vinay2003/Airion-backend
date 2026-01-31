import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { Subcategory } from '../../categories/entities/subcategory.entity';

@Entity('vendors')
export class Vendor {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'user_id' })
    userId: string;

    @Column({ name: 'business_name' })
    businessName: string;

    @Column({ name: 'business_email', unique: true, nullable: true })
    businessEmail: string;

    @Column({ name: 'business_phone', nullable: true })
    businessPhone: string;

    @Column('jsonb', { name: 'business_address', nullable: true })
    businessAddress: {
        street: string;
        city: string;
        state: string;
        country: string;
        zipCode: string;
        coordinates?: { lat: number; lng: number };
    };

    @Column('text', { name: 'business_description', nullable: true })
    businessDescription: string;

    // Relationships with Category/Subcategory will be added when those entities are created
    // @ManyToOne(() => Category)
    // @JoinColumn({ name: 'category_id' })
    // category: Category;
    @Column({ name: 'category_id', nullable: true })
    categoryId: string;

    // @ManyToOne(() => Subcategory)
    // @JoinColumn({ name: 'subcategory_id' })
    // subcategory: Subcategory;
    @Column({ name: 'subcategory_id', nullable: true })
    subcategoryId: string;

    @Column('jsonb', { name: 'business_hours', nullable: true })
    businessHours: Record<string, { open: string; close: string }>;

    @Column({ name: 'pricing_tier', nullable: true })
    pricingTier: string;

    @Column('decimal', { precision: 3, scale: 2, default: 0.00 })
    rating: number;

    @Column({ name: 'total_reviews', default: 0 })
    totalReviews: number;

    @Column({ name: 'is_verified', default: false })
    isVerified: boolean;

    @Column({ name: 'verification_status', default: 'pending' })
    verificationStatus: string; // pending, approved, rejected

    @Column('jsonb', { name: 'verification_documents', nullable: true })
    verificationDocuments: Array<{ type: string; url: string }>;

    @Column('jsonb', { name: 'social_links', nullable: true })
    socialLinks: { facebook?: string; instagram?: string; website?: string };

    @Column('text', { name: 'portfolio_images', array: true, nullable: true })
    portfolioImages: string[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
