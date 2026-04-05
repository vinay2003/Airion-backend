import React, { useState } from 'react';
import { Search, Filter, Heart, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';

const Inspiration: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filters = ['All', 'Decor', 'Outfits', 'Venues', 'Food', 'Photography', 'Mehndi'];

    const images = [
        { id: 1, category: 'Decor', image: 'https://images.unsplash.com/photo-1519225468359-2996bc01c32c?q=80&w=1000&auto=format&fit=crop', title: 'Floral Mandap Setup' },
        { id: 2, category: 'Outfits', image: 'https://images.unsplash.com/photo-1595524366670-bf9988cc17c8?q=80&w=1000&auto=format&fit=crop', title: 'Bridal Lehenga Red' },
        { id: 3, category: 'Venues', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1000&auto=format&fit=crop', title: 'Royal Palace Wedding' },
        { id: 4, category: 'Food', image: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1000&auto=format&fit=crop', title: 'Gourmet Catering' },
        { id: 5, category: 'Photography', image: 'https://images.unsplash.com/photo-1511285560982-1356c11d4606?q=80&w=1000&auto=format&fit=crop', title: 'Couple Portrait' },
        { id: 6, category: 'Mehndi', image: 'https://images.unsplash.com/photo-1565694425434-327b15752625?q=80&w=1000&auto=format&fit=crop', title: 'Intricate Mehndi Design' },
        { id: 7, category: 'Decor', image: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?q=80&w=1000&auto=format&fit=crop', title: 'Table Setting' },
        { id: 8, category: 'Outfits', image: 'https://images.unsplash.com/photo-1605218427368-35b019b8a391?q=80&w=1000&auto=format&fit=crop', title: 'Groom Sherwani' },
        { id: 9, category: 'Venues', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af0bc3?q=80&w=1000&auto=format&fit=crop', title: 'Beach Wedding Setup' },
        { id: 10, category: 'Food', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop', title: 'Dessert Table' },
        { id: 11, category: 'Photography', image: 'https://images.unsplash.com/photo-1520854221256-17451cc330e7?q=80&w=1000&auto=format&fit=crop', title: 'Candid Moments' },
        { id: 12, category: 'Mehndi', image: 'https://images.unsplash.com/photo-1604608673550-e78f1d304618?q=80&w=1000&auto=format&fit=crop', title: 'Bridal Hands' },
    ];

    const filteredImages = images.filter(img => 
        (activeFilter === 'All' || img.category === activeFilter) &&
        img.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-transparent dark:bg-slate-950 transition-colors duration-300 pt-20 pb-20">
            <SEO title="Inspiration Feed" description="Discover beautiful ideas for your next event." />
            
            {/* Header Section */}
            <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-sm border-b border-neutral-200/50 dark:border-slate-800/80 sticky top-[72px] z-30 transition-colors">
                <div className="max-w-[1440px] mx-auto px-4 md:px-8 pt-8 pb-4">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-6">
                        <div>
                            <h1 className="text-3xl md:text-5xl font-black text-neutral-900 dark:text-white mb-2 tracking-tight">Event Inspiration</h1>
                            <p className="text-neutral-500 dark:text-slate-400 font-medium">Discover beautiful ideas curated just for you.</p>
                        </div>
                        
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search 'Bridal Lehenga'..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 border border-neutral-200 dark:border-slate-700 rounded-full bg-neutral-100 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-red-500 outline-none transition-all text-sm font-semibold text-neutral-900 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2">
                        <button className="p-2.5 rounded-full border border-neutral-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-neutral-50 dark:hover:bg-slate-800 text-neutral-600 dark:text-slate-300 transition-colors shadow-sm">
                            <Filter size={18} />
                        </button>
                        {filters.map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all shadow-sm ${
                                    activeFilter === filter
                                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                                    : 'bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-700 text-neutral-600 dark:text-slate-300 hover:border-neutral-900 dark:hover:border-white'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Masonry Grid */}
            <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8">
                <motion.div layout className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 md:gap-6 space-y-4 md:space-y-6 block">
                    <AnimatePresence>
                        {filteredImages.map((item, idx) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4, delay: (idx % 12) * 0.05 }}
                                key={item.id}
                                className="break-inside-avoid group relative rounded-3xl overflow-hidden bg-neutral-100 dark:bg-slate-800 shadow-sm border border-neutral-200/50 dark:border-slate-800/80 cursor-zoom-in"
                            >
                                <img src={item.image} alt={item.title} loading="lazy" className="w-full h-auto object-cover transform group-hover:scale-[1.03] transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <p className="text-white font-bold text-lg mb-3 tracking-wide">{item.title}</p>
                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-2">
                                            <button className="p-2.5 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-red-500 hover:border-transparent border border-white/30 transition-all cursor-pointer">
                                                <Heart size={16} className="fill-current bg-transparent" />
                                            </button>
                                            <button className="p-2.5 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-neutral-900 border border-white/30 transition-all cursor-pointer">
                                                <Share2 size={16} />
                                            </button>
                                        </div>
                                        <span className="text-[11px] font-bold text-white bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/20 uppercase tracking-wider">
                                            {item.category}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
                
                {filteredImages.length === 0 && (
                    <div className="text-center py-32 bg-neutral-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-neutral-200 dark:border-slate-800">
                        <h3 className="text-2xl font-bold text-neutral-800 dark:text-white mb-2">No inspiration found</h3>
                        <p className="text-neutral-500">Try adjusting your search criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inspiration;
