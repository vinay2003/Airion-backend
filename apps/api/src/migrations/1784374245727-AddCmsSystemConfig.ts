import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCmsSystemConfig1784374245727 implements MigrationInterface {
    name = 'AddCmsSystemConfig1784374245727'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT IF EXISTS "FK_3bc55a7c3f9ed54b520bb5cfe23"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT IF EXISTS "FK_b561864743d235f44e70addc1f5"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT IF EXISTS "FK_605b081c78bc3eeea959446596a"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP CONSTRAINT IF EXISTS "FK_9d53d8c4d4227c02e4476129d25"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_9d53d8c4d4227c02e4476129d2"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_cee5459245f652b75eb2759b4c"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_8769d5d852a6b56dd77186a1c6"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_2cd10fda8276bb995288acfbfb"`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "system_configs" ("key" character varying(255) NOT NULL, "value" jsonb, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5aff9a6d272a5cedf54d7aaf617" PRIMARY KEY ("key"))`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN IF EXISTS "conversation_id"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN IF EXISTS "read_at"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN IF EXISTS "body"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN IF EXISTS "booking_id"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN IF EXISTS "receiver_id"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN IF EXISTS "attachments"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN IF EXISTS "message"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN IF EXISTS "adminId"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN IF EXISTS "previousValue"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN IF EXISTS "newValue"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN IF EXISTS "resource"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN IF EXISTS "resourceId"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN IF EXISTS "ipAddress"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN IF EXISTS "userAgent"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN IF EXISTS "requestId"`);
        await queryRunner.query(`ALTER TABLE "messages" ADD COLUMN IF NOT EXISTS "booking_id" uuid`);
        await queryRunner.query(`ALTER TABLE "messages" ADD COLUMN IF NOT EXISTS "receiver_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD COLUMN IF NOT EXISTS "message" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD COLUMN IF NOT EXISTS "attachments" jsonb`);
        await queryRunner.query(`ALTER TABLE "messages" ADD COLUMN IF NOT EXISTS "conversation_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD COLUMN IF NOT EXISTS "body" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD COLUMN IF NOT EXISTS "read_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ALTER COLUMN "ip_address" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ALTER COLUMN "user_agent" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_605b081c78bc3eeea959446596a" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_b561864743d235f44e70addc1f5" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_3bc55a7c3f9ed54b520bb5cfe23" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_3bc55a7c3f9ed54b520bb5cfe23"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_b561864743d235f44e70addc1f5"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_605b081c78bc3eeea959446596a"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ALTER COLUMN "user_agent" SET DEFAULT 'Unknown'`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ALTER COLUMN "ip_address" SET DEFAULT '127.0.0.1'`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "read_at"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "body"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "conversation_id"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "attachments"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "message"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "receiver_id"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "booking_id"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD "requestId" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD "userAgent" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD "ipAddress" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD "resourceId" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD "resource" character varying(100) NOT NULL DEFAULT 'system'`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD "newValue" jsonb`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD "previousValue" jsonb`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD "adminId" uuid`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "message" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "attachments" jsonb`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "receiver_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "booking_id" uuid`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "body" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "read_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "conversation_id" uuid NOT NULL`);
        await queryRunner.query(`DROP TABLE "system_configs"`);
        await queryRunner.query(`CREATE INDEX "IDX_2cd10fda8276bb995288acfbfb" ON "audit_logs" ("created_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_8769d5d852a6b56dd77186a1c6" ON "audit_logs" ("resource") `);
        await queryRunner.query(`CREATE INDEX "IDX_cee5459245f652b75eb2759b4c" ON "audit_logs" ("action") `);
        await queryRunner.query(`CREATE INDEX "IDX_9d53d8c4d4227c02e4476129d2" ON "audit_logs" ("adminId") `);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD CONSTRAINT "FK_9d53d8c4d4227c02e4476129d25" FOREIGN KEY ("adminId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_605b081c78bc3eeea959446596a" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_b561864743d235f44e70addc1f5" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_3bc55a7c3f9ed54b520bb5cfe23" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
