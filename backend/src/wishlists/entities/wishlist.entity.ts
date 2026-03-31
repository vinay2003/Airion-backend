import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Vendor } from '../../vendors/entities/vendor.entity';

@Entity('wishlists')
export class Wishlist {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id', type: 'uuid' })
    userId: string;

    @Column({ name: 'vendor_id', type: 'uuid' })
    vendorId: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => User, user => user.wishlists, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Vendor, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'vendor_id' })
    vendor: Vendor;
}
