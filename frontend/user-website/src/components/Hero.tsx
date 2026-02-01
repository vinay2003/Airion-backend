import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SearchBar from './SearchBar';

const HERO_IMAGES = [
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1920&q=80",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1920&auto=format&fit=crop"
];

const SEARCH_TABS = ["All", "Venues", "Services", "Experiences"];

const Hero: React.FC = () => {
    const navigate = useNavigate();
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
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Hero Container - Contained and Rounded */}
            <div className="relative w-full h-[550px] md:h-[650px] rounded-[2.5rem] overflow-hidden shadow-2xl group border border-gray-100 dark:border-slate-800 bg-gray-900">
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
                        className="space-y-6 max-w-4xl"
                    >
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-tight drop-shadow-lg leading-tight">
                            Create Unforgettable <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 font-cursive pr-2">
                                Moments
                            </span>
                            With Airion
                        </h1>
                        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-light leading-relaxed">
                            Discover the world's best venues and services for weddings, parties, and corporate events.
                        </p>
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
                className="relative z-30 -mt-24 max-w-5xl mx-auto px-4"
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
