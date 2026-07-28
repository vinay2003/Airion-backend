import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOtpExpiresAt1784375171039 implements MigrationInterface {
    name = 'AddOtpExpiresAt1784375171039'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT IF EXISTS "FK_3bc55a7c3f9ed54b520bb5cfe23"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT IF EXISTS "FK_b561864743d235f44e70addc1f5"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT IF EXISTS "FK_605b081c78bc3eeea959446596a"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN IF EXISTS "conversation_id"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN IF EXISTS "read_at"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN IF EXISTS "body"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN IF EXISTS "booking_id"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN IF EXISTS "receiver_id"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN IF EXISTS "attachments"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN IF EXISTS "message"`);
        await queryRunner.query(`ALTER TABLE "messages" ADD COLUMN IF NOT EXISTS "booking_id" uuid`);
        await queryRunner.query(`ALTER TABLE "messages" ADD COLUMN IF NOT EXISTS "receiver_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD COLUMN IF NOT EXISTS "message" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD COLUMN IF NOT EXISTS "attachments" jsonb`);
        await queryRunner.query(`ALTER TABLE "messages" ADD COLUMN IF NOT EXISTS "conversation_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD COLUMN IF NOT EXISTS "body" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD COLUMN IF NOT EXISTS "read_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "otps" ADD COLUMN IF NOT EXISTS "expiresAt" bigint`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_605b081c78bc3eeea959446596a" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_b561864743d235f44e70addc1f5" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_3bc55a7c3f9ed54b520bb5cfe23" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_3bc55a7c3f9ed54b520bb5cfe23"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_b561864743d235f44e70addc1f5"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_605b081c78bc3eeea959446596a"`);
        await queryRunner.query(`ALTER TABLE "otps" DROP COLUMN "expiresAt"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "read_at"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "body"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "conversation_id"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "attachments"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "message"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "receiver_id"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "booking_id"`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "message" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "attachments" jsonb`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "receiver_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "booking_id" uuid`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "body" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "read_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "conversation_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_605b081c78bc3eeea959446596a" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_b561864743d235f44e70addc1f5" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_3bc55a7c3f9ed54b520bb5cfe23" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
