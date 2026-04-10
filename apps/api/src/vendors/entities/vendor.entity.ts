import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { Subcategory } from '../../categories/entities/subcategory.entity';

@Entity('vendors')
export class Vendor {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => User, user => user.vendor)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column('varchar', { name: 'user_id' })
    userId: string;

    @Column('varchar', { name: 'business_name' })
    businessName: string;

    @Column('varchar', { name: 'business_email', unique: true, nullable: true })
    businessEmail: string | null;

    @Column('varchar', { name: 'business_phone', nullable: true })
    businessPhone: string | null;

    @Column('varchar', { name: 'city', nullable: true })
    city: string | null;

    @Column('varchar', { name: 'years_in_business', nullable: true })
    yearsInBusiness: string | null;

    @Column('varchar', { name: 'gst_number', nullable: true })
    gstNumber: string | null;

    @Column('text', { name: 'acquisition_channels', array: true, nullable: true })
    acquisitionChannels: string[];

    @Column('varchar', { name: 'monthly_event_volume', nullable: true })
    monthlyEventVolume: string;

    @Column('varchar', { name: 'average_booking_price', nullable: true })
    averageBookingPrice: string;

    @Column('text', { name: 'pain_points', array: true, nullable: true })
    painPoints: string[];

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
    businessDescription: string | null;

    // Relationships with Category/Subcategory will be added when those entities are created
    @ManyToOne(() => Category)
    @JoinColumn({ name: 'category_id' })
    category: Category;
    @Column('uuid', { name: 'category_id', nullable: true })
    categoryId: string;

    @ManyToOne(() => Subcategory)
    @JoinColumn({ name: 'subcategory_id' })
    subcategory: Subcategory;
    @Column('uuid', { name: 'subcategory_id', nullable: true })
    subcategoryId: string;

    @Column('jsonb', { name: 'business_hours', nullable: true })
    businessHours: Record<string, { open: string; close: string }> | null;

    @Column('varchar', { name: 'pricing_tier', nullable: true })
    pricingTier: string;

    @Column('decimal', { precision: 3, scale: 2, default: 0.00 })
    rating: number;

    @Column('int', { name: 'total_reviews', default: 0 })
    totalReviews: number;

    @Column('boolean', { name: 'is_profile_complete', default: false })
    isProfileComplete: boolean;

    @Column('boolean', { name: 'is_verified', default: false })
    isVerified: boolean;

    @Column('varchar', { name: 'verification_status', default: 'pending' })
    verificationStatus: string; // pending, approved, rejected

    @Column('jsonb', { name: 'verification_documents', nullable: true })
    verificationDocuments: Array<{ type: string; url: string }>;

    @Column('jsonb', { name: 'social_links', nullable: true })
    socialLinks: { facebook?: string; instagram?: string; website?: string };

    @Column('jsonb', { name: 'ads', default: [] })
    ads: Array<{
        id?: string;
        title: string;
        image: string;
        budget: number;
        status: 'Active' | 'Pending' | 'Rejected';
        createdAt?: Date;
    }>;

    @Column('jsonb', { name: 'gallery', default: [] })
    gallery: Array<{
        id?: string;
        imageUrl: string;
        title?: string;
        createdAt: Date;
    }>;

    @Column('text', { name: 'portfolio_images', array: true, nullable: true })
    portfolioImages: string[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
