import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';
import { User } from '../../auth/entities/user.entity';

@Entity('disputes')
export class Dispute {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Booking)
    @JoinColumn({ name: 'booking_id' })
    booking: Booking;

    @Column({ name: 'booking_id' })
    bookingId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'raised_by_id' })
    raisedBy: User;

    @Column({ name: 'raised_by_id' })
    raisedById: string;

    @Column('text')
    reason: string;

    @Column({ default: 'open' }) // open, under_review, resolved, closed
    status: string;

    @Column({ name: 'admin_resolution', nullable: true })
    adminResolution: string;

    @Column('decimal', { name: 'refund_amount', precision: 10, scale: 2, default: 0 })
    refundAmount: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
