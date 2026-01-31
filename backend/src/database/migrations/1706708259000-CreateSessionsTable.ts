import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateSessionsTable1706708259000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'sessions',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        default: 'uuid_generate_v4()',
                        comment: 'Session unique identifier'
                    },
                    {
                        name: 'user_id',
                        type: 'uuid',
                        comment: 'User who owns this session'
                    },
                    {
                        name: 'token_hash',
                        type: 'varchar',
                        length: '255',
                        comment: 'Hashed refresh token'
                    },
                    {
                        name: 'ip_address',
                        type: 'varchar',
                        length: '45',
                        comment: 'IPv4 or IPv6 address'
                    },
                    {
                        name: 'user_agent',
                        type: 'text',
                        comment: 'Browser/device user agent string'
                    },
                    {
                        name: 'device_name',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                        comment: 'Parsed device name (e.g., Chrome on Windows)'
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                        comment: 'Session creation timestamp'
                    },
                    {
                        name: 'expires_at',
                        type: 'timestamp',
                        comment: 'Session expiration timestamp'
                    },
                    {
                        name: 'last_used_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                        comment: 'Last time this session was used'
                    },
                    {
                        name: 'revoked_at',
                        type: 'timestamp',
                        isNullable: true,
                        comment: 'When session was manually revoked'
                    }
                ]
            }),
            true
        );

        // Create foreign key to users table
        await queryRunner.createForeignKey(
            'sessions',
            new TableForeignKey({
                name: 'fk_sessions_user',
                columnNames: ['user_id'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE' // Delete sessions when user is deleted
            })
        );

        // Create indexes for efficient querying
        await queryRunner.query(`
            CREATE INDEX idx_sessions_user_id ON sessions(user_id);
        `);

        await queryRunner.query(`
            CREATE INDEX idx_sessions_token_hash ON sessions(token_hash);
        `);

        await queryRunner.query(`
            CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
        `);

        await queryRunner.query(`
            CREATE INDEX idx_sessions_last_used_at ON sessions(last_used_at);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('sessions', 'fk_sessions_user');
        await queryRunner.dropTable('sessions');
    }
}
