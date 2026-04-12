import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const FallingSnow: React.FC = () => {
    const [flakes, setFlakes] = useState<Array<{ id: number; left: number; size: number; duration: number; delay: number; drift: number; opacity: number }>>([]);

    useEffect(() => {
        const generatedFlakes = Array.from({ length: 80 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100, 
            size: Math.random() * 4 + 2, // 2px to 6px
            duration: Math.random() * 30 + 35, // Slower (35s to 65s)
            delay: Math.random() * -65,
            drift: Math.random() * 60 - 30,
            opacity: Math.random() * 0.4 + 0.1,
        }));
        setFlakes(generatedFlakes);
    }, []);

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            {flakes.map((f) => (
                <motion.div
                    key={f.id}
                    className="absolute bg-white rounded-full shadow-[0_0_10px_white]"
                    style={{ 
                        left: `${f.left}%`, 
                        top: '-5%', 
                        width: f.size, 
                        height: f.size,
                        opacity: f.opacity
                    }}
                    animate={{
                        y: ['0vh', '110vh'],
                        x: [0, f.drift],
                    }}
                    transition={{
                        duration: f.duration,
                        repeat: Infinity,
                        delay: f.delay,
                        ease: "linear",
                    }}
                />
            ))}
        </div>
    );
};

export default FallingSnow;
