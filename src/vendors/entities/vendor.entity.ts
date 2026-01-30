import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('vendors')
export class Vendor {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @Column()
    userId: string;

    // Section 1: Basic Information
    @Column()
    businessName: string;

    @Column()
    ownerName: string;

    @Column()
    businessType: string;

    @Column({ nullable: true })
    otherBusinessType?: string;

    @Column()
    businessAddress: string;

    @Column()
    city: string;

    @Column()
    contactNumber: string;

    @Column({ nullable: true })
    email?: string;

    @Column()
    yearsInBusiness: string;

    // Section 2: Vendor Operations
    @Column('simple-array', { default: '' })
    acquisitionChannels: string[];

    @Column({ nullable: true })
    otherAcquisitionChannel?: string;

    @Column()
    monthlyEventVolume: string;

    @Column()
    averagePrice: string;

    @Column()
    offerPackages: string;

    // Section 3: Challenges & Pain Points
    @Column('simple-array', { default: '' })
    challenges: string[];

    @Column()
    useDigitalTools: string;

    @Column()
    mobileAppHelp: string;

    // Section 4: Platform Interest
    @Column({ nullable: true })
    joinLikelihood?: string;

    @Column('simple-array', { default: '' })
    excitementFactors: string[];

    @Column({ nullable: true })
    preferredPricing?: string;

    @Column('simple-array', { default: '' })
    benefits: string[];

    // Section 5: Expectations & Risk Factors
    @Column('simple-array', { default: '' })
    leaveReasons: string[];

    @Column('simple-array', { default: '' })
    expectedSupport: string[];

    @Column({ nullable: true })
    joinTime?: string;

    // Section 6: Optional
    @Column({ nullable: true })
    joinEarlyCommunity?: string;

    @Column('text', { nullable: true })
    comments?: string;

    // Status & Metadata
    @Column({ default: false })
    isApproved: boolean;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
