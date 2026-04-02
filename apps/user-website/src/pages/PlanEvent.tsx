import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Church, Building2, Mic, GraduationCap, Users,
    Palette, TrendingUp, Handshake, Sparkles, Trophy,
    ChevronRight, ChevronLeft, Check
} from 'lucide-react';

interface EventPlanningData {
    eventType: string;
    catering: string[];
    additionalServices: string[];
    guestCount: number;
    eventDate: string;
    budget: string;
    specialRequests: string;
}

const PlanEvent: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<EventPlanningData>({
        eventType: '',
        catering: [],
        additionalServices: [],
        guestCount: 0,
        eventDate: '',
        budget: '',
        specialRequests: '',
    });

    const steps = [
        'Explore Venue',
        'Catering',
        'Additional Services',
        'Guest Welcome',
        'Book Your Date',
        'Budget',
        'Request',
    ];

    const eventTypes = [
        { id: 'social', label: 'Social', icon: Church },
        { id: 'corporate', label: 'Corporate', icon: Building2 },
        { id: 'entertainment', label: 'Entertainment', icon: Mic },
        { id: 'educational', label: 'Educational', icon: GraduationCap },
        { id: 'community', label: 'Community', icon: Users },
        { id: 'cultural', label: 'Cultural & Art', icon: Palette },
        { id: 'industries', label: 'Industries', icon: TrendingUp },
        { id: 'nonprofit', label: 'Non-Profit', icon: Handshake },
        { id: 'religious', label: 'Religious', icon: Sparkles },
        { id: 'sporting', label: 'Sporting', icon: Trophy },
    ];

    const cateringOptions = [
        'Buffet Style',
        'Plated Service',
        'Family Style',
        'Cocktail Reception',
        'Food Stations',
        'BBQ Catering',
    ];

    const additionalServicesOptions = [
        'Photography',
        'Videography',
        'DJ Services',
        'Live Band',
        'Decoration',
        'Lighting',
        'Sound System',
        'Event Coordinator',
    ];

    const budgetRanges = [
        '₹50,000 - ₹1,00,000',
        '₹1,00,000 - ₹2,50,000',
        '₹2,50,000 - ₹5,00,000',
        '₹5,00,000 - ₹10,00,000',
        '₹10,00,000+',
    ];

    const handleEventTypeSelect = (type: string) => {
        setFormData({ ...formData, eventType: type });
    };

    const handleCateringToggle = (option: string) => {
        const updated = formData.catering.includes(option)
            ? formData.catering.filter(c => c !== option)
            : [...formData.catering, option];
        setFormData({ ...formData, catering: updated });
    };

    const handleServiceToggle = (service: string) => {
        const updated = formData.additionalServices.includes(service)
            ? formData.additionalServices.filter(s => s !== service)
            : [...formData.additionalServices, service];
        setFormData({ ...formData, additionalServices: updated });
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            // Submit and redirect to booking confirmation
            navigate('/booking-confirmation');
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: // Explore Venue
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-red-500 mb-2">
                                Which type of event do you want to plan?
                            </h2>
                            <p className="text-gray-500 dark:text-slate-400">
                                Choose the event type that best matches your needs
                            </p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {eventTypes.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => handleEventTypeSelect(type.id)}
                                    className={`p-6 rounded-2xl border-2 transition-all hover:scale-105 ${formData.eventType === type.id
                                            ? 'border-red-500 bg-red-50 dark:bg-red-500/10'
                                            : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-red-300 dark:hover:border-red-400'
                                        }`}
                                >
                                    <type.icon
                                        size={40}
                                        className={`mx-auto mb-3 ${formData.eventType === type.id
                                                ? 'text-red-500'
                                                : 'text-gray-700 dark:text-slate-300'
                                            }`}
                                    />
                                    <p className={`font-medium text-sm ${formData.eventType === type.id
                                            ? 'text-red-500'
                                            : 'text-gray-900 dark:text-white'
                                        }`}>
                                        {type.label}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 1: // Catering
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Select Catering Options
                            </h2>
                            <p className="text-gray-500 dark:text-slate-400">
                                Choose one or more catering styles for your event
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {cateringOptions.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => handleCateringToggle(option)}
                                    className={`p-6 rounded-xl border-2 transition-all text-left ${formData.catering.includes(option)
                                            ? 'border-red-500 bg-red-50 dark:bg-red-500/10'
                                            : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-red-300 dark:hover:border-red-400'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className={`font-medium ${formData.catering.includes(option)
                                                ? 'text-red-500'
                                                : 'text-gray-900 dark:text-white'
                                            }`}>
                                            {option}
                                        </span>
                                        {formData.catering.includes(option) && (
                                            <Check size={20} className="text-red-500" />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 2: // Additional Services
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Additional Services
                            </h2>
                            <p className="text-gray-500 dark:text-slate-400">
                                Enhance your event with professional services
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {additionalServicesOptions.map((service) => (
                                <button
                                    key={service}
                                    onClick={() => handleServiceToggle(service)}
                                    className={`p-6 rounded-xl border-2 transition-all ${formData.additionalServices.includes(service)
                                            ? 'border-red-500 bg-red-50 dark:bg-red-500/10'
                                            : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-red-300 dark:hover:border-red-400'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className={`font-medium ${formData.additionalServices.includes(service)
                                                ? 'text-red-500'
                                                : 'text-gray-900 dark:text-white'
                                            }`}>
                                            {service}
                                        </span>
                                        {formData.additionalServices.includes(service) && (
                                            <Check size={20} className="text-red-500" />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 3: // Guest Welcome
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Guest Count
                            </h2>
                            <p className="text-gray-500 dark:text-slate-400">
                                How many guests are you expecting?
                            </p>
                        </div>
                        <div className="max-w-md mx-auto">
                            <input
                                type="number"
                                value={formData.guestCount || ''}
                                onChange={(e) => setFormData({ ...formData, guestCount: parseInt(e.target.value) || 0 })}
                                placeholder="Enter number of guests"
                                className="w-full p-4 text-center text-2xl font-bold border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 text-gray-900 dark:text-white transition-all"
                            />
                            <div className="grid grid-cols-3 gap-3 mt-6">
                                {[50, 100, 200, 300, 500, 1000].map((count) => (
                                    <button
                                        key={count}
                                        onClick={() => setFormData({ ...formData, guestCount: count })}
                                        className="p-4 bg-gray-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl font-medium text-gray-900 dark:text-white transition-colors"
                                    >
                                        {count}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 4: // Book Your Date
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Select Event Date
                            </h2>
                            <p className="text-gray-500 dark:text-slate-400">
                                When would you like to host your event?
                            </p>
                        </div>
                        <div className="max-w-md mx-auto">
                            <input
                                type="date"
                                value={formData.eventDate}
                                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                                className="w-full p-4 text-center text-xl border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 text-gray-900 dark:text-white transition-all"
                            />
                        </div>
                    </div>
                );

            case 5: // Budget
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                What's Your Budget?
                            </h2>
                            <p className="text-gray-500 dark:text-slate-400">
                                Select your estimated budget range
                            </p>
                        </div>
                        <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                            {budgetRanges.map((range) => (
                                <button
                                    key={range}
                                    onClick={() => setFormData({ ...formData, budget: range })}
                                    className={`p-6 rounded-xl border-2 transition-all ${formData.budget === range
                                            ? 'border-red-500 bg-red-50 dark:bg-red-500/10'
                                            : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-red-300 dark:hover:border-red-400'
                                        }`}
                                >
                                    <span className={`font-medium text-lg ${formData.budget === range
                                            ? 'text-red-500'
                                            : 'text-gray-900 dark:text-white'
                                        }`}>
                                        {range}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 6: // Request
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Special Requests
                            </h2>
                            <p className="text-gray-500 dark:text-slate-400">
                                Any specific requirements or requests for your event?
                            </p>
                        </div>
                        <div className="max-w-2xl mx-auto">
                            <textarea
                                value={formData.specialRequests}
                                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                                placeholder="Tell us about any special requirements, dietary restrictions, accessibility needs, or other important details..."
                                rows={8}
                                className="w-full p-4 border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 transition-all resize-none"
                            />
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300 pt-20">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 sticky top-24">
                            <h3 className="text-xl font-bold text-red-500 mb-6">Choose Your Interest</h3>
                            <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">
                                Choose the options you want to add in your events
                            </p>
                            <div className="space-y-2">
                                {steps.map((step, index) => (
                                    <button
                                        key={step}
                                        onClick={() => setCurrentStep(index)}
                                        className={`w-full text-left px-4 py-3 rounded-lg transition-all ${currentStep === index
                                                ? 'bg-red-500 text-white font-medium'
                                                : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                                            }`}
                                    >
                                        {step}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-8 min-h-[600px]">
                            {renderStepContent()}

                            {/* Navigation Buttons */}
                            <div className="flex justify-center gap-4 mt-12">
                                {currentStep > 0 && (
                                    <button
                                        onClick={handleBack}
                                        className="px-8 py-3 bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-xl font-medium transition-all flex items-center gap-2"
                                    >
                                        <ChevronLeft size={20} />
                                        Back
                                    </button>
                                )}
                                <button
                                    onClick={handleNext}
                                    className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg shadow-red-500/20"
                                >
                                    {currentStep === steps.length - 1 ? 'Submit Request' : 'Next'}
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanEvent;
