import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToOne, OneToMany, Index } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { Subcategory } from '../../categories/entities/subcategory.entity';
import { VendorAd } from './vendor-ad.entity';
import { VendorGallery } from './vendor-gallery.entity';
import { VendorProfileView } from './vendor-profile-view.entity';

/**
 * KYC / Vendor Approval Lifecycle Enum
 * DRAFT         → Vendor registered but hasn't submitted profile
 * EMAIL_PENDING → Account created, awaiting email verification
 * KYC_PENDING   → Profile complete, documents uploaded, awaiting review
 * UNDER_REVIEW  → Admin has started reviewing the submission
 * APPROVED      → Vendor approved and badge granted
 * REJECTED      → Submission rejected with reason
 * SUSPENDED     → Previously approved vendor suspended
 */
export enum VendorVerificationStatus {
    DRAFT = 'DRAFT',
    EMAIL_PENDING = 'EMAIL_PENDING',
    KYC_PENDING = 'KYC_PENDING',
    UNDER_REVIEW = 'UNDER_REVIEW',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    SUSPENDED = 'SUSPENDED',
}

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

    @Column('varchar', { name: 'pan_number', nullable: true })
    panNumber: string | null;

    @Column('varchar', { name: 'aadhar_number', nullable: true })
    aadharNumber: string | null;

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

    @Index()
    @Column('boolean', { name: 'is_sponsored', default: false })
    isSponsored: boolean;

    @Index()
    @Column('boolean', { name: 'is_featured', default: false })
    isFeatured: boolean;

    @Column('boolean', { name: 'is_profile_complete', default: false })
    isProfileComplete: boolean;

    @Column('boolean', { name: 'is_verified', default: false })
    isVerified: boolean;

    @Column({ type: 'enum', enum: VendorVerificationStatus, name: 'verification_status', default: VendorVerificationStatus.DRAFT })
    verificationStatus: VendorVerificationStatus;

    @Column('jsonb', { name: 'verification_documents', nullable: true })
    verificationDocuments: Array<{ type: string; url: string }>;

    @Column({ name: 'rejection_reason', type: 'text', nullable: true })
    rejectionReason: string | null;

    @Column({ name: 'reviewed_by_id', type: 'uuid', nullable: true })
    reviewedById: string | null;

    @Column({ name: 'kyc_submitted_at', type: 'timestamp', nullable: true })
    kycSubmittedAt: Date | null;

    @Column({ name: 'kyc_reviewed_at', type: 'timestamp', nullable: true })
    kycReviewedAt: Date | null;

    @Column('jsonb', { name: 'social_links', nullable: true })
    socialLinks: { facebook?: string; instagram?: string; website?: string };

    @OneToMany(() => VendorAd, ad => ad.vendor, { cascade: true })
    ads: VendorAd[];

    @OneToMany(() => VendorGallery, item => item.vendor, { cascade: true })
    gallery: VendorGallery[];

    @Column('text', { name: 'portfolio_images', array: true, nullable: true })
    portfolioImages: string[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => VendorProfileView, view => view.vendor)
    profileViews: VendorProfileView[];
}
