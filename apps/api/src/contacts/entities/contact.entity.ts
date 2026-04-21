import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('contacts')
export class Contact {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column({ default: 'General Inquiry' })
    subject: string;

    @Column('text')
    message: string;

    @Column({ default: 'unread' })
    status: 'unread' | 'read' | 'replied';

    @CreateDateColumn()
    createdAt: Date;
}
