import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey, TableUnique } from 'typeorm';

export class CreateVendorProfileViews1721217036000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'vendor_profile_views',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'vendorId',
                        type: 'uuid',
                    },
                    {
                        name: 'viewerUserId',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'guestVisitorId',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'now()',
                    },
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey(
            'vendor_profile_views',
            new TableForeignKey({
                columnNames: ['vendorId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'vendors',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            'vendor_profile_views',
            new TableForeignKey({
                columnNames: ['viewerUserId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createIndex(
            'vendor_profile_views',
            new TableIndex({
                name: 'IDX_vendorId_createdAt',
                columnNames: ['vendorId', 'createdAt'],
            }),
        );

        await queryRunner.createUniqueConstraint(
            'vendor_profile_views',
            new TableUnique({
                name: 'UQ_vendor_viewerUserId',
                columnNames: ['vendorId', 'viewerUserId'],
            }),
        );

        await queryRunner.createUniqueConstraint(
            'vendor_profile_views',
            new TableUnique({
                name: 'UQ_vendor_guestVisitorId',
                columnNames: ['vendorId', 'guestVisitorId'],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('vendor_profile_views');
    }
}
