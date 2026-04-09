import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Scalable, delicate rose petal SVG
const DropSvg = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M50,15 C65,25 85,45 75,75 C60,95 40,95 25,75 C15,45 35,25 50,15 Z" fill="currentColor" />
    </svg>
);

const FallingPetals: React.FC = () => {
    const [petals, setPetals] = useState<Array<{ id: number; left: number; size: number; duration: number; delay: number; sway: number; color: string }>>([]);

    useEffect(() => {
        // Red, rose, and deep crimson palette to match Aurora mesh
        const colors = [
            'text-red-500/70',
            'text-rose-500/60',
            'text-pink-600/50',
            'text-red-700/60',
            'text-rose-400/50'
        ];
        
        // 50 individual petal elements, 5% edge padding
        const generatedPetals = Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            left: 5 + Math.random() * 90, 
            size: Math.random() * 15 + 10, // Small, delicate footprint (10px to 25px)
            duration: Math.random() * 20 + 20, // 20s to 40s fall duration
            delay: Math.random() * -40, // staggered start (negative to start pre-fallen)
            sway: Math.random() * 40 - 20, // random sway breadth between -20 and 20
            color: colors[Math.floor(Math.random() * colors.length)],
        }));
        setPetals(generatedPetals);
    }, []);

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            {petals.map((p) => (
                <motion.div
                    key={p.id}
                    className={`absolute ${p.color}`}
                    style={{ left: `${p.left}%`, top: '-10%', width: p.size, height: p.size }}
                    animate={{
                        y: ['0vh', '110vh'],
                        x: [0, p.sway, -p.sway, p.sway, 0], // sway left and right
                        rotateX: [0, 180, 360, 540], // organic tumbling
                        rotateY: [0, 90, 180, 270], 
                        rotateZ: [0, 90, 180, 360],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay, // allows petals to already be on screen
                        ease: "linear",
                    }}
                >
                    <DropSvg className="w-full h-full drop-shadow-lg" />
                </motion.div>
            ))}
        </div>
    );
};

export default FallingPetals;
