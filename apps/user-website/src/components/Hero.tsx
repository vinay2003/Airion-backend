import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Star, Users, CheckCircle } from 'lucide-react';
import SearchBar from './SearchBar';
import { useAuth } from '@shared/auth';

const HERO_IMAGES = [
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1920&q=80",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1920&auto=format&fit=crop"
];

const SEARCH_TABS = ["All", "Venues", "Services", "Experiences"];

const Hero: React.FC = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [activeTab, setActiveTab] = useState("All");
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full">
            {/* Hero Container - Full Width and Edge-To-Edge */}
            <div className="relative w-full h-[600px] md:h-[750px] overflow-hidden shadow-lg bg-gray-900 border-none">

                {/* Carousel Background */}
                <AnimatePresence>
                    <motion.div
                        key={currentImageIndex}
                        className="absolute inset-0 z-0"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    >
                        <img
                            src={HERO_IMAGES[currentImageIndex]}
                            alt="Event celebration"
                            className="w-full h-full object-cover"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60 transition-opacity"></div>
                    </motion.div>
                </AnimatePresence>

                {/* Content Overlay */}
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 pt-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6 max-w-4xl pt-8 md:pt-16"
                    >
                        {isAuthenticated && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-white text-xs font-bold mb-2 shadow-xl"
                            >
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                Welcome back, {user?.name.split(' ')[0]}!
                            </motion.div>
                        )}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight drop-shadow-lg leading-tight">
                            {isAuthenticated ? 'Your Event Dashboard is' : 'Find the Perfect Vendor for Your'} <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 font-cursive pr-2">
                                {isAuthenticated ? 'Waitng for You' : 'Dream Event'}
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-light leading-relaxed">
                            {isAuthenticated
                                ? 'Manage your bookings, view messages, and track event progress seamlessly.'
                                : 'Browse thousands of verified event vendors across India'}
                        </p>

                        {isAuthenticated && (
                            <Link to="/dashboard" className="inline-flex items-center gap-2 bg-red-600 hover:bg-neutral-900 transition-all text-white px-8 py-3.5 rounded-full font-bold shadow-xl active:scale-95 group">
                                Go to My Dashboard
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        )}
                    </motion.div>
                </div>

                {/* Stats Ticker */}
                <div className="absolute bottom-16 left-0 right-0 z-20 flex justify-center w-full px-4 mb-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-white/90 text-xs sm:text-sm font-medium shadow-xl"
                    >
                        <div className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400" /><span className="font-bold text-white text-sm sm:text-base">600+</span> Events Listed</div>
                        <div className="hidden sm:block text-white/30">•</div>
                        <div className="flex items-center gap-2"><Users size={16} className="text-blue-400" /><span className="font-bold text-white text-sm sm:text-base">1,789+</span> Happy Users</div>
                        <div className="hidden sm:block text-white/30">•</div>
                        <div className="flex items-center gap-2"><Star size={16} className="text-yellow-400" /><span className="font-bold text-white text-sm sm:text-base">4.9/5</span> Avg. Rating</div>
                    </motion.div>
                </div>

                {/* Carousel Indicators */}
                <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-3">
                    {HERO_IMAGES.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60"}`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Floating Search Bar - Highly Interactive */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative z-30 -mt-12 md:-mt-24 max-w-5xl mx-auto px-4"
                onMouseEnter={() => setIsSearchFocused(true)}
                onMouseLeave={() => setIsSearchFocused(false)}
            >
                <div className={`transition-transform duration-500 ease-out ${isSearchFocused ? "scale-[1.02]" : ""}`}>
                    {/* Tabs */}
                    <div className="flex gap-2 mb-4 px-6 justify-center md:justify-start">
                        {SEARCH_TABS.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`text-sm font-bold px-4 py-1.5 rounded-full transition-all duration-300 backdrop-blur-md ${activeTab === tab ? "bg-white text-gray-900 shadow-md" : "bg-black/20 text-white hover:bg-black/30"}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <SearchBar />
                </div>
            </motion.div>
        </div>
    );
};

export default Hero;
