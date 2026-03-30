import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Building,
    User,
    MapPin,
    Briefcase,
    TrendingUp,
    AlertCircle,
    ShieldCheck,
    CheckCircle,
    ArrowRight,
    ArrowLeft,
    Upload,
    Plus,
    X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import api from '../lib/api';

const VendorSignupWizard: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const basicDetails = location.state?.basicDetails || JSON.parse(localStorage.getItem('vendorBasicDetails') || '{}');

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const [currentStep, setCurrentStep] = useState(2); // Start at Step 2 since Step 1 is basic signup
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        // Step 2: Business Registration
        businessName: basicDetails?.businessName || '',
        businessAddress: '',
        city: basicDetails?.city || '',
        yearsInBusiness: '',
        gstNumber: '',

        // Step 3: Business Intelligence
        acquisitionChannels: [] as string[],
        monthlyEventVolume: '',
        averageBookingPrice: '',
        painPoints: [] as string[],

        // Step 4: Profile Completion
        portfolioImages: [] as string[],
        businessDescription: '',
    });

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRadioChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (name: string, value: string) => {
        setFormData(prev => {
            const currentList = prev[name as keyof typeof prev] as string[];
            if (currentList.includes(value)) {
                return { ...prev, [name]: currentList.filter(item => item !== value) };
            } else {
                return { ...prev, [name]: [...currentList, value] };
            }
        });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newImages = Array.from(e.target.files).map(file => URL.createObjectURL(file));
            setFormData(prev => ({
                ...prev,
                portfolioImages: [...prev.portfolioImages, ...newImages]
            }));
        }
    };

    const removeImage = (indexToRemove: number) => {
        setFormData(prev => ({
            ...prev,
            portfolioImages: prev.portfolioImages.filter((_, index) => index !== indexToRemove)
        }));
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 2));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (currentStep < 4) {
            nextStep();
            return;
        }

        setLoading(true);
        setError('');

        try {
            // In a real app, images would be uploaded to Supabase here and URLs stored
            const submissionData = {
                ...formData,
                businessEmail: basicDetails?.email,
                businessPhone: basicDetails?.phone,
                // Map the nested businessAddress for the backend DTO
                businessAddress: {
                    street: formData.businessAddress,
                    city: formData.city,
                    state: '', // Add state if needed
                    country: 'India',
                    zipCode: '',
                },
                businessHours: {
                    monday: { open: "09:00", close: "18:00" },
                    tuesday: { open: "09:00", close: "18:00" },
                    wednesday: { open: "09:00", close: "18:00" },
                    thursday: { open: "09:00", close: "18:00" },
                    friday: { open: "09:00", close: "18:00" }
                }
            };

            await api.post('/vendors', submissionData);
            alert('Congratulations! Your vendor profile is being reviewed.');
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to complete registration.');
        } finally {
            setLoading(false);
        }
    };

    const renderStepIndicator = () => (
        <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
            {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex flex-col items-center flex-1 relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 
                        ${currentStep >= step ? 'bg-red-600 border-red-600 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                        {currentStep > step || step === 1 ? <CheckCircle size={20} /> : step}
                    </div>
                    <span className={`text-xs mt-2 font-medium ${currentStep >= step ? 'text-red-600' : 'text-gray-400'}`}>
                        {step === 1 && "Basic"}
                        {step === 2 && "Registration"}
                        {step === 3 && "Intelligence"}
                        {step === 4 && "Completion"}
                    </span>
                    {step < 4 && (
                        <div className={`absolute top-5 left-1/2 w-full h-[2px] -z-0 
                            ${currentStep > step ? 'bg-red-600' : 'bg-gray-200'}`}></div>
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 text-center text-primary-content">
                    <h1 className="text-3xl font-bold mb-2">Vendor Onboarding</h1>
                    <p className="text-gray-500">Complete your profile to start receiving leads</p>
                </header>

                {renderStepIndicator()}

                <Card className="shadow-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {currentStep === 2 && <><Building className="text-red-600" /> Business Registration</>}
                            {currentStep === 3 && <><TrendingUp className="text-red-600" /> Business Intelligence</>}
                            {currentStep === 4 && <><ShieldCheck className="text-red-600" /> Profile Completion</>}
                        </CardTitle>
                        <CardDescription>
                            {currentStep === 2 && "Tell us about your business entity"}
                            {currentStep === 3 && "Help us understand your business better for targeted growth"}
                            {currentStep === 4 && "Add finishing touches and verify your account"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 text-red-700 p-3 rounded-md border border-red-200 text-sm">
                                    {error}
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Business Name</Label>
                                        <Input name="businessName" value={formData.businessName} onChange={handleTextChange} required />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <Label>Business Address</Label>
                                        <Input name="businessAddress" value={formData.businessAddress} onChange={handleTextChange} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>City</Label>
                                        <Input name="city" value={formData.city} onChange={handleTextChange} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Years in Business</Label>
                                        <Input name="yearsInBusiness" value={formData.yearsInBusiness} onChange={handleTextChange} placeholder="e.g. 5+ years" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>GST Number (Optional)</Label>
                                        <Input name="gstNumber" value={formData.gstNumber} onChange={handleTextChange} placeholder="Enter 15-digit GSTIN" />
                                    </div>
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <Label className="text-base">How do you currently acquire customers?</Label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {["Social Media", "Word of Mouth", "Local Ads", "JustDial/Indiamart", "Direct Walk-ins"].map(channel => (
                                                <div key={channel} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={channel}
                                                        checked={formData.acquisitionChannels.includes(channel)}
                                                        onCheckedChange={() => handleCheckboxChange('acquisitionChannels', channel)}
                                                    />
                                                    <Label htmlFor={channel}>{channel}</Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label>Average Monthly Events</Label>
                                            <Input name="monthlyEventVolume" value={formData.monthlyEventVolume} onChange={handleTextChange} placeholder="e.g. 5-10 events" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Average Booking Price (₹)</Label>
                                            <Input name="averageBookingPrice" value={formData.averageBookingPrice} onChange={handleTextChange} placeholder="e.g. 50000" />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Label className="text-base">What are your biggest pain points?</Label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {["Low Quality Leads", "High Commission", "Payment Delays", "Booking Management", "Visibility"].map(point => (
                                                <div key={point} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={point}
                                                        checked={formData.painPoints.includes(point)}
                                                        onCheckedChange={() => handleCheckboxChange('painPoints', point)}
                                                    />
                                                    <Label htmlFor={point}>{point}</Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {currentStep === 4 && (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label>Tell Customers About Your Business</Label>
                                        <Textarea
                                            name="businessDescription"
                                            value={formData.businessDescription}
                                            onChange={handleTextChange}
                                            placeholder="Write a brief intro about your services, experience, and what makes you unique... (minimum 10 characters)"
                                            className="h-32"
                                            minLength={10}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <Label className="text-base">Portfolio Showcase</Label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {formData.portfolioImages.map((imgUrl, index) => (
                                                <div key={index} className="relative rounded-lg h-32 border overflow-hidden group">
                                                    <img src={imgUrl} alt={`Portfolio ${index + 1}`} className="w-full h-full object-cover" />
                                                    <button 
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute top-2 right-2 bg-red-600 bg-opacity-90 text-white rounded-full p-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                            <div 
                                                onClick={() => fileInputRef.current?.click()}
                                                className="border-2 border-dashed rounded-lg h-32 flex flex-col items-center justify-center text-gray-400 hover:text-red-600 hover:border-red-600 transition-colors cursor-pointer"
                                            >
                                                <Plus size={24} />
                                                <span className="text-xs mt-2">Add Photo</span>
                                            </div>
                                            <input 
                                                type="file" 
                                                ref={fileInputRef} 
                                                onChange={handleImageUpload} 
                                                accept="image/*" 
                                                multiple 
                                                className="hidden" 
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                            <AlertCircle size={12} /> High-quality photos increase booking chances by 40%
                                        </p>
                                    </div>

                                    <div className="p-4 bg-green-50 rounded-lg border border-green-100 flex items-start gap-4">
                                        <div className="bg-green-100 p-2 rounded-full text-green-600">
                                            <ShieldCheck size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-green-800">Verification in Progress</h4>
                                            <p className="text-sm text-green-700">Once you submit, our team will verify your details within 24-48 hours. You'll receive a 'Verified' badge after approval.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between pt-6 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={prevStep}
                                    disabled={currentStep === 2}
                                >
                                    <ArrowLeft className="mr-2" size={18} /> Back
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-red-600 hover:bg-red-700 text-white min-w-[120px]"
                                    disabled={loading}
                                >
                                    {loading ? "Saving..." : (currentStep === 4 ? "Complete Verification" : "Next Step")}
                                    {currentStep < 4 && <ArrowRight className="ml-2" size={18} />}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default VendorSignupWizard;
