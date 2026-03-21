import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { Lead } from './entities/lead.entity';
import { Service } from '../services/entities/service.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([Lead, Service]), NotificationsModule],
  controllers: [LeadsController],
  providers: [LeadsService],
  exports: [LeadsService],
})
export class LeadsModule {}
