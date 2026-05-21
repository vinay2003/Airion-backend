import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import SearchBar from './SearchBar';
import { useAuth } from '@shared/auth';

const HERO_IMAGES = [
    "https://images.unsplash.com/photo-1773745060497-4cc1df774c72?w=2400&auto=format&fit=crop&q=95",
    "https://images.unsplash.com/photo-1542042161784-26ab9e041e89?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1616431629879-af0e95bf9f88?w=2400&auto=format&fit=crop&q=100",
    "https://images.unsplash.com/photo-1631857455684-a54a2f03665f?w=2400&auto=format&fit=crop&q=100",
    "https://images.unsplash.com/photo-1688437310162-8eef29fa74b4?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=2400&auto=format&fit=crop&q=95",
];

const HERO_CONTENT = [
    {
        category: "BIRTHDAY CELEBRATIONS",
        title: <>Make Every <span className="italic font-normal">Year</span> a Grand Celebration</>,
        description: "Milestone birthdays deserve unforgettable moments. We design themed parties, surprise events, and luxury gatherings that reflect your personality in every detail.",
    },
    {
        category: "FESTIVALS & CULTURAL EVENTS",
        title: <>Honour Your <span className="italic font-normal">Culture</span> in Grand Style</>,
        description: "Diwali nights, Eid celebrations, Holi festivals, cultural galas — we produce large-scale events that honour tradition while creating spectacular modern experiences.",
    },
    {
        category: "WEDDING CEREMONIES",
        title: <>Your Perfect <span className="italic font-normal">Love Story</span> Begins Here</>,
        description: "From intimate garden ceremonies to grand ballroom celebrations, we craft every detail of your wedding day with precision, elegance, and heartfelt care.",
    },
    {
        category: "CORPORATE EVENTS",
        title: <>Elevate Your <span className="italic font-normal">Brand</span> Through Exceptional Events</>,
        description: "From product launches and conferences to annual galas, we produce corporate experiences that leave lasting impressions on clients, teams, and stakeholders.",
    },
    {
        category: "BABY SHOWERS & NAMING CEREMONIES",
        title: <>Welcome the <span className="italic font-normal">Newest</span> Little Star</>,
        description: "Celebrate new beginnings with warmth and wonder. Our team creates dreamy baby showers and naming ceremonies filled with joy, colour, and cherished memories.",
    }
];

const Hero: React.FC = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    useEffect(() => {
        HERO_IMAGES.forEach((src) => {
            const img = new Image();
            img.src = src;
        });

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Get dynamic content for slides 1-5
    const dynamicContent = currentImageIndex > 0 ? HERO_CONTENT[currentImageIndex - 1] : null;

    return (
        <div className="relative w-full">
            {/* ✅ India's #1 Premium Event Platform badge - Positioned just below header */}
            {!isAuthenticated && (
                <div className="absolute top-4 left-0 right-0 z-40 flex justify-center pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="bg-yellow-400/10 backdrop-blur-md border border-yellow-500/20 px-5 py-2 rounded-full overflow-hidden relative pointer-events-auto shadow-sm"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer" />
                        <span className="relative text-yellow-100 text-xs md:text-sm font-bold uppercase tracking-widest flex items-center gap-3">
                            <Sparkles size={14} className="text-yellow-500 animate-pulse" />
                            India's #1 Premium Event Platform
                            <Sparkles size={14} className="text-yellow-500 animate-pulse" />
                        </span>
                    </motion.div>
                </div>
            )}

            {/* Hero Container - MOBILE FIX: Ensure visibility under fixed navbar */}
            <div className="hero-section relative w-full h-[600px] md:h-[750px] overflow-hidden shadow-lg bg-gray-900 pt-[72px] md:pt-0 min-h-[100svh] md:min-h-0">

                {/* Carousel */}
                <AnimatePresence>
                    <motion.div
                        key={currentImageIndex}
                        className="absolute inset-0"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5 }}
                    >
                        <img
                            src={HERO_IMAGES[currentImageIndex]}
                            className="w-full h-full object-cover"
                            alt="event"
                            fetchPriority="high"
                            decoding="async"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />
                    </motion.div>
                </AnimatePresence>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentImageIndex}
                            initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -40, filter: 'blur(10px)' }}
                            transition={{ duration: 1 }}
                            className="relative z-10 space-y-6 max-w-5xl"
                        >

                            {dynamicContent ? (
                                <div className="flex flex-col items-center space-y-6">
                                    {/* Category with line */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="flex items-center gap-4 mb-2"
                                    >
                                        <div className="w-12 h-[1px] bg-white/50" />
                                        <span className="text-xs md:text-sm font-bold uppercase tracking-[0.4em] text-neutral-100">
                                            {dynamicContent.category}
                                        </span>
                                        <div className="w-12 h-[1px] bg-white/50" />

                                    </motion.div>

                                    {/* Premium Title */}
                                    <h1 className="text-4xl md:text-6xl font-bold text-neutral-100 leading-[1.1] tracking-tight font-serif drop-shadow-[0_10px_50px_rgba(0,0,0,1)]">
                                        {dynamicContent.title}
                                    </h1>

                                    {/* Subtitle */}
                                    <p className="text-base md:text-xl text-neutral-100 max-w-2xl mx-auto font-semibold drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] leading-relaxed pb-4">
                                        {dynamicContent.description}
                                    </p>

                                    {/* ✅ Trust Badges */}
                                    <div className="flex flex-wrap justify-center items-center gap-5 md:gap-8 mt-2">
                                        <span className="flex items-center gap-2 text-neutral-100 text-sm md:text-base font-bold drop-shadow">
                                            <span className="text-yellow-400">★</span> 4.9/5 · 8,200+ reviews
                                        </span>
                                        <span className="flex items-center gap-2 text-neutral-100 text-sm md:text-base font-bold drop-shadow">
                                            <span className="text-yellow-300">⚡</span> Response within 2 hours
                                        </span>
                                        <span className="flex items-center gap-2 text-neutral-100 text-sm md:text-base font-bold drop-shadow">
                                            <span>🔒</span> 100% Secure Booking
                                        </span>
                                        <span className="flex items-center gap-2 text-neutral-100 text-sm md:text-base font-bold drop-shadow">
                                            <span className="text-green-400">✓</span> Verified Vendors Only
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* ✅ Welcome badge for Slide 0 */}
                                    {isAuthenticated && (
                                        <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-xl border-2 border-white/30 px-8 py-3.5 rounded-full text-neutral-100 text-lg font-normal shadow-2xl mb-6">
                                            <div className="w-3.5 h-3.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.6)]"></div>
                                            Welcome back,
                                            <span className="text-xl md:text-2xl text-neutral-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
                                                {user?.name.split(' ')[0]}
                                            </span>
                                            !
                                        </div>
                                    )}

                                    <div className="text-[2.25rem] xs:text-4xl sm:text-5xl md:text-6xl font-black text-neutral-100 leading-[1.1] drop-shadow-[0_10px_50px_rgba(0,0,0,1)] tracking-tighter">
                                        {isAuthenticated ? (
                                            <h1 className="text-3xl md:text-5xl font-semibold text-neutral-100 tracking-wide leading-tight font-serif">
                                                Your Event Dashboard <br className="hidden md:block" />
                                                <span className="font-medium">
                                                    is Waiting for You
                                                </span>
                                            </h1>
                                        ) : (
                                            <h1 className="text-4xl md:text-5xl font-bold text-neutral-100 tracking-wide leading-tight font-serif">
                                                Turn Your Dream <br className="hidden md:block" />
                                                <span className="font-bold">
                                                    Event Into Reality
                                                </span>
                                            </h1>
                                        )}
                                    </div>

                                    <p className="text-base md:text-lg text-neutral-100 max-w-2xl mx-auto font-semibold drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] leading-relaxed">
                                        {isAuthenticated
                                            ? "Synchronize your bookings, track mission progress, and bridge with elite vendor nodes."
                                            : "From intimate gatherings to grand celebrations — Ease2event connects you with India's finest venues, vendors, and planners. 10,000+ events"
                                        }
                                    </p>

                                    {/* ✅ Trust Badges */}
                                    <div className="flex flex-wrap justify-center items-center gap-5 md:gap-8 mt-4">
                                        <span className="flex items-center gap-2 text-neutral-100 text-sm md:text-base font-bold drop-shadow">
                                            <span className="text-yellow-400">★</span> 4.9/5 · 8,200+ reviews
                                        </span>
                                        <span className="flex items-center gap-2 text-neutral-100 text-sm md:text-base font-bold drop-shadow">
                                            <span className="text-yellow-300">⚡</span> Response within 2 hours
                                        </span>
                                        <span className="flex items-center gap-2 text-neutral-100 text-sm md:text-base font-bold drop-shadow">
                                            <span>🔒</span> 100% Secure Booking
                                        </span>
                                        <span className="flex items-center gap-2 text-neutral-100 text-sm md:text-base font-bold drop-shadow">
                                            <span className="text-green-400">✓</span> Verified Vendors Only
                                        </span>
                                    </div>
                                </>
                            )}

                        </motion.div>
                    </AnimatePresence>
                </div>


                {/* Indicators */}

                {/* Indicators */}
                <div className="absolute bottom-8 left-0 right-0 hidden md:flex justify-center gap-3">
                    {HERO_IMAGES.map((_, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`h-1.5 rounded-full ${idx === currentImageIndex
                                ? "w-8 bg-white"
                                : "w-2 bg-white/40"
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Search Section */}
            <motion.div
                className="relative z-30 -mt-12 md:-mt-40 max-w-5xl mx-auto px-4"
                onMouseEnter={() => setIsSearchFocused(true)}
                onMouseLeave={() => setIsSearchFocused(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className={`transition ${isSearchFocused ? "scale-[1.02]" : ""}`}>



                    <SearchBar />
                </div>
            </motion.div>
        </div>
    );
};

export default Hero;
