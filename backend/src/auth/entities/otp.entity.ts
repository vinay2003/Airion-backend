import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('otps')
export class Otp {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    identifier: string; // email or phone number

    @Column()
    otp: string;

    @Column({ type: 'bigint' })
    expiresAt: string; // Store as string to handle big integers safely in JS/DB communication

    @CreateDateColumn()
    createdAt: Date;
}
