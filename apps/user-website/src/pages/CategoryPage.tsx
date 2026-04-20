import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ListingCard from '../components/ListingCard';
import FilterSidebar from '../components/FilterSidebar';
import { ArrowLeft, ChevronDown, Search } from 'lucide-react';
import { fetchEvents } from '../lib/api';
import type { Event as EventType } from '../types';

const CategoryPage: React.FC = () => {
    const { category } = useParams<{ category: string }>();
    const [categoryEvents, setCategoryEvents] = useState<EventType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const allEvents = await fetchEvents();
                
                // 🔹 Robust Category Filtering
                // Handles singular/plural variations (e.g., 'Party' from API vs 'Parties' from URL)
                const filtered = allEvents.filter(e => {
                    if (!category) return true;
                    
                    const catLower = category.toLowerCase();
                    const eventCatLower = e.category.toLowerCase();
                    
                    // Direct match
                    if (eventCatLower === catLower) return true;
                    
                    // Singular/Plural matching (e.g., 'parties' vs 'party')
                    if (catLower === 'parties' && eventCatLower === 'party') return true;
                    if (catLower === 'party' && eventCatLower === 'parties') return true;
                    if (catLower === 'birthdays' && eventCatLower === 'birthday') return true;
                    if (catLower === 'venues' && eventCatLower === 'venue') return true;
                    
                    return false;
                });
                
                setCategoryEvents(filtered);
            } catch (err) {
                console.error('Failed to filter category events:', err);
                setCategoryEvents([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [category]);

    const getCategoryHeroImage = (cat: string | undefined) => {
        const c = cat?.toLowerCase();
        switch (c) {
            case 'weddings': return 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop';
            case 'parties': return 'https://images.unsplash.com/photo-1530103862676-de3c9a59af57?q=80&w=1000&auto=format&fit=crop';
            case 'corporate': return 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1000&auto=format&fit=crop';
            case 'seminars': return 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1000&auto=format&fit=crop';
            case 'meetups': return 'https://images.unsplash.com/photo-1609103224786-e43d94029557?q=80&w=1000&auto=format&fit=crop';
            default: return 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1000&auto=format&fit=crop';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
                <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (categoryEvents.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-gray-200 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                        <Search size={32} className="text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Category Currently Empty</h2>
                    <p className="text-gray-500 dark:text-slate-400">Our vendors are currently populating {category} with premium listings.</p>
                    <Link to="/" className="inline-flex items-center gap-2 text-red-500 hover:text-red-600 font-bold uppercase tracking-widest text-xs">
                        <ArrowLeft size={16} />
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
            {/* Hero Section */}
            <div className="relative h-[40vh] min-h-[300px] overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={getCategoryHeroImage(category)}
                        alt={category}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
                </div>
                <div className="relative h-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col justify-center text-white">
                    <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors w-fit font-bold uppercase tracking-widest text-xs">
                        <ArrowLeft size={16} />
                        Back to Discovery
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-black capitalize mb-4 tracking-tighter leading-tight italic">
                        {category}{" "}
                        <span className="text-red-500 not-italic ml-2 tracking-widest">NETWORK</span>
                    </h1>
                    <p className="text-lg text-white/90 max-w-2xl font-bold italic opacity-80">
                        Access elite {category} nodes within our optimized event ecosystem. Verified performance metrics and real-time availability active.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-1/4">
                        <div className="sticky top-24">
                            <FilterSidebar />
                        </div>
                    </aside>

                    {/* Listings */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-8 border-b border-gray-200 dark:border-slate-800 pb-6">
                            <p className="text-gray-400 font-black uppercase text-xs tracking-widest">
                                Active Nodes: <span className="text-gray-900 dark:text-white ml-2">{categoryEvents.length} Verified</span>
                            </p>
                            <div className="relative">
                                <button className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2 hover:border-red-500 dark:hover:border-red-500 transition-all shadow-sm">
                                    Sort: Performance
                                    <ChevronDown size={14} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {categoryEvents.map((event) => (
                                <ListingCard key={event.id} {...event} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;
