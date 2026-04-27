import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Elegant leaf SVG
const LeafSvg = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M50.4,1.8C49.9,1.1,49,1,48.2,1.3c-2.3,0.9-10.4,4.6-18.4,14.5c-7.3,9-12.7,21.7-12.2,34.8c0.4,11.2,5.2,21,12.3,27.9 c5.2,5,11,8.1,16.5,10.2c-0.1,2.8-0.2,5.7-0.2,8.8c0,0.8,0.7,1.5,1.5,1.5c0.8,0,1.5-0.7,1.5-1.5c0-3.1,0.1-6,0.2-8.8 c5.6-2.1,11.3-5.2,16.5-10.2c7.1-6.9,11.8-16.7,12.3-27.9C98.6,37.3,93.2,24.7,85.9,15.7C77.9,5.8,69.8,2.1,67.5,1.3 C66.8,1,65.8,1.1,65.4,1.8C61.4,7.6,55,13.7,50.4,1.8z" fill="currentColor" />
    </svg>
);

const FallingLeaves: React.FC = () => {
    const [leaves, setLeaves] = useState<Array<{ id: number; left: number; size: number; duration: number; delay: number; sway: number; color: string }>>([]);

    useEffect(() => {
        // Solid, realistic dark green leaf colors
        const colors = [
            'text-[#204014]', // Dark moss green
            'text-[#13310B]', // Deep forest green
            'text-[#2D5A1E]', // Rich green
            'text-[#193F10]', // Pine green
            'text-[#346624]'  // Slightly lighter leaf green
        ];
        
        // Increased to 100 leaves scattered across the section
        const generatedLeaves = Array.from({ length: 100 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100, // 0 to 100% across the section width
            size: Math.random() * 14 + 10, // 10px to 24px (realistic small leaves)
            duration: Math.random() * 25 + 20, // 20s to 45s fall duration
            delay: Math.random() * -45, // staggered start
            sway: Math.random() * 30 - 15, // sway path
            color: colors[Math.floor(Math.random() * colors.length)],
        }));
        setLeaves(generatedLeaves);
    }, []);

    // Using absolute positioning ensures it only stays within the parent section
    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {leaves.map((p) => (
                <motion.div
                    key={p.id}
                    className={`absolute ${p.color}`}
                    style={{ left: `${p.left}%`, width: p.size, height: p.size }}
                    initial={{ top: '-10%' }}
                    animate={{
                        top: ['-10%', '110%'],
                        x: [0, p.sway, -p.sway, p.sway, 0], // sway left and right
                        rotateX: [0, 180, 360, 540], 
                        rotateY: [0, 90, 180, 270], 
                        rotateZ: [0, 90, 180, 360],
                    }}
                    transition={{
                        top: { duration: p.duration, repeat: Infinity, ease: "linear", delay: p.delay },
                        x: { duration: p.duration / 2, repeat: Infinity, ease: "easeInOut", delay: p.delay },
                        rotateX: { duration: p.duration * 1.5, repeat: Infinity, ease: "linear", delay: p.delay },
                        rotateY: { duration: p.duration * 1.2, repeat: Infinity, ease: "linear", delay: p.delay },
                        rotateZ: { duration: p.duration * 1.8, repeat: Infinity, ease: "linear", delay: p.delay },
                    }}
                >
                    <LeafSvg className="w-full h-full drop-shadow-sm" />
                </motion.div>
            ))}
        </div>
    );
};

export default FallingLeaves;
