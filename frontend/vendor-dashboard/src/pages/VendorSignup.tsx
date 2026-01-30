import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Building,
    User,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    TrendingUp,
    AlertCircle,
    Star,
    ShieldCheck,
    MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

const VendorSignup: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        // Section 1: Basic Information
        businessName: '',
        ownerName: '',
        businessType: '',
        otherBusinessType: '',
        businessAddress: '',
        city: '',
        contactNumber: '',
        email: '',
        yearsInBusiness: '',

        // Section 2: Vendor Operations
        acquisitionChannels: [] as string[],
        otherAcquisitionChannel: '',
        monthlyEventVolume: '',
        averagePrice: '',
        offerPackages: '',

        // Section 3: Challenges & Pain Points
        challenges: [] as string[],
        useDigitalTools: '',
        mobileAppHelp: '',

        // Section 4: Platform Interest
        joinLikelihood: '',
        excitementFactors: [] as string[],
        preferredPricing: '',
        benefits: [] as string[],

        // Section 5: Expectations & Risk Factors
        leaveReasons: [] as string[],
        expectedSupport: [] as string[],
        joinTime: '',

        // Section 6: Optional
        joinEarlyCommunity: '',
        comments: ''
    });

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRadioChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (name: string, value: string, maxSelection?: number) => {
        setFormData(prev => {
            const currentList = prev[name as keyof typeof prev] as string[];
            if (currentList.includes(value)) {
                return { ...prev, [name]: currentList.filter(item => item !== value) };
            } else {
                if (maxSelection && currentList.length >= maxSelection) {
                    return prev; // Do not add if max limit reached
                }
                return { ...prev, [name]: [...currentList, value] };
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Get JWT token from localStorage (assuming user is already authenticated)
            const token = localStorage.getItem('token');

            if (!token) {
                alert('Please login first to create a vendor profile');
                navigate('/vendor/login');
                return;
            }

            // Submit to backend API - using /api path
            const response = await fetch('/api/vendors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',  // Send cookies
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create vendor profile');
            }

            alert('Vendor registration successful!');
            navigate('/vendor/dashboard');
        } catch (error) {
            console.error('Vendor registration error:', error);
            alert(error instanceof Error ? error.message : 'Failed to register vendor profile. Please try again.');
        }
    };

    const sectionTitleClass = "text-xl font-semibold mt-6 mb-4 flex items-center gap-2 text-primary";

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
            <Card className="max-w-4xl mx-auto shadow-lg">
                <CardHeader className="text-center border-b bg-white dark:bg-slate-900 rounded-t-xl sticky top-0 z-10">
                    <div className="flex justify-center mb-2">
                        <div className="bg-red-500 text-white p-2 rounded-lg">
                            <span className="text-xl font-bold">Ai</span>
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-bold">Vendor Registration</CardTitle>
                    <CardDescription>Join Airion Solutions - The Future of Event Management</CardDescription>
                </CardHeader>
                <CardContent className="p-6 md:p-10 space-y-8">
                    <form onSubmit={handleSubmit}>

                        {/* Section 1: Basic Information */}
                        <div>
                            <h3 className={sectionTitleClass}><User className="h-5 w-5" /> Section 1: Basic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="businessName">1. Business Name</Label>
                                    <Input id="businessName" name="businessName" placeholder="Enter business name" value={formData.businessName} onChange={handleTextChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ownerName">2. Owner's Full Name</Label>
                                    <Input id="ownerName" name="ownerName" placeholder="Enter owner's name" value={formData.ownerName} onChange={handleTextChange} required />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <Label>3. Business Type</Label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                        {[
                                            "Venue (Banquet / Hotel / Resort)",
                                            "Caterer",
                                            "Photographer / Videographer",
                                            "Florist / Decorator",
                                            "Makeup Artist / Salon",
                                            "Cake / Sweet Shop",
                                            "Music / DJ / Band",
                                            "Event Planner / Coordinator",
                                            "Other"
                                        ].map((type) => (
                                            <div key={type} className="flex items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    name="businessType"
                                                    value={type}
                                                    checked={formData.businessType === type}
                                                    onChange={(e) => handleRadioChange('businessType', e.target.value)}
                                                    className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300"
                                                />
                                                <label className="text-sm font-medium">{type}</label>
                                            </div>
                                        ))}
                                    </div>
                                    {formData.businessType === 'Other' && (
                                        <Input
                                            name="otherBusinessType"
                                            placeholder="Please specify"
                                            value={formData.otherBusinessType}
                                            onChange={handleTextChange}
                                            className="mt-2"
                                        />
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="businessAddress">4. Business Address</Label>
                                    <Input id="businessAddress" name="businessAddress" placeholder="Full address" value={formData.businessAddress} onChange={handleTextChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="city">5. City / District</Label>
                                    <Input id="city" name="city" placeholder="City" value={formData.city} onChange={handleTextChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contactNumber">6. Contact Number</Label>
                                    <Input id="contactNumber" name="contactNumber" type="tel" placeholder="+91..." value={formData.contactNumber} onChange={handleTextChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">7. Email (optional)</Label>
                                    <Input id="email" name="email" type="email" placeholder="Email address" value={formData.email} onChange={handleTextChange} />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <Label>8. Years in Business</Label>
                                    <div className="flex gap-4 flex-wrap">
                                        {["<1", "1–3", "3–5", "5+"].map(opt => (
                                            <label key={opt} className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="yearsInBusiness"
                                                    value={opt}
                                                    checked={formData.yearsInBusiness === opt}
                                                    onChange={(e) => handleRadioChange("yearsInBusiness", e.target.value)}
                                                    className="w-4 h-4 text-red-600"
                                                />
                                                <span>{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Vendor Operations */}
                        <div>
                            <h3 className={sectionTitleClass}><Briefcase className="h-5 w-5" /> Section 2: Vendor Operations</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>9. How do you currently get customers? (Select all)</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        {["Word of mouth", "Social Media", "Online Listings", "Walk-ins", "Event Planners", "Other"].map((opt) => (
                                            <div key={opt} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`acq-${opt}`}
                                                    checked={formData.acquisitionChannels.includes(opt)}
                                                    onCheckedChange={() => handleCheckboxChange('acquisitionChannels', opt)}
                                                />
                                                <label htmlFor={`acq-${opt}`} className="text-sm cursor-pointer">{opt}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>10. Monthly event volume</Label>
                                    <div className="flex gap-4 flex-wrap">
                                        {["1–5", "6–10", "11–20", "20+"].map(opt => (
                                            <label key={opt} className="flex items-center space-x-2 cursor-pointer">
                                                <input type="radio" name="monthlyEventVolume" value={opt} checked={formData.monthlyEventVolume === opt} onChange={(e) => handleRadioChange("monthlyEventVolume", e.target.value)} className="text-red-600" />
                                                <span>{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>11. Average price per booking</Label>
                                    <div className="flex gap-4 flex-wrap">
                                        {["<₹5k", "₹5k–25k", "₹25k–1L", ">1L"].map(opt => (
                                            <label key={opt} className="flex items-center space-x-2 cursor-pointer">
                                                <input type="radio" name="averagePrice" value={opt} checked={formData.averagePrice === opt} onChange={(e) => handleRadioChange("averagePrice", e.target.value)} className="text-red-600" />
                                                <span>{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>12. Do you offer packages?</Label>
                                    <div className="flex gap-4">
                                        {["Yes", "No"].map(opt => (
                                            <label key={opt} className="flex items-center space-x-2 cursor-pointer">
                                                <input type="radio" name="offerPackages" value={opt} checked={formData.offerPackages === opt} onChange={(e) => handleRadioChange("offerPackages", e.target.value)} className="text-red-600" />
                                                <span>{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Challenges & Pain Points */}
                        <div>
                            <h3 className={sectionTitleClass}><AlertCircle className="h-5 w-5" /> Section 3: Challenges & Pain Points</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>13. Biggest challenges (Select up to 3)</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {["Low visibility", "Competition", "High ad cost", "Fake leads", "Payment delays", "Booking issues"].map((opt) => (
                                            <div key={opt} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`chall-${opt}`}
                                                    checked={formData.challenges.includes(opt)}
                                                    onCheckedChange={() => handleCheckboxChange('challenges', opt, 3)}
                                                    disabled={!formData.challenges.includes(opt) && formData.challenges.length >= 3}
                                                />
                                                <label htmlFor={`chall-${opt}`} className="text-sm cursor-pointer">{opt}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>14. Do you use digital tools?</Label>
                                    <div className="flex gap-4">
                                        {["Yes", "No"].map(opt => (
                                            <label key={opt} className="flex items-center space-x-2 cursor-pointer">
                                                <input type="radio" name="useDigitalTools" value={opt} checked={formData.useDigitalTools === opt} onChange={(e) => handleRadioChange("useDigitalTools", e.target.value)} className="text-red-600" />
                                                <span>{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>15. Would a mobile booking app help you?</Label>
                                    <div className="flex gap-4">
                                        {["Yes", "Maybe", "No"].map(opt => (
                                            <label key={opt} className="flex items-center space-x-2 cursor-pointer">
                                                <input type="radio" name="mobileAppHelp" value={opt} checked={formData.mobileAppHelp === opt} onChange={(e) => handleRadioChange("mobileAppHelp", e.target.value)} className="text-red-600" />
                                                <span>{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Platform Interest */}
                        <div>
                            <h3 className={sectionTitleClass}><TrendingUp className="h-5 w-5" /> Section 4: Platform Interest</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>16. Likelihood to join Airion (1-5)</Label>
                                    <div className="flex gap-6">
                                        {[1, 2, 3, 4, 5].map(num => (
                                            <label key={num} className="flex flex-col items-center cursor-pointer">
                                                <span className="text-sm font-medium mb-1">{num}</span>
                                                <input type="radio" name="joinLikelihood" value={num.toString()} checked={formData.joinLikelihood === num.toString()} onChange={(e) => handleRadioChange("joinLikelihood", e.target.value)} className="text-red-600" />
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>17. What excites you most? (Select 3)</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {["Free listing", "Genuine leads", "Local ads", "Vendor dashboard", "Training", "Payment security"].map((opt) => (
                                            <div key={opt} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`em-${opt}`}
                                                    checked={formData.excitementFactors.includes(opt)}
                                                    onCheckedChange={() => handleCheckboxChange('excitementFactors', opt, 3)}
                                                    disabled={!formData.excitementFactors.includes(opt) && formData.excitementFactors.length >= 3}
                                                />
                                                <label htmlFor={`em-${opt}`} className="text-sm cursor-pointer">{opt}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>18. Preferred pricing model</Label>
                                    <div className="flex gap-4 flex-wrap">
                                        {["Free", "Monthly", "Yearly", "Commission"].map(opt => (
                                            <label key={opt} className="flex items-center space-x-2 cursor-pointer">
                                                <input type="radio" name="preferredPricing" value={opt} checked={formData.preferredPricing === opt} onChange={(e) => handleRadioChange("preferredPricing", e.target.value)} className="text-red-600" />
                                                <span>{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>19. What benefits matter most?</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {["Promotions", "Profile page", "Feedback system", "Packages access", "EMI support"].map((opt) => (
                                            <div key={opt} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`benefit-${opt}`}
                                                    checked={formData.benefits.includes(opt)}
                                                    onCheckedChange={() => handleCheckboxChange('benefits', opt)}
                                                />
                                                <label htmlFor={`benefit-${opt}`} className="text-sm cursor-pointer">{opt}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 5: Expectations & Risk Factors */}
                        <div>
                            <h3 className={sectionTitleClass}><ShieldCheck className="h-5 w-5" /> Section 5: Expectations & Risk Factors</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>20. What may cause you to leave the platform?</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {["Hidden charges", "Poor support", "Fake leads", "Complex UI", "No growth", "Trust issues"].map((opt) => (
                                            <div key={opt} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`leave-${opt}`}
                                                    checked={formData.leaveReasons.includes(opt)}
                                                    onCheckedChange={() => handleCheckboxChange('leaveReasons', opt)}
                                                />
                                                <label htmlFor={`leave-${opt}`} className="text-sm cursor-pointer">{opt}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>21. What support do you expect?</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {["Marketing help", "Profile setup", "Booking assistance", "Technical training", "Insights"].map((opt) => (
                                            <div key={opt} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`sup-${opt}`}
                                                    checked={formData.expectedSupport.includes(opt)}
                                                    onCheckedChange={() => handleCheckboxChange('expectedSupport', opt)}
                                                />
                                                <label htmlFor={`sup-${opt}`} className="text-sm cursor-pointer">{opt}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>22. When will you join Airion?</Label>
                                    <div className="flex gap-4 flex-wrap">
                                        {["Immediately", "Within 1 month", "After others join", "Not sure"].map(opt => (
                                            <label key={opt} className="flex items-center space-x-2 cursor-pointer">
                                                <input type="radio" name="joinTime" value={opt} checked={formData.joinTime === opt} onChange={(e) => handleRadioChange("joinTime", e.target.value)} className="text-red-600" />
                                                <span>{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 6: Optional */}
                        <div>
                            <h3 className={sectionTitleClass}><MessageSquare className="h-5 w-5" /> Section 6: Optional</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>23. Join early vendor community?</Label>
                                    <div className="flex gap-4">
                                        {["Yes", "Maybe", "No"].map(opt => (
                                            <label key={opt} className="flex items-center space-x-2 cursor-pointer">
                                                <input type="radio" name="joinEarlyCommunity" value={opt} checked={formData.joinEarlyCommunity === opt} onChange={(e) => handleRadioChange("joinEarlyCommunity", e.target.value)} className="text-red-600" />
                                                <span>{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="comments">24. Additional comments</Label>
                                    <Textarea
                                        id="comments"
                                        name="comments"
                                        placeholder="Any other feedback or questions?"
                                        value={formData.comments}
                                        onChange={handleTextChange}
                                        className="h-24"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-lg py-6">
                                Submit Vendor Profile
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default VendorSignup;
