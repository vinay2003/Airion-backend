import { MigrationInterface, QueryRunner } from "typeorm";

export class UserRoles1784299709868 implements MigrationInterface {
    name = 'UserRoles1784299709868'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT IF EXISTS "FK_3bc55a7c3f9ed54b520bb5cfe23"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT IF EXISTS "FK_b561864743d235f44e70addc1f5"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT IF EXISTS "FK_605b081c78bc3eeea959446596a"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP CONSTRAINT IF EXISTS "FK_bd2726fd31b35443f2245b93ba0"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN IF EXISTS "conversation_id"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN IF EXISTS "body"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN IF EXISTS "read_at"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN IF EXISTS "booking_id"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN IF EXISTS "attachments"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN IF EXISTS "message"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN IF EXISTS "receiver_id"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN IF EXISTS "metadata"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN IF EXISTS "user_id"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN IF EXISTS "resource_id"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN IF EXISTS "success"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN IF EXISTS "ip_address"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN IF EXISTS "resource_type"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN IF EXISTS "failure_reason"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN IF EXISTS "user_agent"`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "booking_id" uuid`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "receiver_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "message" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "attachments" jsonb`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "conversation_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "body" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "read_at" TIMESTAMP`);
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_logs' AND column_name='user_id') THEN ALTER TABLE "audit_logs" ADD "user_id" uuid; END IF; END $$`);
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_logs' AND column_name='resource_type') THEN ALTER TABLE "audit_logs" ADD "resource_type" character varying(50); END IF; END $$`);
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_logs' AND column_name='resource_id') THEN ALTER TABLE "audit_logs" ADD "resource_id" character varying(255); END IF; END $$`);
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_logs' AND column_name='ip_address') THEN ALTER TABLE "audit_logs" ADD "ip_address" character varying(45) NOT NULL DEFAULT '127.0.0.1'; END IF; END $$`);
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_logs' AND column_name='user_agent') THEN ALTER TABLE "audit_logs" ADD "user_agent" text NOT NULL DEFAULT 'Unknown'; END IF; END $$`);
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_logs' AND column_name='success') THEN ALTER TABLE "audit_logs" ADD "success" boolean NOT NULL DEFAULT true; END IF; END $$`);
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_logs' AND column_name='failure_reason') THEN ALTER TABLE "audit_logs" ADD "failure_reason" character varying(255); END IF; END $$`);
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_logs' AND column_name='metadata') THEN ALTER TABLE "audit_logs" ADD "metadata" jsonb; END IF; END $$`);
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_logs' AND column_name='adminId') THEN ALTER TABLE "audit_logs" ADD "adminId" uuid; END IF; END $$`);
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_logs' AND column_name='resource') THEN ALTER TABLE "audit_logs" ADD "resource" character varying(100) NOT NULL DEFAULT 'system'; END IF; END $$`);

        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_logs' AND column_name='resourceId') THEN ALTER TABLE "audit_logs" ADD "resourceId" character varying(255); END IF; END $$`);
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_logs' AND column_name='previousValue') THEN ALTER TABLE "audit_logs" ADD "previousValue" jsonb; END IF; END $$`);
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_logs' AND column_name='newValue') THEN ALTER TABLE "audit_logs" ADD "newValue" jsonb; END IF; END $$`);
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_logs' AND column_name='ipAddress') THEN ALTER TABLE "audit_logs" ADD "ipAddress" character varying(255); END IF; END $$`);
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_logs' AND column_name='userAgent') THEN ALTER TABLE "audit_logs" ADD "userAgent" character varying(255); END IF; END $$`);
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_logs' AND column_name='requestId') THEN ALTER TABLE "audit_logs" ADD "requestId" character varying(255); END IF; END $$`);

        await queryRunner.query(`DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_type WHERE typname='users_role_enum' AND NOT EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid=t.oid WHERE t.typname='users_role_enum' AND e.enumlabel='super_admin')) THEN ALTER TYPE "public"."users_role_enum" RENAME TO "users_role_enum_old"; END IF; END $$`);
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid=t.oid WHERE t.typname='users_role_enum' AND e.enumlabel='super_admin') THEN CREATE TYPE "public"."users_role_enum" AS ENUM('user', 'vendor', 'admin', 'super_admin', 'finance', 'support', 'moderator'); END IF; END $$`);
        await queryRunner.query(`DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_type WHERE typname='users_role_enum_old') THEN ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT; ALTER TABLE "users" ALTER COLUMN "role" TYPE "public"."users_role_enum" USING "role"::"text"::"public"."users_role_enum"; ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user'; DROP TYPE "public"."users_role_enum_old"; END IF; END $$`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_9d53d8c4d4227c02e4476129d2" ON "audit_logs" ("adminId") `);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_cee5459245f652b75eb2759b4c" ON "audit_logs" ("action") `);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_8769d5d852a6b56dd77186a1c6" ON "audit_logs" ("resource") `);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_2cd10fda8276bb995288acfbfb" ON "audit_logs" ("created_at") `);
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name='messages' AND constraint_name='FK_605b081c78bc3eeea959446596a') THEN ALTER TABLE "messages" ADD CONSTRAINT "FK_605b081c78bc3eeea959446596a" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION; END IF; END $$`);
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name='messages' AND constraint_name='FK_b561864743d235f44e70addc1f5') THEN ALTER TABLE "messages" ADD CONSTRAINT "FK_b561864743d235f44e70addc1f5" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION; END IF; END $$`);
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name='messages' AND constraint_name='FK_3bc55a7c3f9ed54b520bb5cfe23') THEN ALTER TABLE "messages" ADD CONSTRAINT "FK_3bc55a7c3f9ed54b520bb5cfe23" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION; END IF; END $$`);
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name='audit_logs' AND constraint_name='FK_bd2726fd31b35443f2245b93ba0') THEN ALTER TABLE "audit_logs" ADD CONSTRAINT "FK_bd2726fd31b35443f2245b93ba0" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION; END IF; END $$`);
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name='audit_logs' AND constraint_name='FK_9d53d8c4d4227c02e4476129d25') THEN ALTER TABLE "audit_logs" ADD CONSTRAINT "FK_9d53d8c4d4227c02e4476129d25" FOREIGN KEY ("adminId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION; END IF; END $$`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP CONSTRAINT "FK_9d53d8c4d4227c02e4476129d25"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP CONSTRAINT "FK_bd2726fd31b35443f2245b93ba0"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_3bc55a7c3f9ed54b520bb5cfe23"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_b561864743d235f44e70addc1f5"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_605b081c78bc3eeea959446596a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2cd10fda8276bb995288acfbfb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8769d5d852a6b56dd77186a1c6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cee5459245f652b75eb2759b4c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9d53d8c4d4227c02e4476129d2"`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum_old" AS ENUM('admin', 'vendor', 'user')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" TYPE "public"."users_role_enum_old" USING "role"::"text"::"public"."users_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user'`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."users_role_enum_old" RENAME TO "users_role_enum"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN "requestId"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN "userAgent"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN "ipAddress"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN "newValue"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN "previousValue"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN "resourceId"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN "resource"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN "adminId"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN "metadata"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN "failure_reason"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN "success"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN "user_agent"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN "ip_address"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN "resource_id"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN "resource_type"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "read_at"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "body"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "conversation_id"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "attachments"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "message"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "receiver_id"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "booking_id"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD "user_agent" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD "failure_reason" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD "resource_type" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD "ip_address" character varying(45) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD "success" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD "resource_id" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD "metadata" jsonb`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "receiver_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "message" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "attachments" jsonb`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "booking_id" uuid`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "read_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "body" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "conversation_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD CONSTRAINT "FK_bd2726fd31b35443f2245b93ba0" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_605b081c78bc3eeea959446596a" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_b561864743d235f44e70addc1f5" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_3bc55a7c3f9ed54b520bb5cfe23" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
