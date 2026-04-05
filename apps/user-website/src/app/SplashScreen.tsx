import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, UserCircle2 } from 'lucide-react';

const SplashScreen: React.FC = () => {
    const navigate = useNavigate();

    // Auto-navigate after 4 seconds
    useEffect(() => {
        const timer = setTimeout(() => navigate('/onboarding'), 4000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-neutral-950">
            {/* Animated radial gradient background */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-radial from-red-600/30 via-orange-500/10 to-transparent blur-3xl"
                />
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-gradient-radial from-red-800/20 via-transparent to-transparent blur-2xl"
                />
            </div>

            {/* Floating particle dots */}
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full bg-red-400/40"
                    style={{
                        top: `${15 + Math.random() * 70}%`,
                        left: `${10 + Math.random() * 80}%`,
                    }}
                    animate={{ y: [-10, 10, -10], opacity: [0.2, 0.7, 0.2] }}
                    transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
                />
            ))}

            {/* Main content */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="relative z-10 flex flex-col items-center text-center px-6 max-w-sm mx-auto"
            >
                {/* Logo */}
                <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-20 h-20 rounded-3xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-2xl shadow-red-500/40 mb-8"
                >
                    <Sparkles size={40} className="text-white" />
                </motion.div>

                {/* Wordmark */}
                <h1 className="text-5xl font-bold text-white tracking-tight mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Airion
                </h1>

                {/* Tagline */}
                <p className="text-neutral-400 text-base font-medium leading-relaxed mb-12 max-w-[260px]">
                    Celebrate every moment with the right vendors
                </p>

                {/* CTA Buttons */}
                <div className="w-full space-y-3">
                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate('/onboarding')}
                        className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-xl shadow-red-500/30 transition-all"
                    >
                        Get Started <ArrowRight size={18} />
                    </motion.button>

                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate('/login')}
                        className="w-full bg-white/10 hover:bg-white/15 text-white py-4 rounded-2xl font-bold text-base border border-white/10 transition-all backdrop-blur-sm"
                    >
                        Login
                    </motion.button>

                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate('/')}
                        className="w-full py-3 rounded-2xl font-medium text-sm text-neutral-500 hover:text-neutral-300 flex items-center justify-center gap-2 transition-colors"
                    >
                        <UserCircle2 size={16} />
                        Continue as Guest
                    </motion.button>
                </div>

                {/* Progress bar */}
                <div className="mt-10 w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-red-500 rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 4, ease: 'linear' }}
                    />
                </div>
                <p className="text-neutral-600 text-xs mt-2">Auto-advancing…</p>
            </motion.div>
        </div>
    );
};

export default SplashScreen;
