import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Booking)
    @JoinColumn({ name: 'booking_id' })
    booking: Booking;

    @Column({ name: 'booking_id', nullable: true })
    bookingId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'sender_id' })
    sender: User;

    @Column({ name: 'sender_id' })
    senderId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'receiver_id' })
    receiver: User;

    @Column({ name: 'receiver_id' })
    receiverId: string;

    @Column('text')
    message: string;

    @Column({ name: 'is_read', default: false })
    isRead: boolean;

    @Column('jsonb', { nullable: true })
    attachments: Array<{ type: string; url: string }>;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
