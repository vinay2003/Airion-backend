import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('support_tickets')
export class SupportTicket {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    ticketCode: string;

    @Column()
    user: string;

    @Column()
    type: string; // 'User' | 'Vendor'

    @Column()
    subject: string;

    @Column({ type: 'text', nullable: true })
    message: string;

    @Column({ default: 'Low' })
    priority: string; // 'Low' | 'Medium' | 'High' | 'Critical'

    @Column({ default: 'Open' })
    status: string; // 'Open' | 'In Progress' | 'Resolved' | 'Closed'

    @Column('jsonb', { nullable: true, default: [] })
    replies: any[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
