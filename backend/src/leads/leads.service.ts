import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from './entities/lead.entity';
import { Service } from '../services/entities/service.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class LeadsService {
    constructor(
        @InjectRepository(Lead)
        private readonly leadRepository: Repository<Lead>,
        @InjectRepository(Service)
        private readonly serviceRepository: Repository<Service>,
        private readonly notificationsService: NotificationsService,
    ) { }

    async create(userId: string, createDto: { vendorId: string; serviceId?: string; eventDate: string; guestsCount?: number; budget?: number; notes?: string }): Promise<Lead> {
        // 1. Calculate AI Score (Heuristic)
        let aiScore = 50; // Base score
        const reasons: string[] = [];

        // Condition A: High Budget
        const budget = createDto.budget || 0;
        if (budget > 100000) {
             aiScore += 25;
             reasons.push('High budget threshold met');
        } else if (budget > 50000) {
             aiScore += 15;
             reasons.push('Moderate budget threshold');
        }

        // Condition B: High Urgency (Event Date)
        const eventDate = new Date(createDto.eventDate);
        const daysToEvent = (eventDate.getTime() - Date.now()) / (1000 * 3600 * 24);
        if (daysToEvent > 0 && daysToEvent <= 30) {
             aiScore += 20;
             reasons.push('High Urgency - Event within 30 days');
        } else if (daysToEvent <= 90) {
             aiScore += 10;
        }

        // Condition C: Service Data Alignment
        if (createDto.serviceId) {
             const service = await this.serviceRepository.findOne({ where: { id: createDto.serviceId } });
             if (service) {
                  const serviceBasePrice = parseFloat(service.basePrice.toString());
                  if (budget >= serviceBasePrice) {
                       aiScore += 15;
                       reasons.push('Budget matches service base price requirements');
                  }
             }
        }

        aiScore = Math.min(aiScore, 100); // Caps Score at 100

        // 2. Save Lead logic
        const lead = this.leadRepository.create({
            ...createDto,
            userId,
            eventDate,
            aiScore,
            aiReasoning: reasons.join(', ') || 'Standard listing matching',
        });

        const savedLead = await this.leadRepository.save(lead);

        // 3. Notify Vendor about new Warm Lead
        try {
             await this.notificationsService.create({
                  userId: createDto.vendorId,
                  type: 'lead_added',
                  title: 'New Hot Lead Added',
                  message: `New Lead with AI Score of ${aiScore}/100 created for your services.`,
                  data: { leadId: savedLead.id }
             });
        } catch (error) {
             console.error('Lead triggering notification crash:', error);
        }

        return savedLead;
    }

    async findByVendorUserId(userId: string): Promise<Lead[]> {
        return this.leadRepository.find({
            where: { vendor: { userId } },
            relations: ['user', 'service', 'vendor'],
            order: { aiScore: 'DESC', createdAt: 'DESC' }, // Sort Hot Leads first
        });
    }

    async findOne(id: string, user?: { userId: string, role: string }): Promise<Lead> {
        const lead = await this.leadRepository.findOne({ where: { id }, relations: ['user', 'service', 'vendor'] });
        if (!lead) {
            throw new NotFoundException('Lead not found');
        }

        if (user && user.role !== 'admin') {
            if (user.role === 'user' && lead.userId !== user.userId) {
                throw new ForbiddenException('You do not have permission to view this lead');
            }
            if (user.role === 'vendor' && lead.vendor?.userId !== user.userId) {
                throw new ForbiddenException('You do not have permission to view this lead');
            }
        }

        return lead;
    }

    async updateStatus(id: string, status: string, user?: { userId: string, role: string }): Promise<Lead> {
        const lead = await this.findOne(id, user);
        lead.status = status;
        return this.leadRepository.save(lead);
    }
}
