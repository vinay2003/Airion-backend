import { IsString, IsNotEmpty, IsUUID, IsNumber, IsDate, IsObject, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookingDto {
    @IsUUID()
    userId: string;

    @IsUUID()
    vendorId: string;

    @IsUUID()
    serviceId: string;

    @IsUUID()
    packageId: string;

    @IsNumber()
    totalAmount: number;

    @IsDate()
    @Type(() => Date)
    bookingDate: Date;

    @IsDate()
    @Type(() => Date)
    eventDate: Date;

    @IsObject()
    eventAddress: {
        street: string;
        city: string;
        state: string;
        country: string;
        zipCode: string;
        additionalInfo?: string;
    };

    @IsString()
    @IsOptional()
    specialRequirements?: string;

    @IsString()
    paymentMethod: string; // razorpay, stripe, cash
}
