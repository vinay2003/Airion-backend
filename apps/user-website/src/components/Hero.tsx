import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SearchBar from './SearchBar';
import { useAuth } from '@shared/auth'; // ✅ added

const HERO_IMAGES = [
    "https://images.unsplash.com/photo-1773745060497-4cc1df774c72?w=2400&auto=format&fit=crop&q=95",
    "https://images.unsplash.com/photo-1542042161784-26ab9e041e89?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1616431629879-af0e95bf9f88?w=2400&auto=format&fit=crop&q=100",
    "https://images.unsplash.com/photo-1631857455684-a54a2f03665f?w=2400&auto=format&fit=crop&q=100",
    "https://images.unsplash.com/photo-1688437310162-8eef29fa74b4?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=2400&auto=format&fit=crop&q=95",
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

            {/* Hero Container */}
            <div className="relative w-full h-[600px] md:h-[750px] overflow-hidden shadow-lg bg-gray-900">

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
                        className="space-y-6 max-w-4xl"
                    >

                        {/* ✅ Welcome badge */}
                        {isAuthenticated && (
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-white text-xs font-bold shadow-xl">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                Welcome back, {user?.name.split(' ')[0]}!
                            </div>
                        )}

                        {/* ✅ Dynamic Heading */}
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-tight">
                            {isAuthenticated ? (
                                <>
                                    Your Event Dashboard <br />
                                    <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent italic">
                                        is Waiting for You
                                    </span>
                                </>
                            ) : (
                                <>
                                    Create Unforgettable <br className="hidden md:block" />
                                    <span className="bg-gradient-to-r from-red-700 via-red-500 to-orange-600 bg-clip-text text-transparent italic">
                                        Moments
                                    </span>
                                    With Airion
                                </>
                            )}
                        </h1>

                        {/* ✅ Dynamic Description */}
                        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                            {isAuthenticated
                                ? "Manage your bookings, track event progress, and connect with vendors easily."
                                : "Discover the world's best venues and services for weddings, parties, and corporate events."
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

                    {/* Tabs */}
                    <div className="flex flex-wrap gap-2 mb-6 justify-center">
                        {SEARCH_TABS.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`text-xs md:text-sm px-4 py-1.5 rounded-full font-bold ${activeTab === tab
                                        ? "bg-white text-black"
                                        : "bg-black/20 text-white"
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