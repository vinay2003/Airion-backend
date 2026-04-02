import React from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
}

const Skeleton: React.FC<SkeletonProps> = ({
    className = '',
    variant = 'text',
    width,
    height
}) => {
    const baseStyles = "animate-pulse bg-gray-200 dark:bg-slate-800";

    const variants = {
        text: "rounded",
        circular: "rounded-full",
        rectangular: "rounded-md",
    };

    const style = {
        width,
        height,
    };

    return (
        <div
            className={`${baseStyles} ${variants[variant]} ${className}`}
            style={style}
        />
    );
};

export default Skeleton;
