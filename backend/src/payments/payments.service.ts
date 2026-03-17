import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
    private razorpay: any;

    constructor(private configService: ConfigService) {
        this.razorpay = new Razorpay({
            key_id: this.configService.get<string>('RAZORPAY_KEY_ID') || 'dummy_key',
            key_secret: this.configService.get<string>('RAZORPAY_KEY_SECRET') || 'dummy_secret',
        });
    }

    async createOrder(amount: number, currency = 'INR', receiptId?: string) {
        try {
            const options = {
                amount: amount * 100, // Razorpay works in subunits (paise)
                currency,
                receipt: receiptId || `receipt_${Date.now()}`,
            };
            const order = await this.razorpay.orders.create(options);
            return order;
        } catch (error) {
            throw new InternalServerErrorException('Failed to create Razorpay order');
        }
    }

    verifySignature(razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string): boolean {
        const secret = this.configService.get<string>('RAZORPAY_KEY_SECRET') || 'dummy_secret';
        const body = razorpayOrderId + '|' + razorpayPaymentId;
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(body.toString())
            .digest('hex');
            
        return expectedSignature === razorpaySignature;
    }
}
