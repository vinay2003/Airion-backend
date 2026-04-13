import React, { useState } from 'react';
import {
    Church, Building2, Mic, GraduationCap, Users,
    Palette, TrendingUp, Handshake, Sparkles, Trophy,
    ChevronRight, ChevronLeft, Check, Target, Zap
} from 'lucide-react';

interface EventPlanningProps {
    onComplete?: (data: EventPlanningData) => void;
}

interface EventPlanningData {
    eventType: string;
    catering: string[];
    additionalServices: string[];
    guestCount: number;
    eventDate: string;
    budget: string;
    specialRequests: string;
}

/**
 * 📅 Neural Event Architect
 * Modernized with theme-aware tokens, premium typography, and high-contrast Day/Night mode support.
 */
const EventPlanning: React.FC<EventPlanningProps> = ({ onComplete }) => {
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
        'Venue Selection',
        'Culinary Logic',
        'Modular Services',
        'Guest Protocol',
        'Temporal Node',
        'Financial Matrix',
        'Special Directives',
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
            onComplete?.(formData);
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
                    <div className="space-y-10 animate-in fade-in duration-500">
                        <div className="text-center mb-12 space-y-4">
                            <h2 className="text-4xl font-black text-[var(--ease2event-brand-primary)] uppercase italic tracking-tighter">
                                Select Operational Node
                            </h2>
                            <p className="text-lg font-bold text-[var(--ease2event-text-muted)] uppercase tracking-widest">
                                Choose the event type that best matches your strategic requirements
                            </p>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                            {eventTypes.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => handleEventTypeSelect(type.id)}
                                    className={`p-10 rounded-[2rem] border-2 transition-all group relative overflow-hidden ${formData.eventType === type.id
                                        ? 'border-blue-500 bg-[var(--ease2event-bg-elevated)] shadow-xl shadow-blue-500/10'
                                        : 'border-[var(--ease2event-border-subtle)] bg-[var(--ease2event-bg-surface)] hover:border-blue-500/30'
                                        }`}
                                >
                                    <div className={`absolute inset-0 bg-blue-500/5 transition-transform duration-700 ${formData.eventType === type.id ? 'scale-100' : 'scale-0 group-hover:scale-100'}`}></div>
                                    <type.icon
                                        size={48}
                                        className={`mx-auto mb-6 transition-all relative z-10 ${formData.eventType === type.id
                                            ? 'text-blue-500 scale-110 drop-shadow-[0_0_10px_rgba(37,99,235,0.4)]'
                                            : 'text-[var(--ease2event-text-muted)] group-hover:text-blue-400'
                                            }`}
                                    />
                                    <p className={`font-black text-xs uppercase tracking-[0.2em] relative z-10 ${formData.eventType === type.id
                                        ? 'text-blue-500'
                                        : 'text-[var(--ease2event-text-secondary)] group-hover:text-[var(--ease2event-text-primary)]'
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
                    <div className="space-y-10 animate-in fade-in duration-500">
                        <div className="text-center mb-12 space-y-4">
                            <h2 className="text-4xl font-black text-[var(--ease2event-text-primary)] uppercase italic tracking-tighter">
                                Culinary Logistics
                            </h2>
                            <p className="text-lg font-bold text-[var(--ease2event-text-muted)] uppercase tracking-widest">
                                Choose one or more catering protocols for your mission
                            </p>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {cateringOptions.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => handleCateringToggle(option)}
                                    className={`p-10 rounded-[2rem] border-2 transition-all text-left group relative overflow-hidden ${formData.catering.includes(option)
                                        ? 'border-blue-500 bg-[var(--ease2event-bg-elevated)] shadow-xl'
                                        : 'border-[var(--ease2event-border-subtle)] bg-[var(--ease2event-bg-surface)] hover:border-blue-500/30'
                                        }`}
                                >
                                    <div className="flex items-center justify-between relative z-10">
                                        <span className={`font-black text-lg uppercase tracking-tight ${formData.catering.includes(option)
                                            ? 'text-blue-500'
                                            : 'text-[var(--ease2event-text-primary)]'
                                            }`}>
                                            {option}
                                        </span>
                                        {formData.catering.includes(option) && (
                                            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                                                <Check size={20} strokeWidth={4} />
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 3: // Guest Welcome
                return (
                    <div className="space-y-10 animate-in fade-in duration-500">
                        <div className="text-center mb-12 space-y-4">
                            <h2 className="text-4xl font-black text-[var(--ease2event-text-primary)] uppercase italic tracking-tighter">
                                Node Volume Index
                            </h2>
                            <p className="text-lg font-bold text-[var(--ease2event-text-muted)] uppercase tracking-widest">
                                Quantify the expected neural connections for this event
                            </p>
                        </div>
                        <div className="max-w-2xl mx-auto space-y-12">
                            <div className="relative group">
                                <Users className="absolute left-8 top-1/2 -translate-y-1/2 text-blue-500 opacity-50 group-focus-within:opacity-100 transition-opacity" size={32} />
                                <input
                                    type="number"
                                    value={formData.guestCount || ''}
                                    onChange={(e) => setFormData({ ...formData, guestCount: parseInt(e.target.value) || 0 })}
                                    placeholder="Enter capacity index"
                                    className="w-full pl-24 pr-10 py-10 bg-[var(--ease2event-bg-elevated)] border-2 border-[var(--ease2event-border-subtle)] rounded-[2.5rem] text-center text-4xl font-black italic tracking-tighter outline-none focus:border-blue-500 focus:ring-8 focus:ring-blue-500/5 text-[var(--ease2event-text-primary)] transition-all shadow-inner"
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                                {[100, 250, 500, 1000, 2500, 5000].map((count) => (
                                    <button
                                        key={count}
                                        onClick={() => setFormData({ ...formData, guestCount: count })}
                                        className="p-8 bg-[var(--ease2event-bg-surface)] border-2 border-[var(--ease2event-border-subtle)] hover:bg-[var(--ease2event-bg-elevated)] hover:border-blue-500/30 rounded-[1.5rem] font-black text-xl text-[var(--ease2event-text-primary)] transition-all uppercase italic tracking-tighter shadow-sm"
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
                    <div className="space-y-10 animate-in fade-in duration-500">
                        <div className="text-center mb-12 space-y-4">
                            <h2 className="text-4xl font-black text-[var(--ease2event-text-primary)] uppercase italic tracking-tighter">
                                Temporal Node Locking
                            </h2>
                            <p className="text-lg font-bold text-[var(--ease2event-text-muted)] uppercase tracking-widest">
                                Synchronize the event timestamp with the global registry
                            </p>
                        </div>
                        <div className="max-w-2xl mx-auto">
                            <input
                                type="date"
                                value={formData.eventDate}
                                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                                className="w-full p-10 text-center text-2xl font-black bg-[var(--ease2event-bg-elevated)] border-2 border-[var(--ease2event-border-subtle)] rounded-[2.5rem] outline-none focus:border-blue-500 focus:ring-8 focus:ring-blue-500/5 text-[var(--ease2event-text-primary)] transition-all shadow-xl uppercase italic tracking-widest"
                            />
                        </div>
                    </div>
                );

            case 5: // Budget
                return (
                    <div className="space-y-10 animate-in fade-in duration-500">
                        <div className="text-center mb-12 space-y-4">
                            <h2 className="text-4xl font-black text-[var(--ease2event-text-primary)] uppercase italic tracking-tighter">
                                Financial Matrix Allocation
                            </h2>
                            <p className="text-lg font-bold text-[var(--ease2event-text-muted)] uppercase tracking-widest">
                                Select your estimated capital flux range
                            </p>
                        </div>
                        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                            {budgetRanges.map((range) => (
                                <button
                                    key={range}
                                    onClick={() => setFormData({ ...formData, budget: range })}
                                    className={`p-10 rounded-[2.5rem] border-2 transition-all group overflow-hidden ${formData.budget === range
                                        ? 'border-blue-500 bg-[var(--ease2event-bg-elevated)] shadow-2xl'
                                        : 'border-[var(--ease2event-border-subtle)] bg-[var(--ease2event-bg-surface)] hover:border-blue-500/30'
                                        }`}
                                >
                                    <span className={`font-black text-2xl italic tracking-tighter uppercase ${formData.budget === range
                                        ? 'text-blue-500 scale-105 inline-block transition-transform'
                                        : 'text-[var(--ease2event-text-primary)]'
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
                    <div className="space-y-10 animate-in fade-in duration-500">
                        <div className="text-center mb-12 space-y-4">
                            <h2 className="text-4xl font-black text-[var(--ease2event-text-primary)] uppercase italic tracking-tighter">
                                Critical Directives
                            </h2>
                            <p className="text-lg font-bold text-[var(--ease2event-text-muted)] uppercase tracking-widest">
                                Any specific parameters or neural requirements for this operation?
                            </p>
                        </div>
                        <div className="max-w-4xl mx-auto">
                            <textarea
                                value={formData.specialRequests}
                                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                                placeholder="Input mission-critical details, dietary logic, accessibility protocols, or custom neural pathways..."
                                rows={10}
                                className="w-full p-12 bg-[var(--ease2event-bg-elevated)] border-2 border-[var(--ease2event-border-subtle)] rounded-[3.5rem] outline-none focus:border-blue-500 focus:ring-8 focus:ring-blue-500/5 text-[var(--ease2event-text-primary)] placeholder-[var(--ease2event-text-muted)] font-bold text-lg leading-relaxed transition-all resize-none shadow-inner"
                            />
                        </div>
                    </div>
                );

            default: // Additional Services (Default Fallback for Step 2)
                return (
                    <div className="space-y-10 animate-in fade-in duration-500">
                        <div className="text-center mb-12 space-y-4">
                            <h2 className="text-4xl font-black text-[var(--ease2event-text-primary)] uppercase italic tracking-tighter">
                                Modular Augmentations
                            </h2>
                            <p className="text-lg font-bold text-[var(--ease2event-text-muted)] uppercase tracking-widest">
                                Enhance your operational mission with professional sub-nodes
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {additionalServicesOptions.map((service) => (
                                <button
                                    key={service}
                                    onClick={() => handleServiceToggle(service)}
                                    className={`p-8 rounded-[2rem] border-2 transition-all group relative overflow-hidden ${formData.additionalServices.includes(service)
                                        ? 'border-blue-500 bg-[var(--ease2event-bg-elevated)] shadow-xl'
                                        : 'border-[var(--ease2event-border-subtle)] bg-[var(--ease2event-bg-surface)] hover:border-blue-500/30'
                                        }`}
                                >
                                    <div className="flex items-center justify-between relative z-10">
                                        <span className={`font-black text-sm uppercase tracking-widest ${formData.additionalServices.includes(service)
                                            ? 'text-blue-500'
                                            : 'text-[var(--ease2event-text-secondary)] group-hover:text-[var(--ease2event-text-primary)]'
                                            }`}>
                                            {service}
                                        </span>
                                        {formData.additionalServices.includes(service) && (
                                            <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg">
                                                <Check size={14} strokeWidth={4} />
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-[var(--ease2event-bg-base)] transition-colors duration-700 pb-24">
            <div className="max-w-[1600px] mx-auto px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
                    {/* Sidebar Navigator */}
                    <div className="lg:col-span-1">
                        <div className="card-minimal !p-10 rounded-[3rem] shadow-2xl border-[var(--ease2event-border-base)] sticky top-32 space-y-12">
                            <div className="space-y-4">
                                <h3 className="text-2xl font-black text-blue-500 uppercase italic tracking-tighter flex items-center gap-3">
                                    <Target size={28} />
                                    Mission Logic
                                </h3>
                                <p className="text-sm font-bold text-[var(--ease2event-text-muted)] uppercase tracking-[0.2em] leading-relaxed">
                                    Configure the neural nodes for your upcoming operation sequence.
                                </p>
                            </div>

                            <div className="space-y-3">
                                {steps.map((step, index) => (
                                    <button
                                        key={step}
                                        onClick={() => setCurrentStep(index)}
                                        className={`w-full text-left px-8 py-5 rounded-2xl transition-all relative group flex items-center justify-between ${currentStep === index
                                            ? 'bg-blue-600 text-white font-black shadow-xl shadow-blue-500/20 translate-x-3 scale-105 italic'
                                            : 'text-[var(--ease2event-text-secondary)] hover:bg-[var(--ease2event-bg-elevated)] hover:text-[var(--ease2event-text-primary)] font-bold uppercase tracking-widest text-[10px]'
                                            }`}
                                    >
                                        {step}
                                        {currentStep === index && <Zap size={14} className="animate-pulse" />}
                                    </button>
                                ))}
                            </div>

                            <div className="pt-8 border-t border-[var(--ease2event-border-subtle)] flex items-center justify-center">
                                <div className="text-[15px] font-black text-[var(--ease2event-text-muted)] uppercase tracking-[0.3em]">Operational Status: ALPHA</div>
                            </div>
                        </div>
                    </div>

                    {/* Main Construction Content */}
                    <div className="lg:col-span-3">
                        <div className="card-minimal !p-16 rounded-[4rem] shadow-2xl border-[var(--ease2event-border-base)] min-h-[800px] flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

                            <div className="relative z-10 flex-1">
                                {renderStepContent()}
                            </div>

                            {/* Sequential Navigation Buttons */}
                            <div className="flex justify-between items-center gap-10 mt-20 relative z-10">
                                <div className="flex-1 h-2 bg-[var(--ease2event-bg-elevated)] rounded-full overflow-hidden max-w-sm border border-[var(--ease2event-border-subtle)]">
                                    <div
                                        className="h-full bg-blue-600 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(37,99,235,0.6)]"
                                        style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                                    ></div>
                                </div>

                                <div className="flex gap-6">
                                    {currentStep > 0 && (
                                        <button
                                            onClick={handleBack}
                                            className="px-12 py-5 bg-[var(--ease2event-bg-surface)] hover:bg-[var(--ease2event-bg-elevated)] border-2 border-[var(--ease2event-border-subtle)] text-[var(--ease2event-text-primary)] rounded-3xl font-black uppercase tracking-widest text-xs transition-all flex items-center gap-3 active:scale-95 shadow-lg shadow-black/5"
                                        >
                                            <ChevronLeft size={24} />
                                            Revert Node
                                        </button>
                                    )}
                                    <button
                                        onClick={handleNext}
                                        className="px-14 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-black uppercase tracking-widest text-xs transition-all flex items-center gap-3 shadow-2xl shadow-blue-500/30 active:scale-95 hover:scale-105 italic"
                                    >
                                        {currentStep === steps.length - 1 ? 'Commit Sequence' : 'Advance Stream'}
                                        <ChevronRight size={24} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventPlanning;
