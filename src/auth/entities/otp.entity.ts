import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Otp {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    phone: string;

    @Column()
    otp: string;

    @CreateDateColumn()
    createdAt: Date;
}
