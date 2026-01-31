import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Service } from './service.entity';

@Entity('service_packages')
export class ServicePackage {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Service, (service) => service.packages, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'service_id' })
    service: Service;

    @Column({ name: 'service_id' })
    serviceId: string;

    @Column()
    name: string;

    @Column('text', { nullable: true })
    description: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column('jsonb', { nullable: true })
    features: any;

    @Column('int', { name: 'delivery_days', nullable: true })
    deliveryDays: number;

    @Column('int', { nullable: true })
    revisions: number;

    @Column({ name: 'is_popular', default: false })
    isPopular: boolean;

    @Column({ name: 'sort_order', default: 0 })
    sortOrder: number;
}
