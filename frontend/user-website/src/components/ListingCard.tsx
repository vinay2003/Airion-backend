import React, { useState } from 'react';
import { Star, MapPin, Heart, ChevronLeft, ChevronRight, ShieldCheck, Sparkles, Plus, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface ListingCardProps {
    id: string;
    images?: string[];
    image?: string; 
    title: string;
    rating: number;
    reviews: number;
    location: string;
    price: string;
    description: string;
    category?: string;
    // Add explicit fields or mock fallback
    tags?: string[];
    highlights?: string[];
    isTrending?: boolean;
}

const ListingCard: React.FC<ListingCardProps> = ({ 
    id, images, image, title, rating, reviews, location, price, category, 
    tags = ['Verified', 'Premium'], 
    highlights = ['500+ Events Completed', 'Fast Response Time'],
    isTrending = true
}) => {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isCompared, setIsCompared] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const navigate = useNavigate();

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

    const handleCompare = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsCompared(!isCompared);
    };

    const handleBookNow = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/event/${id}?booking=true`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4 }}
            className="group flex flex-col bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-neutral-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative"
        >
            {/* Image Section */}
            <Link to={`/event/${id}`} className="block relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 group/image">
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

                {/* Gradient Overlay */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

                {/* Verified / Trading Badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
                    {tags.map((tag) => (
                        <span key={tag} className="bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-sm">
                            {tag === 'Verified' && <ShieldCheck size={11} className="text-green-500" />}
                            {tag}
                        </span>
                    ))}
                    {isTrending && (
                        <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5 shadow-sm shadow-red-500/10">
                            <Sparkles size={11} /> Trending
                        </span>
                    )}
                </div>

                {/* Wishlist Button */}
                <button 
                    onClick={toggleWishlist}
                    className="absolute top-3 right-3 z-10 p-1.5 bg-white/90 backdrop-blur-sm dark:bg-slate-900/80 rounded-full shadow-sm"
                    aria-label="Add to wishlist"
                >
                    <Heart 
                        size={18} 
                        className={`transition-all duration-300 ${isWishlisted ? 'fill-red-500 text-red-500 scale-110' : 'text-neutral-500 hover:scale-105'}`} 
                    />
                </button>

                {/* Compare Button */}
                <button 
                    onClick={handleCompare}
                    className={`absolute top-14 right-3 z-10 p-1.5 backdrop-blur-sm rounded-full shadow-sm transition-colors ${isCompared ? 'bg-red-500 text-white' : 'bg-white/90 dark:bg-slate-900/80 text-neutral-500'}`}
                    aria-label="Compare"
                >
                    <Plus size={18} className={`transform transition-transform ${isCompared ? 'rotate-45' : ''}`} />
                </button>

                {/* Carousel Arrows */}
                {imageList.length > 1 && (
                    <>
                        <button 
                            onClick={prevImage}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity hover:scale-105 hover:bg-white z-10"
                        >
                            <ChevronLeft size={18} className="text-gray-900" />
                        </button>
                        <button 
                            onClick={nextImage}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity hover:scale-105 hover:bg-white z-10"
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
                                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-3 bg-white' : 'w-1.5 bg-white/60'}`}
                            />
                        ))}
                    </div>
                )}
            </Link>

            {/* Content Section */}
            <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                        <Link to={`/event/${id}`}>
                            <h3 className="font-bold text-base leading-snug text-neutral-900 dark:text-neutral-100 hover:text-red-500 transition-colors truncate">
                                {title}
                            </h3>
                        </Link>
                        {category && <p className="text-xs text-neutral-400 mt-0.5 font-medium">{category}</p>}
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-500/10 px-1.5 py-0.5 rounded-lg text-xs font-bold text-amber-700 dark:text-amber-500 shrink-0">
                        <Star size={12} className="fill-amber-500 text-amber-500" />
                        {Number(rating || 0).toFixed(1)} {reviews > 0 && <span className="text-amber-600/60 font-medium font-sans">({reviews})</span>}
                    </div>
                </div>

                <div className="text-xs text-neutral-500 dark:text-slate-400 flex items-center gap-1 mt-2">
                    <MapPin size={12} className="text-neutral-400" />
                    <span className="truncate">{location}</span>
                </div>

                {/* Highlights */}
                <div className="flex flex-wrap gap-1 mt-2.5">
                    {highlights.map((hlt) => (
                        <span key={hlt} className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-neutral-600 dark:text-slate-300 bg-neutral-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                            <Zap size={10} className="text-amber-500" /> {hlt}
                        </span>
                    ))}
                </div>

                {/* Pricing & Actions */}
                <div className="mt-auto pt-3 border-t border-neutral-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] text-neutral-400">Starts from</p>
                        <p className="text-sm font-black text-neutral-900 dark:text-white leading-tight">
                            {price}
                        </p>
                    </div>
                    <button 
                        onClick={handleBookNow}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md shadow-red-500/10 hover:shadow-lg transition flex items-center gap-1"
                    >
                        Book Now
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ListingCard;
