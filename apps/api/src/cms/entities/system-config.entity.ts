import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('system_configs')
export class SystemConfig {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  key: string;

  @Column({ type: 'jsonb', nullable: true })
  value: any;

  @UpdateDateColumn()
  updatedAt: Date;
}
