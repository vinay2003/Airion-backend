import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { AuditLog } from '../entities/audit-log.entity';

export interface AuditEventData {
    userId?: string;
    action: string;
    resourceType?: string;
    resourceId?: string;
    ipAddress: string;
    userAgent: string;
    success?: boolean;
    failureReason?: string;
    metadata?: Record<string, any>;
}

@Injectable()
export class AuditService {
    constructor(
        @InjectRepository(AuditLog)
        private auditLogRepository: Repository<AuditLog>,
    ) { }

    /**
     * Log an authentication/security event
     */
    async logEvent(eventData: AuditEventData): Promise<void> {
        const log = this.auditLogRepository.create({
            userId: eventData.userId,
            action: eventData.action,
            resourceType: eventData.resourceType,
            resourceId: eventData.resourceId,
            ipAddress: eventData.ipAddress,
            userAgent: eventData.userAgent,
            success: eventData.success ?? true,
            failureReason: eventData.failureReason,
            metadata: eventData.metadata,
        });

        await this.auditLogRepository.save(log);
    }

    /**
     * Log successful login
     */
    async logLogin(userId: string, ipAddress: string, userAgent: string, metadata?: Record<string, any>): Promise<void> {
        await this.logEvent({
            userId,
            action: 'LOGIN_SUCCESS',
            ipAddress,
            userAgent,
            success: true,
            metadata,
        });
    }

    /**
     * Log failed login attempt
     */
    async logLoginFailure(email: string, ipAddress: string, userAgent: string, reason: string): Promise<void> {
        await this.logEvent({
            action: 'LOGIN_FAILURE',
            ipAddress,
            userAgent,
            success: false,
            failureReason: reason,
            metadata: { email },
        });
    }

    /**
     * Log password change
     */
    async logPasswordChange(userId: string, ipAddress: string, userAgent: string): Promise<void> {
        await this.logEvent({
            userId,
            action: 'PASSWORD_CHANGE',
            ipAddress,
            userAgent,
            success: true,
        });
    }

    /**
     * Log account lockout
     */
    async logAccountLockout(userId: string, ipAddress: string, userAgent: string, reason: string): Promise<void> {
        await this.logEvent({
            userId,
            action: 'ACCOUNT_LOCKED',
            ipAddress,
            userAgent,
            success: false,
            failureReason: reason,
        });
    }

    /**
     * Log MFA enable/disable
     */
    async logMfaChange(userId: string, enabled: boolean, ipAddress: string, userAgent: string): Promise<void> {
        await this.logEvent({
            userId,
            action: enabled ? 'MFA_ENABLED' : 'MFA_DISABLED',
            ipAddress,
            userAgent,
            success: true,
        });
    }

    /**
     * Get audit logs for a user
     */
    async getUserLogs(userId: string, limit: number = 50): Promise<AuditLog[]> {
        return await this.auditLogRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }

    /**
     * Get recent failed login attempts from an IP
     */
    async getFailedLoginsByIp(ipAddress: string, minutes: number = 15): Promise<number> {
        const threshold = new Date(Date.now() - minutes * 60 * 1000);

        const count = await this.auditLogRepository.count({
            where: {
                action: 'LOGIN_FAILURE',
                ipAddress,
                success: false,
                createdAt: LessThan(threshold),
            },
        });

        return count;
    }

    /**
     * Clean up old audit logs (runs weekly)
     * Keep logs for 6 months by default
     */
    @Cron('0 0 * * 0')
    async cleanupOldLogs(): Promise<void> {
        const threshold = new Date();
        threshold.setMonth(threshold.getMonth() - 6);

        await this.auditLogRepository.delete({
            createdAt: LessThan(threshold),
        });
    }
}
