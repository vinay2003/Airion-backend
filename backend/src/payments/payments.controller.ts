import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    @Post('create-order')
    async createOrder(@Body() body: { amount: number; currency?: string; receiptId?: string }) {
        if (!body.amount) {
            throw new BadRequestException('Amount is required');
        }
        return this.paymentsService.createOrder(body.amount, body.currency, body.receiptId);
    }

    @Post('verify')
    verifyPayment(@Body() body: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }) {
        if (!body.razorpayOrderId || !body.razorpayPaymentId || !body.razorpaySignature) {
            throw new BadRequestException('Missing payment signature parameters');
        }
        
        const isValid = this.paymentsService.verifySignature(
            body.razorpayOrderId,
            body.razorpayPaymentId,
            body.razorpaySignature
        );

        if (!isValid) {
            throw new BadRequestException('Invalid payment signature');
        }

        // Ideally, update the booking/ad status in the DB here
        return { success: true, message: 'Payment verified successfully' };
    }
}
