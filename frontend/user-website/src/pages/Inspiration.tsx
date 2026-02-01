import React, { useState } from 'react';
import { Search, Filter, Heart, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Inspiration: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState('All');

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

    const filteredImages = activeFilter === 'All' ? images : images.filter(img => img.category === activeFilter);

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-20">
            {/* Header Section */}
            <div className="bg-white shadow-sm sticky top-[72px] z-30">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">Wedding Inspiration</h1>
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search for ideas..."
                                className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-100 focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
                        <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600">
                            <Filter size={20} />
                        </button>
                        {filters.map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeFilter === filter
                                    ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Masonry Grid */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                <motion.div layout className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                    <AnimatePresence>
                        {filteredImages.map(item => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                key={item.id}
                                className="break-inside-avoid group relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                            >
                                <img src={item.image} alt={item.title} className="w-full h-auto object-cover" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>

                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
                                    <p className="text-white font-bold text-sm mb-2">{item.title}</p>
                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-2">
                                            <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-red-500 transition-colors">
                                                <Heart size={16} />
                                            </button>
                                            <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-gray-900 transition-colors">
                                                <Share2 size={16} />
                                            </button>
                                        </div>
                                        <span className="text-xs text-gray-200 bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
                                            {item.category}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default Inspiration;
