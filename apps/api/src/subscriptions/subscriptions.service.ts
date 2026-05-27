import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionPlan, SubscriptionType } from './entities/subscription-plan.entity';
import { ActiveSubscription, SubscriptionStatus } from './entities/active-subscription.entity';

@Injectable()
export class SubscriptionsService {
    constructor(
        @InjectRepository(SubscriptionPlan)
        private planRepository: Repository<SubscriptionPlan>,
        @InjectRepository(ActiveSubscription)
        private activeSubscriptionRepository: Repository<ActiveSubscription>,
    ) {}

    // Public/User functions
    async getActivePlans(type: 'user' | 'vendor') {
        const subType = type === 'user' ? SubscriptionType.USER : SubscriptionType.VENDOR;
        return this.planRepository.find({
            where: { type: subType, isActive: true },
            order: { priority: 'ASC' }
        });
    }

    async getUserActiveSubscription(userId: string) {
        return this.activeSubscriptionRepository.findOne({
            where: { userId, status: SubscriptionStatus.ACTIVE },
            relations: ['plan']
        });
    }

    async createCheckoutSession(userId: string, planId: string) {
        const plan = await this.planRepository.findOne({ where: { id: planId } });
        if (!plan) throw new NotFoundException('Plan not found');

        // Here we would integrate with Stripe:
        // 1. Check if user has a stripeCustomerId, if not create one
        // 2. Create Stripe Checkout Session for subscription
        // 3. Return session URL to frontend

        return {
            success: true,
            message: 'Stripe Checkout Session URL would be returned here',
            // url: session.url
        };
    }

    async cancelSubscription(userId: string) {
        const sub = await this.activeSubscriptionRepository.findOne({
            where: { userId, status: SubscriptionStatus.ACTIVE }
        });

        if (!sub) throw new NotFoundException('No active subscription found');

        // Here we would call Stripe API to cancel auto-renew
        // await stripe.subscriptions.update(sub.stripeSubscriptionId, { cancel_at_period_end: true });

        sub.autoRenew = false;
        await this.activeSubscriptionRepository.save(sub);

        return { success: true, message: 'Subscription auto-renew cancelled' };
    }

    // Admin functions
    async getAllPlans() {
        return this.planRepository.find({ order: { type: 'ASC', priority: 'ASC' } });
    }

    async createPlan(data: Partial<SubscriptionPlan>) {
        const plan = this.planRepository.create(data);
        return this.planRepository.save(plan);
    }

    async updatePlan(id: string, data: Partial<SubscriptionPlan>) {
        const plan = await this.planRepository.findOne({ where: { id } });
        if (!plan) throw new NotFoundException('Plan not found');
        Object.assign(plan, data);
        return this.planRepository.save(plan);
    }

    async togglePlanStatus(id: string) {
        const plan = await this.planRepository.findOne({ where: { id } });
        if (!plan) throw new NotFoundException('Plan not found');
        plan.isActive = !plan.isActive;
        return this.planRepository.save(plan);
    }

    async deletePlan(id: string) {
        const plan = await this.planRepository.findOne({ where: { id } });
        if (!plan) throw new NotFoundException('Plan not found');
        await this.planRepository.remove(plan);
        return { success: true, message: 'Plan deleted' };
    }

    async getAllSubscribers() {
        return this.activeSubscriptionRepository.find({
            relations: ['plan', 'user'],
            order: { createdAt: 'DESC' }
        });
    }
}
