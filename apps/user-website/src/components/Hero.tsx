import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ArrowRight, Sparkles, Volume2, VolumeX } from 'lucide-react';
import SearchBar from './SearchBar';
import { useAuth } from '@shared/auth'; // ✅ added

const HERO_IMAGES = [
    "https://images.unsplash.com/photo-1773745060497-4cc1df774c72?w=2560&auto=format&fit=crop&q=100",
    "https://images.unsplash.com/photo-1505932794465-147d1f1b2c97?w=2560&auto=format&fit=crop&q=100",
    "https://images.unsplash.com/photo-1616431629879-af0e95bf9f88?w=2560&auto=format&fit=crop&q=100",
    "https://images.unsplash.com/photo-1631857455684-a54a2f03665f?w=2560&auto=format&fit=crop&q=100",
    "https://images.unsplash.com/photo-1559563040-f2fc7416b7bb?w=2560&auto=format&fit=crop&q=100",
    "https://images.unsplash.com/photo-1601482441062-b9f13131f33a?w=2560&auto=format&fit=crop&q=100",
];

// Append clone of first slide → enables seamless infinite forward loop
const LOOP_IMAGES = [...HERO_IMAGES, HERO_IMAGES[0]];

const HERO_CONTENT = [
    {
        title: <>Turn Your Dream <br className="hidden md:block" /> <span className="font-medium">Event Into Reality</span></>,
        description: "From intimate gatherings to grand celebrations — Ease2event connects you with India's finest venues and vendors.",
        authTitle: <>Your Event Dashboard <br className="hidden md:block" /> <span className="font-medium">is Waiting for You</span></>,
        authDescription: "Synchronize your bookings, track mission progress, and bridge with elite vendor nodes.",
        badge: { icon: "★", text: "4.9/5 · 8,200+ reviews", color: "text-yellow-400" }
    },
    {
        title: <>Discover Elite <br className="hidden md:block" /> <span className="font-medium">Wedding Venues</span></>,
        description: "Find the perfect backdrop for your special day with our curated selection of premium wedding destinations.",
        authTitle: <>Manage Your Wedding <br className="hidden md:block" /> <span className="font-medium">Planning Portfolio</span></>,
        authDescription: "Review venue availability and manage your wedding timeline effortlessly.",
        badge: { icon: "⚡", text: "Response within 2 hours", color: "text-yellow-300" }
    },
    {
        title: <>Corporate Excellence <br className="hidden md:block" /> <span className="font-medium">Redefined</span></>,
        description: "Elevate your business gatherings with professional settings and world-class hospitality services.",
        authTitle: <>Track Your Corporate <br className="hidden md:block" /> <span className="font-medium">Event Logistics</span></>,
        authDescription: "Real-time updates on your corporate bookings and vendor communications.",
        badge: { icon: "🔒", text: "100% Secure Booking", color: "text-blue-400" }
    },
    {
        title: <>Celebrations Made <br className="hidden md:block" /> <span className="font-medium">Effortless</span></>,
        description: "We handle the complexity so you can focus on making memories with your loved ones.",
        authTitle: <>Your Upcoming <br className="hidden md:block" /> <span className="font-medium">Celebration Milestones</span></>,
        authDescription: "Ensure every detail of your party is synchronized and ready for the big day.",
        badge: { icon: "✓", text: "Verified Vendors Only", color: "text-green-400" }
    },
    {
        title: <>Elite Vendor <br className="hidden md:block" /> <span className="font-medium">Partnerships</span></>,
        description: "Direct access to top-tier catering, decor, and entertainment professionals across India.",
        authTitle: <>Direct Communication <br className="hidden md:block" /> <span className="font-medium">with Elite Vendors</span></>,
        authDescription: "Message your service providers directly through our integrated chat system.",
        badge: { icon: "🔥", text: "Trending Creative Platform", color: "text-orange-500" }
    },
    {
        title: <>Experience Premium <br className="hidden md:block" /> <span className="font-medium">Event Management</span></>,
        description: "Join 10,000+ satisfied clients who trust Airion for their most important occasions.",
        authTitle: <>Unlock Your Full <br className="hidden md:block" /> <span className="font-medium">Planning Potential</span></>,
        authDescription: "Access exclusive tools and premium features designed for serious event planners.",
        badge: { icon: "🤝", text: "Connect with Industry Experts", color: "text-blue-400" }
    }
];

const SEARCH_TABS = ["All", "Venues", "Services", "Experiences"];

const Hero: React.FC = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const activeCategory = searchParams.get('category') || 'all';

    const [stripIndex, setStripIndex] = useState(0);
    const [disableTransition, setDisableTransition] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
        const saved = localStorage.getItem('hero_sound_enabled');
        return saved === null ? true : saved === 'true';
    });

    // ── Audio refs ──
    const audioRef          = useRef<HTMLAudioElement | null>(null);
    const isSoundEnabledRef = useRef(isSoundEnabled); // always-current mirror
    const isHeroVisibleRef  = useRef(true);           // false when user scrolls away
    const heroRef           = useRef<HTMLDivElement>(null);

    const updateMusicPlayback = () => {
        const audio = audioRef.current;
        if (!audio) return;

        const shouldPlay = isSoundEnabledRef.current && isHeroVisibleRef.current;

        if (shouldPlay) {
            // Browsers need a user interaction to play
            audio.play().catch(e => console.log('Autoplay blocked, waiting for interaction...'));
        } else {
            audio.pause();
        }
    };

    // Persist preference
    useEffect(() => {
        isSoundEnabledRef.current = isSoundEnabled;
        localStorage.setItem('hero_sound_enabled', String(isSoundEnabled));
        updateMusicPlayback();
    }, [isSoundEnabled]);

    // Track hero visibility
    useEffect(() => {
        const el = heroRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { 
                isHeroVisibleRef.current = entry.isIntersecting; 
                updateMusicPlayback(); 
            },
            { threshold: 0.01 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    // ── Synthesized fallback (not used now but kept for consistency) ──
    const playSynthWhoosh = () => {};

    // Preload audio and handle initial interaction
    useEffect(() => {
        const unlock = () => {
            updateMusicPlayback();
            // Remove listeners once unlocked
            document.removeEventListener('click', unlock);
            document.removeEventListener('scroll', unlock);
            document.removeEventListener('touchstart', unlock);
        };
        document.addEventListener('click', unlock);
        document.addEventListener('scroll', unlock);
        document.addEventListener('touchstart', unlock);
        return () => {
            document.removeEventListener('click', unlock);
            document.removeEventListener('scroll', unlock);
            document.removeEventListener('touchstart', unlock);
        };
    }, []);

    // Central slide sound (deprecated)
    const playSlideSound = () => {};

    // Removed AudioContext effect hook


    // Real index for content & dots — wraps clone (index 6) back to 0
    const displayIndex = stripIndex % HERO_IMAGES.length;

    // Auto-advance every 6s
    useEffect(() => {
        const interval = setInterval(() => {
            setStripIndex(prev => prev + 1);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    // Play slide sound on every slide change (skip very first render)
    useEffect(() => {
        if (stripIndex > 0) playSlideSound();
    }, [stripIndex]);

    // When we land on the clone, snap silently back to real index 0
    useEffect(() => {
        if (stripIndex === LOOP_IMAGES.length - 1) {
            const timer = setTimeout(() => {
                setDisableTransition(true);
                setStripIndex(0);
            }, 1250); // just after 1.2s CSS transition finishes
            return () => clearTimeout(timer);
        }
    }, [stripIndex]);

    // Re-enable transition after the instant snap has rendered
    useEffect(() => {
        if (disableTransition) {
            const raf = requestAnimationFrame(() =>
                requestAnimationFrame(() => setDisableTransition(false))
            );
            return () => cancelAnimationFrame(raf);
        }
    }, [disableTransition]);

    const goToSlide = (idx: number) => setStripIndex(idx);

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

            <audio
                ref={audioRef}
                src="https://cdn.pixabay.com/audio/2026/05/04/audio_5d1473f51a.mp3"
                loop
                preload="auto"
                playsInline
                onEnded={(e) => {
                    e.currentTarget.currentTime = 0;
                    e.currentTarget.play();
                }}
            />

            {/* Hero Container - MOBILE FIX: Ensure visibility under fixed navbar */}
            <div ref={heroRef} className="hero-section relative w-full h-[450px] md:h-[550px] overflow-hidden shadow-lg bg-gray-900 pt-[72px] md:pt-0 min-h-0">

                {/* ── FILMSTRIP (with clone at end for seamless infinite loop) ── */}
                <div
                    className="absolute inset-0 flex"
                    style={{
                        width: `${LOOP_IMAGES.length * 100}%`,
                        transform: `translateX(-${stripIndex * (100 / LOOP_IMAGES.length)}%)`,
                        transition: disableTransition ? 'none' : 'transform 1.2s cubic-bezier(0.65, 0, 0.35, 1)',
                        willChange: 'transform',
                    }}
                >
                    {LOOP_IMAGES.map((src, idx) => {
                        const contentIdx = idx % HERO_CONTENT.length;
                        const content = HERO_CONTENT[contentIdx];
                        return (
                            <div
                                key={idx}
                                className="relative flex-shrink-0"
                                style={{ width: `${100 / LOOP_IMAGES.length}%` }}
                            >
                                <img
                                    src={src}
                                    className="w-full h-full object-cover"
                                    alt={`slide-${idx}`}
                                    loading={idx === 0 ? 'eager' : 'lazy'}
                                    decoding={idx === 0 ? 'sync' : 'async'}
                                    fetchPriority={idx === 0 ? 'high' : 'low'}
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90" />
                                
                                {/* ── TEXT OVERLAY: slides horizontally with the image ── */}
                                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4">
                                    <div className="space-y-8 max-w-4xl w-full">
                                        {/* Heading */}
                                        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-wide leading-tight font-serif drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
                                            {content.title}
                                        </h1>

                                        {/* Description */}
                                        <p className="text-base md:text-xl text-white/90 max-w-2xl mx-auto font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] leading-relaxed">
                                            {content.description}
                                        </p>

                                        {/* Trust Badge */}
                                        {content.badge && (
                                            <div className="flex justify-center">
                                                <div className="bg-black/40 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 shadow-2xl inline-flex items-center gap-4 hover:bg-black/50 transition-colors">
                                                    <span className={`text-2xl ${content.badge.color}`}>
                                                        {content.badge.icon}
                                                    </span>
                                                    <span className="text-white text-sm md:text-lg font-bold tracking-wide">
                                                        {content.badge.text}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ── Sound Toggle Button ── */}
                <button
                    onClick={() => {
                        const next = !isSoundEnabled;
                        setIsSoundEnabled(next);
                        if (next) {
                            // Immediately check playback to start music
                            updateMusicPlayback();
                        }
                    }}
                    className="absolute top-20 right-4 z-30 flex items-center gap-2 bg-black/40 hover:bg-black/60 backdrop-blur-md px-3 py-2 rounded-full border border-white/20 transition-all group shadow-lg"
                    title={isSoundEnabled ? "Turn off sound" : "Turn on sound"}
                >
                    {isSoundEnabled ? (
                        <>
                            <Volume2 size={18} className="text-white group-hover:scale-110 transition-transform" />
                            <span className="text-white text-xs font-semibold hidden sm:inline">Sound On</span>
                        </>
                    ) : (
                        <>
                            <VolumeX size={18} className="text-white/60 group-hover:scale-110 transition-transform" />
                            <span className="text-white/60 text-xs font-semibold hidden sm:inline">Sound Off</span>
                        </>
                    )}
                </button>

                {/* Indicators — keyed to displayIndex */}
                <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center items-center gap-4">
                    {HERO_IMAGES.map((_, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => goToSlide(idx)}
                            className="group p-2"
                        >
                            <div className={`h-1.5 rounded-full transition-all duration-500 ${idx === displayIndex ? 'w-10 bg-white' : 'w-2 bg-white/30 group-hover:bg-white/50'
                                }`} />
                        </button>
                    ))}
                </div>

            </div>

            {/* Search Section */}
            <motion.div
                className="relative z-30 -mt-12 md:-mt-24 max-w-5xl mx-auto px-4"
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
                                        const target = tabId === 'all' ? '/' : `/?category=${tabId}`;
                                        navigate(target);
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
