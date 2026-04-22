import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Vendor } from '../../vendors/entities/vendor.entity';

@Entity('vendor_availability')
@Index(['vendorId', 'date'], { unique: true })
export class Availability {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Vendor)
    @JoinColumn({ name: 'vendor_id' })
    vendor: Vendor;

    @Column({ name: 'vendor_id' })
    vendorId: string;

    @Column({ type: 'date' })
    date: string; // ISO Date string (YYYY-MM-DD)

    @Column({ default: 'available' }) // available, blocked, booked
    status: string;

    @Column({ name: 'reason', type: 'text', nullable: true })
    reason: string | null; // e.g., "Personal Event", "Booking #123"

    @Column({ name: 'booking_id', type: 'text', nullable: true })
    bookingId: string | null; // Reference to the booking that took this slot

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
