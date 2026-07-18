import { MigrationInterface, QueryRunner } from "typeorm";

export class VendorKYCLifecycle1784372311100 implements MigrationInterface {
    name = 'VendorKYCLifecycle1784372311100'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_3bc55a7c3f9ed54b520bb5cfe23"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_b561864743d235f44e70addc1f5"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_605b081c78bc3eeea959446596a"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "conversation_id"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "read_at"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "body"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "booking_id"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "receiver_id"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "attachments"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "message"`);
        await queryRunner.query(`ALTER TABLE "vendors" ADD "rejection_reason" text`);
        await queryRunner.query(`ALTER TABLE "vendors" ADD "reviewed_by_id" uuid`);
        await queryRunner.query(`ALTER TABLE "vendors" ADD "kyc_submitted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "vendors" ADD "kyc_reviewed_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "booking_id" uuid`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "receiver_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "message" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "attachments" jsonb`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "conversation_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "body" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "read_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "vendors" DROP COLUMN "verification_status"`);
        await queryRunner.query(`CREATE TYPE "public"."vendors_verification_status_enum" AS ENUM('DRAFT', 'EMAIL_PENDING', 'KYC_PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'SUSPENDED')`);
        await queryRunner.query(`ALTER TABLE "vendors" ADD "verification_status" "public"."vendors_verification_status_enum" NOT NULL DEFAULT 'DRAFT'`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_605b081c78bc3eeea959446596a" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_b561864743d235f44e70addc1f5" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_3bc55a7c3f9ed54b520bb5cfe23" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_3bc55a7c3f9ed54b520bb5cfe23"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_b561864743d235f44e70addc1f5"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_605b081c78bc3eeea959446596a"`);
        await queryRunner.query(`ALTER TABLE "vendors" DROP COLUMN "verification_status"`);
        await queryRunner.query(`DROP TYPE "public"."vendors_verification_status_enum"`);
        await queryRunner.query(`ALTER TABLE "vendors" ADD "verification_status" character varying NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "read_at"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "body"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "conversation_id"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "attachments"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "message"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "receiver_id"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "booking_id"`);
        await queryRunner.query(`ALTER TABLE "vendors" DROP COLUMN "kyc_reviewed_at"`);
        await queryRunner.query(`ALTER TABLE "vendors" DROP COLUMN "kyc_submitted_at"`);
        await queryRunner.query(`ALTER TABLE "vendors" DROP COLUMN "reviewed_by_id"`);
        await queryRunner.query(`ALTER TABLE "vendors" DROP COLUMN "rejection_reason"`);
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
