import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LeafSvg = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M50,10 C60,30 90,40 70,70 C55,85 45,85 30,70 C10,40 40,30 50,10 Z" fill="currentColor" />
    </svg>
);

const FallingLeaves: React.FC = () => {
    const [leaves, setLeaves] = useState<Array<{ id: number; left: number; size: number; duration: number; delay: number; sway: number; color: string }>>([]);

    useEffect(() => {
        const colors = [
            'text-emerald-500/30',
            'text-green-600/20',
            'text-teal-500/25',
            'text-blue-500/20',
            'text-indigo-600/15'
        ];
        
        const generatedLeaves = Array.from({ length: 30 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100, 
            size: Math.random() * 12 + 10, // Larger, more visible leaves
            duration: Math.random() * 20 + 25, // Slower (25s to 45s)
            delay: Math.random() * -45,
            sway: Math.random() * 60 - 30,
            color: colors[Math.floor(Math.random() * colors.length)],
        }));
        setLeaves(generatedLeaves);
    }, []);

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            {leaves.map((leaf) => (
                <motion.div
                    key={leaf.id}
                    className={`absolute ${leaf.color}`}
                    style={{ left: `${leaf.left}%`, top: '-5%', width: leaf.size, height: leaf.size }}
                    animate={{
                        y: ['0vh', '110vh'],
                        x: [0, leaf.sway, -leaf.sway, leaf.sway, 0],
                        rotateX: [0, 360, 720],
                        rotateY: [0, 180, 360],
                        rotateZ: [0, 360],
                    }}
                    transition={{
                        duration: leaf.duration,
                        repeat: Infinity,
                        delay: leaf.delay,
                        ease: "linear",
                    }}
                >
                    <LeafSvg className="w-full h-full" />
                </motion.div>
            ))}
        </div>
    );
};

export default FallingLeaves;
