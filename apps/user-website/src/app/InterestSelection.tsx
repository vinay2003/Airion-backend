import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Check, ArrowRight, Heart, Camera, MapPin, Music, Utensils, Home, PartyPopper, Briefcase, Calendar, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '../lib/apiClient';
import { motion, AnimatePresence } from 'framer-motion';

const SERVICES = [
    { id: 'venue', label: 'Venues', icon: <Home size={20} /> },
    { id: 'catering', label: 'Catering', icon: <Utensils size={20} /> },
    { id: 'photography', label: 'Photography', icon: <Camera size={20} /> },
    { id: 'decor', label: 'Decorations', icon: <Sparkles size={20} /> },
    { id: 'music', label: 'Music & DJ', icon: <Music size={20} /> },
    { id: 'makeup', label: 'Makeup', icon: <Heart size={20} /> },
    { id: 'planning', label: 'Event Planning', icon: <Briefcase size={20} /> },
];

const EVENT_TYPES = [
    { id: 'wedding', label: 'Wedding', icon: <Heart size={24} /> },
    { id: 'birthday', label: 'Birthday Party', icon: <PartyPopper size={24} /> },
    { id: 'corporate', label: 'Corporate Event', icon: <Briefcase size={24} /> },
    { id: 'other', label: 'Social Gathering', icon: <Calendar size={24} /> },
];

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata'];

const OnboardingFlow: React.FC = () => {
    const navigate = useNavigate();

    // Step state
    const [step, setStep] = useState(0); // 0: Splash, 1: Intent, 2: Services, 3: Location

    // Form state
    const [eventType, setEventType] = useState<string | null>(null);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [location, setLocation] = useState<string>('');
    const [loading, setLoading] = useState(false);

    // Auto-advance splash screen
    useEffect(() => {
        if (step === 0) {
            const timer = setTimeout(() => setStep(1), 2500);
            return () => clearTimeout(timer);
        }
    }, [step]);

    const toggleService = (id: string) => {
        setSelectedServices(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleComplete = async () => {
        setLoading(true);
        try {
            await api.patch('/auth/profile', {
                interests: selectedServices,
                eventType,
                location
            });
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to save profile details:', error);
            navigate('/dashboard'); // Proceed anyway for UX
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => {
        if (step < 3) setStep(step + 1);
        else handleComplete();
    };

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 100 : -100,
            opacity: 0
        })
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 overflow-hidden relative">

            {/* Progress Bar (Hidden on Splash) */}
            {step > 0 && (
                <div className="absolute top-0 left-0 w-full h-1.5 bg-neutral-100 dark:bg-neutral-800">
                    <motion.div
                        className="h-full bg-red-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / 3) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            )}

            <div className="w-full max-w-2xl relative">
                <AnimatePresence mode="wait" custom={1}>

                    {/* STEP 0: Splash Screen */}
                    {step === 0 && (
                        <motion.div
                            key="splash"
                            className="flex flex-col items-center justify-center text-center space-y-6"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <div className="w-24 h-24 bg-red-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-red-500/30">
                                <Sparkles size={48} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white tracking-tight mb-4 font-cursive">Welcome to Ease2event</h1>
                                <p className="text-xl text-neutral-500 dark:text-neutral-400 font-medium">Let's craft your perfect experience.</p>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 1: Intent (Setup) */}
                    {step === 1 && (
                        <motion.div
                            key="intent"
                            custom={1} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-2xl border border-neutral-100 dark:border-slate-800"
                        >
                            <div className="mb-10 text-center">
                                <h2 className="text-3xl font-black text-neutral-900 dark:text-white mb-3">What are you planning?</h2>
                                <p className="text-neutral-500 dark:text-neutral-400 font-medium text-lg">Help us personalize your vendor recommendations.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                                {EVENT_TYPES.map(type => (
                                    <button
                                        key={type.id}
                                        onClick={() => setEventType(type.id)}
                                        className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left group ${eventType === type.id
                                                ? 'border-red-500 bg-red-50 dark:bg-red-500/10 dark:border-red-500'
                                                : 'border-neutral-200 dark:border-slate-800  dark: hover:bg-neutral-50 dark:hover:bg-slate-800/50'
                                            }`}
                                    >
                                        <div className={`p-3 rounded-xl transition-colors ${eventType === type.id ? 'bg-red-500 text-white' : 'bg-neutral-100 dark:bg-slate-800 text-neutral-600 dark:text-neutral-400 group-hover:text-red-500'
                                            }`}>
                                            {type.icon}
                                        </div>
                                        <div className="flex-1 font-bold text-neutral-900 dark:text-white">
                                            {type.label}
                                        </div>
                                        {eventType === type.id && <CheckCircle2 className="text-red-500" size={24} />}
                                    </button>
                                ))}
                            </div>

                            <div className="flex justify-end pt-6 border-t border-neutral-100 dark:border-slate-800">
                                <Button onClick={nextStep} disabled={!eventType} className="bg-neutral-900 hover:bg-red-600 dark:bg-white dark:text-neutral-900 dark:hover:bg-red-500 dark:hover:text-white px-8 py-6 rounded-xl text-lg font-bold transition-colors">
                                    Continue <ArrowRight size={20} className="ml-2" />
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: Interests (Services) */}
                    {step === 2 && (
                        <motion.div
                            key="services"
                            custom={1} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-2xl border border-neutral-100 dark:border-slate-800"
                        >
                            <div className="mb-10 text-center">
                                <h2 className="text-3xl font-black text-neutral-900 dark:text-white mb-3">What services do you need?</h2>
                                <p className="text-neutral-500 dark:text-neutral-400 font-medium text-lg">Select at least one to continue.</p>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                                {SERVICES.map(service => (
                                    <button
                                        key={service.id}
                                        onClick={() => toggleService(service.id)}
                                        className={`flex flex-col items-center justify-center p-6 space-y-4 rounded-3xl border-2 transition-all text-center group ${selectedServices.includes(service.id)
                                                ? 'border-red-500 bg-red-50 dark:bg-red-500/10 dark:border-red-500'
                                                : 'border-neutral-200 dark:border-slate-800  dark: hover:bg-neutral-50 dark:hover:bg-slate-800/50'
                                            }`}
                                    >
                                        <div className={`p-4 rounded-2xl transition-colors ${selectedServices.includes(service.id) ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-neutral-100 dark:bg-slate-800 text-neutral-600 dark:text-neutral-400 group-hover:text-red-500 group-hover:bg-red-50 dark:group-hover:bg-red-500/20'
                                            }`}>
                                            {service.icon}
                                        </div>
                                        <div className="font-bold text-neutral-900 dark:text-white text-sm">
                                            {service.label}
                                        </div>
                                        {selectedServices.includes(service.id) && (
                                            <div className="absolute top-3 right-3 text-red-500">
                                                <CheckCircle2 size={18} />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="flex justify-between items-center pt-6 border-t border-neutral-100 dark:border-slate-800">
                                <button onClick={() => setStep(1)} className="text-neutral-500 font-bold hover:text-neutral-900 dark:hover:text-white px-4 py-2">
                                    Back
                                </button>
                                <Button onClick={nextStep} disabled={selectedServices.length === 0} className="bg-neutral-900 hover:bg-red-600 dark:bg-white dark:text-neutral-900 dark:hover:bg-red-500 dark:hover:text-white px-8 py-6 rounded-xl text-lg font-bold transition-colors">
                                    Next Step <ArrowRight size={20} className="ml-2" />
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: Location */}
                    {step === 3 && (
                        <motion.div
                            key="location"
                            custom={1} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-2xl border border-neutral-100 dark:border-slate-800"
                        >
                            <div className="mb-10 text-center">
                                <h2 className="text-3xl font-black text-neutral-900 dark:text-white mb-3">Where is the event?</h2>
                                <p className="text-neutral-500 dark:text-neutral-400 font-medium text-lg">We'll show you the best vendors in your area.</p>
                            </div>

                            <div className="space-y-4 mb-10 max-w-md mx-auto">
                                <div className="p-4 bg-neutral-50 dark:bg-slate-800/50 rounded-2xl border border-neutral-200 dark:border-slate-700 flex items-center gap-4">
                                    <MapPin className="text-red-500" />
                                    <input
                                        type="text"
                                        placeholder="Search for your city..."
                                        className="bg-transparent border-none outline-none w-full font-bold text-neutral-900 dark:text-white placeholder:text-neutral-400"
                                        value={location}
                                        onChange={e => setLocation(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-wrap gap-2 pt-4">
                                    {CITIES.map(city => (
                                        <button
                                            key={city}
                                            onClick={() => setLocation(city)}
                                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${location === city
                                                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-md'
                                                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-slate-800 dark:text-neutral-300 dark:hover:bg-slate-700'
                                                }`}
                                        >
                                            {city}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-6 border-t border-neutral-100 dark:border-slate-800">
                                <button onClick={() => setStep(2)} className="text-neutral-500 font-bold hover:text-neutral-900 dark:hover:text-white px-4 py-2">
                                    Back
                                </button>
                                <Button onClick={handleComplete} disabled={!location || loading} className="bg-red-600 hover:bg-neutral-900 dark:bg-red-500 dark:hover:bg-white dark:hover:text-neutral-900 text-white px-8 py-6 rounded-xl text-lg font-bold shadow-lg shadow-red-500/20 transition-all">
                                    {loading ? 'Setting up...' : 'Go to Dashboard'} <ChevronRight size={20} className="ml-2" />
                                </Button>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
};

export default OnboardingFlow;
