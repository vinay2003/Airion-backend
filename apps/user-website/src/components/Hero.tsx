import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import SearchBar from './SearchBar';
import { useAuth } from '@shared/auth'; // ✅ added

const HERO_IMAGES = [
    "https://images.unsplash.com/photo-1773745060497-4cc1df774c72?w=2400&auto=format&fit=crop&q=95",
    "https://images.unsplash.com/photo-1542042161784-26ab9e041e89?w=2400&auto=format&fit=crop&q=100",
    "https://images.unsplash.com/photo-1616431629879-af0e95bf9f88?w=2400&auto=format&fit=crop&q=100",
    "https://images.unsplash.com/photo-1631857455684-a54a2f03665f?w=2400&auto=format&fit=crop&q=100",
    "https://images.unsplash.com/photo-1688437310162-8eef29fa74b4?w=2400&auto=format&fit=crop&q=100",
    "https://media.istockphoto.com/id/1443775278/photo/beautiful-indian-wedding-setup-with-stage-decorations-and-flowers.jpg?s=612x612&w=0&k=20&c=6XwAjR5pQjHN0VQHYZShdgMw5z-Q_tKTo40pRadWPnk=",
];

const HERO_CONTENT = [
    {
        title: <>Turn Your Dream <br className="hidden md:block" /> <span className="font-medium">Event Into Reality</span></>,
        description: "From intimate gatherings to grand celebrations — Ease2event connects you with India's finest venues and vendors.",
        authTitle: <>Your Event Dashboard <br className="hidden md:block" /> <span className="font-medium">is Waiting for You</span></>,
        authDescription: "Synchronize your bookings, track mission progress, and bridge with elite vendor nodes."
    },
    {
        title: <>Discover Elite <br className="hidden md:block" /> <span className="font-medium">Wedding Venues</span></>,
        description: "Find the perfect backdrop for your special day with our curated selection of premium wedding destinations.",
        authTitle: <>Manage Your Wedding <br className="hidden md:block" /> <span className="font-medium">Planning Portfolio</span></>,
        authDescription: "Review venue availability and manage your wedding timeline effortlessly."
    },
    {
        title: <>Corporate Excellence <br className="hidden md:block" /> <span className="font-medium">Redefined</span></>,
        description: "Elevate your business gatherings with professional settings and world-class hospitality services.",
        authTitle: <>Track Your Corporate <br className="hidden md:block" /> <span className="font-medium">Event Logistics</span></>,
        authDescription: "Real-time updates on your corporate bookings and vendor communications."
    },
    {
        title: <>Celebrations Made <br className="hidden md:block" /> <span className="font-medium">Effortless</span></>,
        description: "We handle the complexity so you can focus on making memories with your loved ones.",
        authTitle: <>Your Upcoming <br className="hidden md:block" /> <span className="font-medium">Celebration Milestones</span></>,
        authDescription: "Ensure every detail of your party is synchronized and ready for the big day."
    },
    {
        title: <>Elite Vendor <br className="hidden md:block" /> <span className="font-medium">Partnerships</span></>,
        description: "Direct access to top-tier catering, decor, and entertainment professionals across India.",
        authTitle: <>Direct Communication <br className="hidden md:block" /> <span className="font-medium">with Elite Vendors</span></>,
        authDescription: "Message your service providers directly through our integrated chat system."
    },
    {
        title: <>Experience Premium <br className="hidden md:block" /> <span className="font-medium">Event Management</span></>,
        description: "Join 10,000+ satisfied clients who trust Airion for their most important occasions.",
        authTitle: <>Unlock Your Full <br className="hidden md:block" /> <span className="font-medium">Planning Potential</span></>,
        authDescription: "Access exclusive tools and premium features designed for serious event planners."
    }
];

const SEARCH_TABS = ["All", "Venues", "Services", "Experiences"];

const Hero: React.FC = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth(); // ✅ added

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const activeCategory = searchParams.get('category') || 'all';

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
                        className="absolute inset-0 z-0"
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
                        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90" />
                    </motion.div>
                </AnimatePresence>

                {/* Content */}
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4">

                    <motion.div
                        initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="relative z-10 space-y-6 max-w-4xl"
                    >

                        {/* ✅ Welcome badge */}
                        {isAuthenticated && (
                            <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-xl border-2 border-white/30 px-8 py-3.5 rounded-full text-white text-lg font-normal shadow-2xl">
                                <div className="w-3.5 h-3.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.6)]"></div>

                                Welcome back,
                                <span className="text-xl md:text-2xl text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
                                    {user?.name.split(' ')[0]}
                                </span>
                                !
                            </div>
                        )}

                        {/* ✅ Dynamic Heading — MOBILE FIX: Responsive scale */}
                        <div className="text-[2.25rem] xs:text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.1] tracking-tighter">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentImageIndex}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {isAuthenticated ? (
                                        <h1 className="text-3xl md:text-5xl font-semibold text-white tracking-wide leading-tight font-serif drop-shadow-2xl">
                                            {HERO_CONTENT[currentImageIndex].authTitle}
                                        </h1>
                                    ) : (
                                        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-wide leading-tight font-serif drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
                                            {HERO_CONTENT[currentImageIndex].title}
                                        </h1>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* ✅ Dynamic Description */}
                        <div className="min-h-[3rem]">
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={currentImageIndex}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-base md:text-lg text-white max-w-2xl mx-auto font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] leading-relaxed"
                                >
                                    {isAuthenticated
                                        ? HERO_CONTENT[currentImageIndex].authDescription
                                        : HERO_CONTENT[currentImageIndex].description
                                    }
                                </motion.p>
                            </AnimatePresence>
                        </div>

                        {/* ✅ Trust Badges */}
                        {!isAuthenticated && (
                            <div className="flex flex-wrap justify-center items-center gap-5 md:gap-8 mt-6 bg-black/30 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/20 shadow-2xl">
                                <span className="flex items-center gap-2 text-white text-sm md:text-base font-semibold drop-shadow-md">
                                    <span className="text-yellow-400 text-lg">★</span> 4.9/5 · 8,200+ reviews
                                </span>
                                <span className="flex items-center gap-2 text-white text-sm md:text-base font-semibold drop-shadow-md">
                                    <span className="text-yellow-300 text-lg">⚡</span> Response within 2 hours
                                </span>
                                <span className="flex items-center gap-2 text-white text-sm md:text-base font-semibold drop-shadow-md">
                                    <span className="text-lg">🔒</span> 100% Secure Booking
                                </span>
                                <span className="flex items-center gap-2 text-white text-sm md:text-base font-semibold drop-shadow-md">
                                    <span className="text-green-400 text-lg">✓</span> Verified Vendors Only
                                </span>
                            </div>
                        )}
                        {/* ✅ CTA Button */}
                        {isAuthenticated && (
                            <Link
                                to="/dashboard"
                                className="inline-flex items-center gap-2 bg-red-600 hover:bg-black text-white px-8 py-3 rounded-full font-bold shadow-xl transition"
                            >
                                Go to Dashboard
                                <ArrowRight size={18} />
                            </Link>
                        )}

                    </motion.div>
                </div>

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

                    {/* Tabs - MOBILE FIX: Horizontal Scroll */}
                    <div className="filter-tabs flex flex-nowrap md:flex-wrap gap-2 mb-6 justify-start md:justify-center overflow-x-auto md:overflow-hidden whitespace-nowrap hide-scrollbar px-4 md:px-0">
                        {SEARCH_TABS.map((tab) => {
                            const tabId = tab === 'All' ? 'all' : tab.toLowerCase();
                            const isActive = activeCategory === tabId;

                            return (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={() => {
                                        // Simple navigation back to home with category
                                        const target = tabId === 'all' ? '/' : `/?category=${tabId}`;
                                        navigate(target);

                                        // Smooth scroll to results after a short delay to allow re-render
                                        setTimeout(() => {
                                            const el = document.getElementById('marketplace-results');
                                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }, 100);
                                    }}
                                    className={`text-xs md:text-sm px-6 py-2 rounded-full font-bold transition-all flex-shrink-0 ${isActive
                                        ? "bg-white text-black shadow-lg"
                                        : "bg-black/20 text-white hover:bg-black/30"
                                        }`}
                                >
                                    {tab}
                                </button>
                            );
                        })}
                    </div>

                    <SearchBar />
                </div>
            </motion.div>
        </div>
    );
};

export default Hero;
