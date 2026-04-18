import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

export interface IBudgetItem {
    id: string;
    category: string;
    allocated: number;
    spent: number;
    vendorName?: string;
    status: 'paid' | 'pending' | 'over-budget';
}

@Entity('budgets')
export class Budget {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id', type: 'uuid', unique: true })
    userId: string;

    @Column({ name: 'total_budget', type: 'decimal', precision: 12, scale: 2, default: 0 })
    totalBudget: number;

    @Column({ type: 'jsonb', default: [] })
    items: IBudgetItem[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
}
