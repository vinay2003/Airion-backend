import { IsString, IsNotEmpty, IsOptional, IsArray, IsEmail } from 'class-validator';

export class CreateVendorDto {
    // Section 1: Basic Information
    @IsString()
    @IsNotEmpty()
    businessName: string;

    @IsString()
    @IsNotEmpty()
    ownerName: string;

    @IsString()
    @IsNotEmpty()
    businessType: string;

    @IsString()
    @IsOptional()
    otherBusinessType?: string;

    @IsString()
    @IsNotEmpty()
    businessAddress: string;

    @IsString()
    @IsNotEmpty()
    city: string;

    @IsString()
    @IsNotEmpty()
    contactNumber: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsNotEmpty()
    yearsInBusiness: string;

    // Section 2: Vendor Operations
    @IsArray()
    @IsNotEmpty()
    acquisitionChannels: string[];

    @IsString()
    @IsOptional()
    otherAcquisitionChannel?: string;

    @IsString()
    @IsNotEmpty()
    monthlyEventVolume: string;

    @IsString()
    @IsNotEmpty()
    averagePrice: string;

    @IsString()
    @IsNotEmpty()
    offerPackages: string;

    // Section 3: Challenges & Pain Points
    @IsArray()
    @IsNotEmpty()
    challenges: string[];

    @IsString()
    @IsNotEmpty()
    useDigitalTools: string;

    @IsString()
    @IsNotEmpty()
    mobileAppHelp: string;

    // Section 4: Platform Interest
    @IsString()
    @IsOptional()
    joinLikelihood?: string;

    @IsArray()
    @IsOptional()
    excitementFactors?: string[];

    @IsString()
    @IsOptional()
    preferredPricing?: string;

    @IsArray()
    @IsOptional()
    benefits?: string[];

    // Section 5: Expectations & Risk Factors
    @IsArray()
    @IsOptional()
    leaveReasons?: string[];

    @IsArray()
    @IsOptional()
    expectedSupport?: string[];

    @IsString()
    @IsOptional()
    joinTime?: string;

    // Section 6: Optional
    @IsString()
    @IsOptional()
    joinEarlyCommunity?: string;

    @IsString()
    @IsOptional()
    comments?: string;
}
