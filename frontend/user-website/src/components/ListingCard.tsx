import React, { useState } from 'react';
import { Star, MapPin, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface ListingCardProps {
    id: string;
    images?: string[];
    image?: string; // Fallback for backward compatibility
    title: string;
    rating: number;
    reviews: number;
    location: string;
    price: string;
    description: string;
    category?: string;
}

const ListingCard: React.FC<ListingCardProps> = ({ 
    id, images, image, title, rating, reviews, location, price, category
}) => {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const imageList = images && images.length > 0 
        ? images 
        : [image || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80'];

    const nextImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % imageList.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
    };

    const toggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsWishlisted(!isWishlisted);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="group flex flex-col cursor-pointer bg-white dark:bg-slate-950"
        >
            <Link to={`/event/${id}`} className="block relative aspect-square md:aspect-[4/3] w-full overflow-hidden rounded-2xl group/image">
                <AnimatePresence initial={false}>
                    <motion.img
                        key={currentImageIndex}
                        src={imageList[currentImageIndex]}
                        alt={title}
                        loading="lazy"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </AnimatePresence>

                {/* Wishlist Button */}
                <button 
                    onClick={toggleWishlist}
                    className="absolute top-3 right-3 z-10 p-2 group/btn"
                    aria-label="Add to wishlist"
                >
                    <Heart 
                        size={24} 
                        strokeWidth={2}
                        className={`transition-all duration-300 ${
                            isWishlisted 
                                ? 'fill-red-500 text-red-500 scale-110 drop-shadow-md' 
                                : 'fill-black/30 text-white group-hover/btn:scale-110'
                        }`} 
                    />
                </button>

                {/* Carousel Arrows */}
                {imageList.length > 1 && (
                    <>
                        <button 
                            onClick={prevImage}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity hover:scale-105 hover:bg-white z-10"
                        >
                            <ChevronLeft size={18} className="text-gray-900" />
                        </button>
                        <button 
                            onClick={nextImage}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity hover:scale-105 hover:bg-white z-10"
                        >
                            <ChevronRight size={18} className="text-gray-900" />
                        </button>
                    </>
                )}

                {/* Dot Indicators */}
                {imageList.length > 1 && (
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
                        {imageList.map((_, idx) => (
                            <div 
                                key={idx} 
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                    idx === currentImageIndex ? 'w-1.5 bg-white opacity-100' : 'w-1.5 bg-white opacity-50'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </Link>

            {/* Content Section */}
            <div className="pt-3 flex flex-col gap-0.5 relative">
                <div className="flex justify-between items-start gap-2">
                    <Link to={`/event/${id}`}>
                        <h3 className="font-bold text-base leading-tight text-gray-900 dark:text-white line-clamp-1">
                            {title}
                        </h3>
                    </Link>
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-white shrink-0">
                        <Star size={14} className="fill-gray-900 text-gray-900 dark:fill-white dark:text-white" />
                        {rating.toFixed(1)}
                    </div>
                </div>

                <div className="text-sm text-gray-500 dark:text-slate-400 flex items-center gap-1">
                    <MapPin size={12} className="text-red-500" />
                    <span>{location}</span>
                </div>
                
                <div className="mt-1 flex items-baseline gap-1">
                    <span className="font-bold text-red-500">{price}</span>
                    <span className="text-gray-500 text-xs">{category === 'Catering' ? '' : '/ event'}</span>
                </div>
            </div>
        </motion.div>
    );
};

export default ListingCard;
