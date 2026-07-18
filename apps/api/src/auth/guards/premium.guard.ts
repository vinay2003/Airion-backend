import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { SubscriptionsService } from '../../subscriptions/subscriptions.service';

@Injectable()
export class PremiumGuard implements CanActivate {
    constructor(private readonly subscriptionsService: SubscriptionsService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new ForbiddenException('User not authenticated');
        }

        // Only vendors should have premium features for now, but this works generally for any user ID
        const subscription = await this.subscriptionsService.getUserActiveSubscription(user.id);

        if (!subscription) {
            throw new ForbiddenException('Active Premium subscription required');
        }

        // Additional validation: checking expiration
        const currentDate = new Date();
        const endDate = new Date(subscription.currentPeriodEnd);
        if (endDate < currentDate) {
            throw new ForbiddenException('Premium subscription has expired');
        }

        // We could also check feature entitlements here if we pass a feature key to the guard using metadata
        // For now, checking for an active Premium subscription is sufficient

        // Attach subscription to request for downstream usage
        request.subscription = subscription;
        return true;
    }
}
