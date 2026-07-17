import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Vendor } from './vendor.entity';

@Entity('vendor_gallery')
export class VendorGallery {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Vendor, vendor => vendor.gallery, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'vendor_id', foreignKeyConstraintName: 'fk_vendor_gallery_vendor' })
    vendor: Vendor;


    @Column('text')
    imageUrl: string;

    @Column('varchar', { length: 255, nullable: true })
    title: string;

    @Column('varchar', { length: 255, nullable: true })
    description: string;

    @Column('int', { default: 0 })
    sortOrder: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
