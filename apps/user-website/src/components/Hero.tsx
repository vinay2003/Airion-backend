import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SearchBar from './SearchBar';
import { useAuth } from '@shared/auth'; // ✅ added

const HERO_IMAGES = [
    "https://images.unsplash.com/photo-1773745060497-4cc1df774c72?w=1600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1542042161784-26ab9e041e89?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1616431629879-af0e95bf9f88?w=1600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1631857455684-a54a2f03665f?w=1600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1688437310162-8eef29fa74b4?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1600&auto=format&fit=crop&q=80",
];

const SEARCH_TABS = ["All", "Venues", "Services", "Experiences"];

const Hero: React.FC = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth(); // ✅ added

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [activeTab, setActiveTab] = useState("All");
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
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
                    </motion.div>
                </AnimatePresence>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">

                    <motion.div
                        initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="relative z-10 space-y-6 max-w-4xl"
                    >

                        {/* ✅ Welcome badge */}
                        {isAuthenticated && (
                            <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-xl border-2 border-white/30 px-8 py-3.5 rounded-full text-white text-lg font-black shadow-2xl">
                                <div className="w-3.5 h-3.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.6)]"></div>

                                Welcome back,
                                <span className="text-xl md:text-2xl text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
                                    {user?.name.split(' ')[0]}
                                </span>
                                !
                            </div>
                        )}

                        {/* ✅ Dynamic Heading — MOBILE FIX: Responsive scale */}
                        <h1 className="text-[2.25rem] xs:text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.1] drop-shadow-[0_10px_50px_rgba(0,0,0,1)] tracking-tighter">
                            {isAuthenticated ? (
                                <>
                                    Your Event Dashboard <br className="hidden md:block" />
                                    <span className="bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-clip-text text-transparent italic px-2">
                                        is Waiting for You
                                    </span>
                                </>
                            ) : (
                                <>
                                    Create Unforgettable <br className="hidden md:block" />
                                    <span>
                                        Moments
                                    </span>
                                    {" "}With Ease2event
                                </>
                            )}
                        </h1>

                        {/* ✅ Dynamic Description */}
                        <p className="text-base md:text-lg text-white/95 max-w-2xl mx-auto font-bold drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] leading-relaxed">
                            {isAuthenticated
                                ? "Synchronize your bookings, track mission progress, and bridge with elite vendor nodes."
                                : "Discover the world's most exclusive venues and services for weddings, parties, and corporate galas."
                            }
                        </p>

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
                        {SEARCH_TABS.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`text-xs md:text-sm px-6 py-2 rounded-full font-bold transition-all flex-shrink-0 ${activeTab === tab
                                    ? "bg-white text-black shadow-lg"
                                    : "bg-black/20 text-white hover:bg-black/30"
                                    }`}
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
