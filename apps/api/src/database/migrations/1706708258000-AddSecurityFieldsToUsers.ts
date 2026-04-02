import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddSecurityFieldsToUsers1706708258000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add security-related columns to users table
        await queryRunner.addColumns('users', [
            new TableColumn({
                name: 'last_login_at',
                type: 'timestamp',
                isNullable: true,
                comment: 'Last successful login timestamp'
            }),
            new TableColumn({
                name: 'login_attempts',
                type: 'int',
                default: 0,
                comment: 'Failed login attempts counter (reset on success)'
            }),
            new TableColumn({
                name: 'locked_until',
                type: 'timestamp',
                isNullable: true,
                comment: 'Account locked until this timestamp'
            }),
            new TableColumn({
                name: 'mfa_enabled',
                type: 'boolean',
                default: false,
                comment: 'Whether MFA/2FA is enabled'
            }),
            new TableColumn({
                name: 'mfa_secret',
                type: 'varchar',
                length: '255',
                isNullable: true,
                comment: 'Encrypted MFA secret (TOTP)'
            }),
            new TableColumn({
                name: 'social_id',
                type: 'varchar',
                length: '255',
                isNullable: true,
                comment: 'OAuth provider user ID (Google, GitHub, etc.)'
            }),
            new TableColumn({
                name: 'social_provider',
                type: 'varchar',
                length: '50',
                isNullable: true,
                comment: 'OAuth provider name (google, github, etc.)'
            })
        ]);

        // Create index on social_id for faster OAuth lookups
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS idx_users_social_id 
            ON users(social_id, social_provider) 
            WHERE social_id IS NOT NULL
        `);

        // Create index on locked_until for efficient query of locked accounts
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS idx_users_locked_until 
            ON users(locked_until) 
            WHERE locked_until IS NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.query(`DROP INDEX IF EXISTS idx_users_social_id`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_users_locked_until`);

        // Drop columns
        await queryRunner.dropColumn('users', 'social_provider');
        await queryRunner.dropColumn('users', 'social_id');
        await queryRunner.dropColumn('users', 'mfa_secret');
        await queryRunner.dropColumn('users', 'mfa_enabled');
        await queryRunner.dropColumn('users', 'locked_until');
        await queryRunner.dropColumn('users', 'login_attempts');
        await queryRunner.dropColumn('users', 'last_login_at');
    }
}
