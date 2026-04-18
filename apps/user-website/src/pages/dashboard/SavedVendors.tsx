import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, MapPin, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMyWishlist, toggleWishlist } from '../../lib/api';
import Skeleton from '../../components/Skeleton';

const SavedVendors: React.FC = () => {
    const queryClient = useQueryClient();

    const { data: saved = [], isLoading } = useQuery({
        queryKey: ['wishlist'],
        queryFn: fetchMyWishlist,
    });

    const toggleMutation = useMutation({
        mutationFn: toggleWishlist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        },
    });

    const handleRemove = (vendorId: string) => {
        toggleMutation.mutate(vendorId);
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-80 rounded-2xl" />)}
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight">Saved Vendors</h1>
                    <p className="text-neutral-500 dark:text-slate-400 mt-1">Compare and book the top vendors you’ve saved for your event.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-neutral-200 dark:border-slate-800 rounded-xl font-semibold text-sm hover:bg-neutral-50 dark:hover:bg-slate-800 transition">
                     Compare Vendors ({saved.length})
                </button>
            </header>

            <AnimatePresence>
                {saved.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {saved.map((item: any, index: number) => {
                            const vendor = item.vendor;
                            return (
                                <motion.div 
                                    key={item.id} 
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-neutral-200/60 dark:border-slate-800 group relative"
                                >
                                    <div className="h-48 relative overflow-hidden">
                                        <img 
                                            src={vendor?.portfolioImages?.[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80'} 
                                            alt={vendor?.businessName} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                                        />
                                        
                                        <button 
                                            onClick={() => handleRemove(item.vendorId)}
                                            disabled={toggleMutation.isPending}
                                            className="absolute top-3 right-3 w-8 h-8 bg-white/90 dark:bg-slate-900/90 rounded-full flex items-center justify-center text-red-500 hover:scale-110 transition-transform shadow-md"
                                        >
                                            <Heart size={16} fill="currentColor" />
                                        </button>

                                        <div className="absolute bottom-3 left-3 flex gap-1.5">
                                             <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                                                {vendor?.verificationStatus === 'verified' ? 'Verified' : 'Popular'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-1">
                                            <div>
                                                <span className="text-xs font-bold text-red-500 tracking-wider uppercase">{vendor?.category?.name || 'Service'}</span>
                                                <h3 className="font-bold text-neutral-900 dark:text-white mt-0.5 leading-snug">{vendor?.businessName}</h3>
                                            </div>
                                            <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded-lg">
                                                <Star size={12} className="text-amber-500 fill-amber-500" />
                                                <span className="text-xs font-bold text-amber-700 dark:text-amber-500">{vendor?.rating || 4.5}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1 text-neutral-400 text-xs mb-3">
                                            <MapPin size={13} />
                                            {vendor?.city}, {vendor?.state} • <span className="underline">{vendor?.totalReviews || 0} reviews</span>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-neutral-100 dark:border-slate-800/80 pt-3 mt-3">
                                            <div>
                                                <p className="text-xs text-neutral-400">Services from</p>
                                                <p className="text-base font-black text-neutral-900 dark:text-white leading-none mt-1">₹{parseFloat(vendor?.startingPrice || '0').toLocaleString()}</p>
                                            </div>
                                            <Link 
                                                to={`/vendor/${item.vendorId}`} 
                                                className="flex items-center gap-1 bg-neutral-100 dark:bg-slate-800 hover:bg-neutral-200/80 dark:hover:bg-slate-700 text-neutral-800 dark:text-neutral-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
                                            >
                                                View <ArrowRight size={13} />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
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
