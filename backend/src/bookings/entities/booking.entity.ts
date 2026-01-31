import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Vendor } from '../../vendors/entities/vendor.entity';
import { Service } from '../../services/entities/service.entity';
import { ServicePackage } from '../../services/entities/service-package.entity';

@Entity('bookings')
export class Booking {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'booking_code', unique: true })
    bookingCode: string;

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

    @ManyToOne(() => ServicePackage)
    @JoinColumn({ name: 'package_id' })
    servicePackage: ServicePackage;

    @Column({ name: 'package_id', nullable: true })
    packageId: string;

    @Column({ default: 'pending' })
    status: string; // pending/confirmed/paid/in-progress/completed/cancelled/refunded

    @Column('decimal', { name: 'total_amount', precision: 10, scale: 2 })
    totalAmount: number;

    @Column({ default: 'INR' })
    currency: string;

    @Column({ name: 'booking_date' })
    bookingDate: Date;

    @Column({ name: 'event_date', nullable: true })
    eventDate: Date;

    @Column('jsonb', { name: 'event_address', nullable: true })
    eventAddress: any;

    @Column('text', { name: 'special_requirements', nullable: true })
    specialRequirements: string;

    @Column({ name: 'payment_status', default: 'pending' })
    paymentStatus: string;

    @Column({ name: 'payment_id', nullable: true })
    paymentId: string;

    @Column({ name: 'payment_method', nullable: true })
    paymentMethod: string;

    @Column('text', { name: 'cancellation_reason', nullable: true })
    cancellationReason: string;

    @Column({ name: 'cancellation_requested_by', nullable: true })
    cancellationRequestedBy: string;

    @Column({ name: 'cancellation_requested_at', nullable: true })
    cancellationRequestedAt: Date;

    @Column({ name: 'completed_at', nullable: true })
    completedAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
