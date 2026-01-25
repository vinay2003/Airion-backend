import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
    type: 'postgres',
    host: process.env.PGHOST,
    port: 5432,
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    ssl: process.env.PGSSLMODE === 'require',
    autoLoadEntities: true,
    synchronize: true, // Auto-create tables (dev only)
}));
