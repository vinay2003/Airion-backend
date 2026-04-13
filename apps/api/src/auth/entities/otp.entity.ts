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

    @Column({ type: 'varchar', length: 20, default: 'login' })
    type: 'login' | 'signup' | 'reset';

    @Column({ type: 'bigint', nullable: true })
    expiresAt: string; // Store as string to handle big integers safely in JS/DB communication

    @Column({ type: 'int', default: 0 })
    attempts: number;

    @CreateDateColumn()
    createdAt: Date;
}
