import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';

export enum UserRole {
    USER = 'user',
    VENDOR = 'vendor',
    ADMIN = 'admin',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ unique: true, type: 'varchar', length: 255 })
    email: string;

    @Column({ name: 'phone_number', type: 'varchar', length: 20, nullable: true })
    phoneNumber?: string;

    @Column({ type: 'varchar', length: 255 })
    password: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @Column({ name: 'email_verified', type: 'boolean', default: false })
    emailVerified: boolean;

    @Column({ name: 'email_verification_token', type: 'varchar', length: 255, nullable: true })
    emailVerificationToken?: string;

    @Column({ name: 'password_reset_token', type: 'varchar', length: 255, nullable: true })
    passwordResetToken?: string;

    @Column({ name: 'password_reset_expires', type: 'timestamp', nullable: true })
    passwordResetExpires?: Date;

    // Security fields
    @Column({ name: 'last_login_at', type: 'timestamp', nullable: true })
    lastLoginAt?: Date;

    @Column({ name: 'login_attempts', type: 'int', default: 0 })
    loginAttempts: number;

    @Column({ name: 'locked_until', type: 'timestamp', nullable: true })
    lockedUntil?: Date;

    @Column({ name: 'mfa_enabled', type: 'boolean', default: false })
    mfaEnabled: boolean;

    @Column({ name: 'mfa_secret', type: 'varchar', length: 255, nullable: true })
    mfaSecret?: string;

    @Column({ name: 'social_id', type: 'varchar', length: 255, nullable: true })
    socialId?: string;

    @Column({ name: 'social_provider', type: 'varchar', length: 50, nullable: true })
    socialProvider?: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @BeforeInsert()
    async hashPassword() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }

    async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }

    isLocked(): boolean {
        return !!(this.lockedUntil && this.lockedUntil > new Date());
    }
}
