import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('otps')
export class Otp {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column({ default: '' })
    identifier: string; // email or phone number


    @Column({ default: '' })
    otp: string;

    @Column({ type: 'bigint', nullable: true })
    expiresAt: string; // Store as string to handle big integers safely in JS/DB communication

    @CreateDateColumn()
    createdAt: Date;
}
