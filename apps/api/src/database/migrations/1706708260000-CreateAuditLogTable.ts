import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateAuditLogTable1706708260000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'audit_logs',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        default: 'uuid_generate_v4()',
                        comment: 'Audit log entry ID'
                    },
                    {
                        name: 'user_id',
                        type: 'uuid',
                        isNullable: true,
                        comment: 'User who performed the action (null for failed logins)'
                    },
                    {
                        name: 'action',
                        type: 'varchar',
                        length: '100',
                        comment: 'Action performed (e.g., LOGIN_ATTEMPT, PASSWORD_CHANGE)'
                    },
                    {
                        name: 'resource_type',
                        type: 'varchar',
                        length: '50',
                        isNullable: true,
                        comment: 'Type of resource affected (e.g., USER, VENDOR, BOOKING)'
                    },
                    {
                        name: 'resource_id',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                        comment: 'ID of the affected resource'
                    },
                    {
                        name: 'ip_address',
                        type: 'varchar',
                        length: '45',
                        comment: 'IP address of the client'
                    },
                    {
                        name: 'user_agent',
                        type: 'text',
                        comment: 'Browser/device user agent'
                    },
                    {
                        name: 'success',
                        type: 'boolean',
                        default: true,
                        comment: 'Whether the action succeeded'
                    },
                    {
                        name: 'failure_reason',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                        comment: 'Reason for failure (if unsuccessful)'
                    },
                    {
                        name: 'metadata',
                        type: 'jsonb',
                        isNullable: true,
                        comment: 'Additional context (email, changes made, etc.)'
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                        comment: 'When the action occurred'
                    }
                ]
            }),
            true
        );

        // Create foreign key to users table (optional, user may not exist for failed logins)
        await queryRunner.createForeignKey(
            'audit_logs',
            new TableForeignKey({
                name: 'fk_audit_logs_user',
                columnNames: ['user_id'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL' // Keep log even if user is deleted
            })
        );

        // Create indexes for efficient querying
        await queryRunner.query(`
            CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
        `);

        await queryRunner.query(`
            CREATE INDEX idx_audit_logs_action ON audit_logs(action);
        `);

        await queryRunner.query(`
            CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
        `);

        await queryRunner.query(`
            CREATE INDEX idx_audit_logs_success ON audit_logs(success);
        `);

        await queryRunner.query(`
            CREATE INDEX idx_audit_logs_ip_address ON audit_logs(ip_address);
        `);

        // Composite index for common queries (user's actions)
        await queryRunner.query(`
            CREATE INDEX idx_audit_logs_user_created 
            ON audit_logs(user_id, created_at DESC) 
            WHERE user_id IS NOT NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('audit_logs', 'fk_audit_logs_user');
        await queryRunner.dropTable('audit_logs');
    }
}
