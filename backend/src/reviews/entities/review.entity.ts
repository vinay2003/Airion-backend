import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Vendor } from '../../vendors/entities/vendor.entity';
import { Service } from '../../services/entities/service.entity';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity('reviews')
export class Review {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => Booking)
    @JoinColumn({ name: 'booking_id' })
    booking: Booking;

    @Column({ name: 'booking_id', unique: true })
    bookingId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'user_id' })
    userId: string;

    @ManyToOne(() => Vendor)
    @JoinColumn({ name: 'vendor_id' })
    vendor: Vendor;

    @Column({ name: 'vendor_id' })
    vendorId: string;

    @ManyToOne(() => Service)
    @JoinColumn({ name: 'service_id' })
    service: Service;

    @Column({ name: 'service_id' })
    serviceId: string;

    @Column('int')
    rating: number; // 1-5

    @Column('text', { name: 'review_text', nullable: true })
    reviewText: string;

    @Column('text', { array: true, nullable: true })
    images: string[];

    @Column({ name: 'is_approved', default: true })
    isApproved: boolean;

    @Column('text', { name: 'admin_notes', nullable: true })
    adminNotes: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
