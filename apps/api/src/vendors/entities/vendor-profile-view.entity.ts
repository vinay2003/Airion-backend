import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index, Unique } from 'typeorm';
import { Vendor } from './vendor.entity';
import { User } from '../../auth/entities/user.entity';

@Entity('vendor_profile_views')
@Index(['vendorId', 'createdAt'])
@Unique('UQ_vendor_viewerUserId', ['vendorId', 'viewerUserId'])
@Unique('UQ_vendor_guestVisitorId', ['vendorId', 'guestVisitorId'])
export class VendorProfileView {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    @Index()
    vendorId: string;

    @ManyToOne(() => Vendor, vendor => vendor.profileViews, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'vendorId' })
    vendor: Vendor;

    @Column('uuid', { nullable: true })
    viewerUserId: string | null;

    @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn({ name: 'viewerUserId' })
    viewerUser: User | null;

    @Column('varchar', { nullable: true })
    guestVisitorId: string | null;

    @CreateDateColumn()
    createdAt: Date;
}
