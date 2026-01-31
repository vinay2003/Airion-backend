import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { Session } from '../entities/session.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SessionService {
    constructor(
        @InjectRepository(Session)
        private sessionRepository: Repository<Session>,
    ) { }

    /**
     * Create a new session for a user
     */
    async createSession(
        userId: string,
        refreshToken: string,
        ipAddress: string,
        userAgent: string,
    ): Promise<Session> {
        const tokenHash = await bcrypt.hash(refreshToken, 10);
        const deviceName = this.parseDeviceName(userAgent);

        const session = this.sessionRepository.create({
            userId,
            tokenHash,
            ipAddress,
            userAgent,
            deviceName,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        });

        return await this.sessionRepository.save(session);
    }

    /**
     * Verify a refresh token against stored session
     */
    async verifySession(refreshToken: string): Promise<Session | null> {
        const sessions = await this.sessionRepository.find({
            where: {
                revokedAt: null,
            },
        });

        for (const session of sessions) {
            const isValid = await bcrypt.compare(refreshToken, session.tokenHash);
            if (isValid && session.expiresAt > new Date()) {
                // Update last used timestamp
                session.lastUsedAt = new Date();
                await this.sessionRepository.save(session);
                return session;
            }
        }

        return null;
    }

    /**
     * Get all active sessions for a user
     */
    async getUserSessions(userId: string): Promise<Session[]> {
        return await this.sessionRepository.find({
            where: {
                userId,
                revokedAt: null,
            },
            order: {
                lastUsedAt: 'DESC',
            },
        });
    }

    /**
     * Revoke a specific session
     */
    async revokeSession(sessionId: string, userId: string): Promise<void> {
        await this.sessionRepository.update(
            { id: sessionId, userId },
            { revokedAt: new Date() },
        );
    }

    /**
     * Revoke all sessions for a user
     */
    async revokeAllUserSessions(userId: string): Promise<void> {
        await this.sessionRepository.update(
            { userId, revokedAt: null },
            { revokedAt: new Date() },
        );
    }

    /**
     * Clean up expired sessions (runs hourly)
     */
    @Cron('0 * * * *')
    async cleanupExpiredSessions(): Promise<void> {
        await this.sessionRepository.delete({
            expiresAt: LessThan(new Date()),
        });
    }

    /**
     * Clean up inactive sessions (7 days) (runs daily)
     */
    @Cron('0 0 * * *')
    async cleanupInactiveSessions(): Promise<void> {
        const threshold = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        await this.sessionRepository.delete({
            lastUsedAt: LessThan(threshold),
        });
    }

    /**
     * Parse user agent to extract device name
     */
    private parseDeviceName(userAgent: string): string {
        // Simple parser - could use ua-parser-js for better results
        if (userAgent.includes('Chrome')) return 'Chrome Browser';
        if (userAgent.includes('Firefox')) return 'Firefox Browser';
        if (userAgent.includes('Safari')) return 'Safari Browser';
        if (userAgent.includes('Edge')) return 'Edge Browser';
        if (userAgent.includes('Mobile')) return 'Mobile Device';
        return 'Unknown Device';
    }
}
