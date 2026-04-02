import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, UserCircle2, Search, Calendar, Star, Heart } from 'lucide-react';

const SLIDES = [
    {
        icon: Search,
        iconBg: 'bg-blue-500',
        title: 'Discover Trusted Vendors',
        description: 'Browse thousands of verified photographers, caterers, decorators, and venues near you.',
        gradient: 'from-blue-600/20 via-blue-500/5 to-transparent',
        accent: 'bg-blue-500',
    },
    {
        icon: Star,
        iconBg: 'bg-amber-500',
        title: 'Compare by Budget & Occasion',
        description: 'Filter by price, rating, and event type to find the perfect match for your celebration.',
        gradient: 'from-amber-600/20 via-amber-500/5 to-transparent',
        accent: 'bg-amber-500',
    },
    {
        icon: Calendar,
        iconBg: 'bg-green-500',
        title: 'Book with Ease',
        description: "Select your date from the vendor's live calendar. Pay securely with EMI options available.",
        gradient: 'from-green-600/20 via-green-500/5 to-transparent',
        accent: 'bg-green-500',
    },
    {
        icon: Heart,
        iconBg: 'bg-red-500',
        title: 'Save & Manage Your Events',
        description: 'Wishlist your favourites, track bookings, and manage your entire event from one dashboard.',
        gradient: 'from-red-600/20 via-red-500/5 to-transparent',
        accent: 'bg-red-500',
    },
];

// Simple SVG illustrations for each slide
const Illustrations: React.FC<{ index: number }> = ({ index }) => {
    const colors = [
        ['#3b82f6', '#bfdbfe'],
        ['#f59e0b', '#fde68a'],
        ['#22c55e', '#bbf7d0'],
        ['#ef4444', '#fecaca'],
    ];
    const [primary, light] = colors[index];

    return (
        <svg viewBox="0 0 280 200" className="w-full max-w-[280px] h-[160px]" aria-hidden>
            {/* Background circle */}
            <circle cx="140" cy="100" r="90" fill={light} opacity="0.4" />

            {index === 0 && (
                <g>
                    {/* Search illustration */}
                    <rect x="60" y="70" width="160" height="60" rx="12" fill="white" stroke={primary} strokeWidth="2" />
                    <circle cx="90" cy="100" r="12" fill={light} stroke={primary} strokeWidth="2" />
                    <rect x="110" y="92" width="80" height="8" rx="4" fill={light} />
                    <rect x="110" y="106" width="50" height="6" rx="3" fill="#e5e7eb" />
                    <circle cx="210" cy="100" r="10" fill={primary} opacity="0.8" />
                    <line x1="216" y1="106" x2="224" y2="114" stroke={primary} strokeWidth="3" strokeLinecap="round" />
                    {/* Star badges */}
                    <circle cx="100" cy="155" r="18" fill={primary} opacity="0.1" />
                    <text x="100" y="160" textAnchor="middle" fontSize="16">⭐</text>
                    <circle cx="180" cy="50" r="14" fill={primary} opacity="0.1" />
                    <text x="180" y="55" textAnchor="middle" fontSize="12">📍</text>
                </g>
            )}

            {index === 1 && (
                <g>
                    {/* Compare cards */}
                    <rect x="50" y="60" width="80" height="100" rx="12" fill="white" stroke={primary} strokeWidth="2" />
                    <rect x="150" y="60" width="80" height="100" rx="12" fill={primary} opacity="0.9" />
                    <rect x="62" y="80" width="56" height="6" rx="3" fill={light} />
                    <rect x="62" y="94" width="40" height="6" rx="3" fill="#e5e7eb" />
                    <text x="90" y="140" textAnchor="middle" fontSize="24">💰</text>
                    <text x="190" y="140" textAnchor="middle" fontSize="24">⭐</text>
                    <rect x="162" y="80" width="56" height="6" rx="3" fill="white" opacity="0.6" />
                    <rect x="162" y="94" width="40" height="6" rx="3" fill="white" opacity="0.4" />
                </g>
            )}

            {index === 2 && (
                <g>
                    {/* Calendar */}
                    <rect x="60" y="50" width="160" height="120" rx="14" fill="white" stroke={primary} strokeWidth="2" />
                    <rect x="60" y="50" width="160" height="36" rx="14" fill={primary} />
                    <rect x="60" y="72" width="160" height="14" rx="0" fill={primary} />
                    <text x="140" y="74" textAnchor="middle" fontSize="13" fill="white" fontWeight="bold">April 2026</text>
                    {[0,1,2,3,4,5,6].map((d, i) => (
                        <rect key={i} x={72 + i*20} y="104" width="14" height="14" rx="4" fill={i === 3 ? primary : light} opacity="0.7" />
                    ))}
                    {[0,1,2,3,4,5,6].map((d, i) => (
                        <rect key={i} x={72 + i*20} y="124" width="14" height="14" rx="4" fill={i === 1 || i === 5 ? '#e5e7eb' : light} opacity="0.4" />
                    ))}
                    <text x="140" y="165" textAnchor="middle" fontSize="11" fill={primary} fontWeight="600">✓ Available</text>
                </g>
            )}

            {index === 3 && (
                <g>
                    {/* Dashboard */}
                    <rect x="50" y="55" width="180" height="110" rx="14" fill="white" stroke={primary} strokeWidth="2" />
                    <rect x="50" y="55" width="180" height="32" rx="14" fill={primary} />
                    <rect x="50" y="73" width="180" height="14" rx="0" fill={primary} />
                    <circle cx="70" cy="71" r="7" fill="white" opacity="0.3" />
                    <text x="140" y="74" textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">My Dashboard</text>
                    <rect x="64" y="96" width="70" height="36" rx="8" fill={light} />
                    <rect x="146" y="96" width="70" height="36" rx="8" fill={light} />
                    <text x="99" y="118" textAnchor="middle" fontSize="16">📋</text>
                    <text x="181" y="118" textAnchor="middle" fontSize="16">❤️</text>
                    <rect x="64" y="140" width="152" height="10" rx="5" fill={light} opacity="0.6" />
                </g>
            )}
        </svg>
    );
};

const Onboarding: React.FC = () => {
    const navigate = useNavigate();
    const [current, setCurrent] = useState(0);
    const slide = SLIDES[current];

    const goNext = () => {
        if (current < SLIDES.length - 1) setCurrent(current + 1);
        else navigate('/');
    };

    const goBack = () => {
        if (current > 0) setCurrent(current - 1);
    };

    return (
        <div className="min-h-screen bg-neutral-950 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-12 pb-4">
                <button
                    onClick={goBack}
                    className={`p-2 rounded-full hover:bg-white/10 transition ${current === 0 ? 'invisible' : ''}`}
                >
                    <ChevronLeft size={24} className="text-neutral-400" />
                </button>

                <div className="flex gap-2">
                    {SLIDES.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-red-500' : 'w-2 bg-white/20'}`}
                        />
                    ))}
                </div>

                <button
                    onClick={() => navigate('/')}
                    className="text-sm font-medium text-neutral-500 hover:text-white transition py-2 px-3"
                >
                    Skip
                </button>
            </div>

            {/* Slide Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        className="flex flex-col items-center text-center max-w-sm mx-auto w-full"
                    >
                        {/* Gradient bg */}
                        <div className={`absolute inset-0 bg-gradient-to-b ${slide.gradient} pointer-events-none opacity-60`} />

                        {/* Illustration */}
                        <div className="relative w-full flex justify-center mb-8">
                            <div className="relative">
                                <Illustrations index={current} />
                                {/* Icon badge */}
                                <motion.div
                                    animate={{ y: [-4, 4, -4] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                    className={`absolute -bottom-3 -right-3 w-12 h-12 ${slide.iconBg} rounded-2xl flex items-center justify-center shadow-2xl`}
                                >
                                    <slide.icon size={22} className="text-white" />
                                </motion.div>
                            </div>
                        </div>

                        {/* Text */}
                        <h2
                            className="text-3xl font-extrabold text-white mb-4 leading-tight"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            {slide.title}
                        </h2>
                        <p className="text-neutral-400 text-base leading-relaxed font-medium max-w-[280px]">
                            {slide.description}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer Actions */}
            <div className="px-6 pb-12 space-y-3 max-w-sm mx-auto w-full">
                {current === SLIDES.length - 1 ? (
                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate('/')}
                        className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-xl shadow-red-500/30 transition-all"
                    >
                        Start Exploring <ArrowRight size={18} />
                    </motion.button>
                ) : (
                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={goNext}
                        className="w-full bg-white text-neutral-900 py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-xl transition-all"
                    >
                        Next <ArrowRight size={18} />
                    </motion.button>
                )}

                <button
                    onClick={() => navigate('/')}
                    className="w-full py-3 text-sm font-medium text-neutral-600 hover:text-neutral-400 flex items-center justify-center gap-2 transition-colors"
                >
                    <UserCircle2 size={16} />
                    Continue as Guest
                </button>
            </div>
        </div>
    );
};

export default Onboarding;
