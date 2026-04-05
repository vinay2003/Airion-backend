import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, MapPin, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SavedVendors: React.FC = () => {
    const [saved, setSaved] = useState([
        { 
            id: '4', 
            title: 'Royal Palace Banquet', 
            category: 'Venue & Decoration', 
            image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80', 
            rating: 4.8, 
            reviews: 124,
            location: 'Jaipur, RJ', 
            price: '₹1,80,000', 
            tags: ['Verified', 'Premium'],
            emiAvailable: true
        },
        { 
            id: '7', 
            title: 'Rooftop Lounge & Bar', 
            category: 'Corporate party', 
            image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80', 
            rating: 4.6, 
            reviews: 89,
            location: 'Mumbai, MH', 
            price: '₹45,000', 
            tags: ['Budget-friendly'] 
        },
        { 
            id: '8', 
            title: 'Candid Moments Photography', 
            category: 'Photography', 
            image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&q=80', 
            rating: 4.9, 
            reviews: 215,
            location: 'Mumbai, MH', 
            price: '₹85,000', 
            tags: ['Top-rated', 'Exclusive'] 
        }
    ]);

    const handleRemove = (id: string) => {
        setSaved(saved.filter(item => item.id !== id));
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight">Saved Vendors</h1>
                    <p className="text-neutral-500 dark:text-slate-400 mt-1">Compare and book the top vendors you’ve saved for your event.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-neutral-200 dark:border-slate-800 rounded-xl font-semibold text-sm hover:bg-neutral-50 dark:hover:bg-slate-800 transition">
                     Compare Vendors (0)
                </button>
            </header>

            <AnimatePresence>
                {saved.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {saved.map((item, index) => (
                            <motion.div 
                                key={item.id} 
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-neutral-200/60 dark:border-slate-800 group relative"
                            >
                                <div className="h-48 relative overflow-hidden">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    
                                    <button 
                                        onClick={() => handleRemove(item.id)}
                                        className="absolute top-3 right-3 w-8 h-8 bg-white/90 dark:bg-slate-900/90 rounded-full flex items-center justify-center text-red-500 hover:scale-110 transition-transform shadow-md"
                                    >
                                        <Heart size={16} fill="currentColor" />
                                    </button>

                                    <div className="absolute bottom-3 left-3 flex gap-1.5">
                                        {item.tags?.map(tag => (
                                            <span key={tag} className="bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-1">
                                        <div>
                                            <span className="text-xs font-bold text-red-500 tracking-wider uppercase">{item.category}</span>
                                            <h3 className="font-bold text-neutral-900 dark:text-white mt-0.5 leading-snug">{item.title}</h3>
                                        </div>
                                        <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded-lg">
                                            <Star size={12} className="text-amber-500 fill-amber-500" />
                                            <span className="text-xs font-bold text-amber-700 dark:text-amber-500">{item.rating}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 text-neutral-400 text-xs mb-3">
                                        <MapPin size={13} />
                                        {item.location} • <span className="underline">{item.reviews} reviews</span>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-neutral-100 dark:border-slate-800/80 pt-3 mt-3">
                                        <div>
                                            <p className="text-xs text-neutral-400">Services from</p>
                                            <p className="text-base font-black text-neutral-900 dark:text-white leading-none mt-1">{item.price}</p>
                                        </div>
                                        <Link 
                                            to={`/event/${item.id}`} 
                                            className="flex items-center gap-1 bg-neutral-100 dark:bg-slate-800 hover:bg-neutral-200/80 dark:hover:bg-slate-700 text-neutral-800 dark:text-neutral-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
                                        >
                                            View <ArrowRight size={13} />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-900 border border-dashed border-neutral-300 dark:border-slate-800 p-12 rounded-2xl text-center space-y-4">
                        <div className="w-16 h-16 bg-neutral-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-neutral-400">
                            <ShoppingBag size={24} />
                        </div>
                        <div>
                            <p className="font-bold text-neutral-800 dark:text-neutral-200">No saved vendors</p>
                            <p className="text-sm text-neutral-400 mt-1">Start exploring vendors and tap the heart icon to save them here.</p>
                        </div>
                        <Link to="/search" className="inline-flex items-center gap-1 bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-600 shadow-md">
                            Browse Vendors
                        </Link>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SavedVendors;
