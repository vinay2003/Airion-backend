import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart, Product } from '../context/CartContext';
import { Filter, ShoppingBag, Search, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../lib/api';

const MOCK_PRODUCTS: Product[] = [
    { id: 'm1', title: 'Premium LED Fairy Lights (50m)', price: 1200, category: 'Decor', image: 'https://images.unsplash.com/photo-1543594680-cb03264c7cc3?q=80&w=600' },
    { id: 'm2', title: 'Elegant Floral Centerpiece Set', price: 4500, category: 'Decor', image: 'https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?q=80&w=600' },
    { id: 'm3', title: 'Personalized Welcome Sign (Acrylic)', price: 3000, category: 'Signage', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=600' },
    { id: 'm4', title: 'Bridal Squad Satin Robes (Pack of 5)', price: 7500, category: 'Apparel', image: 'https://images.unsplash.com/photo-1516041042571-063943ed2949?q=80&w=600' },
    { id: 'm5', title: 'Vintage Photo Booth Props Kit', price: 800, category: 'Entertainment', image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=600' },
    { id: 'm6', title: 'Custom Engraved Champagne Flutes', price: 2200, category: 'Gifts', image: 'https://images.unsplash.com/photo-1510657158737-1424a520a23e?q=80&w=600' },
];

const CATEGORIES = ['All', 'Decor', 'Apparel', 'Signage', 'Gifts', 'Entertainment'];

const Merchandise: React.FC = () => {
    const { addToCart } = useCart();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);

    React.useEffect(() => {
        fetchProducts()
            .then((res: any) => {
                if (res && res.length > 0) {
                    setProducts(res.map((p: any) => ({
                        id: p.id,
                        title: p.title,
                        price: Number(p.price),
                        category: p.category,
                        image: p.image || 'https://images.unsplash.com/photo-1543594680-cb03264c7cc3?q=80&w=600'
                    })));
                }
            })
            .catch(() => {
                // Keep mocks as fallback
            });
    }, []);

    const filteredProducts = products.filter(p => {
        const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
        const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCat && matchSearch;
    });

    return (
        <main className="min-h-screen bg-neutral-50 dark:bg-slate-950 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-neutral-900 dark:text-white tracking-tight mb-2">Event Store</h1>
                        <p className="text-neutral-500 dark:text-slate-400">Everything you need to make your event perfect.</p>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-sm font-medium"
                            />
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <div className="flex overflow-x-auto pb-4 mb-8 gap-2 custom-scrollbar">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                                selectedCategory === cat
                                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                                    : 'bg-white dark:bg-slate-900 text-neutral-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-slate-800 border border-neutral-200 dark:border-slate-800'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white dark:bg-slate-900 rounded-3xl border border-neutral-200/60 dark:border-slate-800 overflow-hidden group transition-all duration-300"
                        >
                            <Link to={`/merchandise/${product.id}`} className="block relative aspect-square overflow-hidden bg-neutral-100 dark:bg-slate-800">
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-full h-full object-cover transition-transform duration-500"
                                    loading="lazy"
                                />
                                <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                    {product.category}
                                </div>
                            </Link>
                            <div className="p-5">
                                <div className="flex items-center gap-1 mb-2">
                                    <Star className="text-yellow-400 fill-yellow-400" size={14} />
                                    <span className="text-xs font-bold text-neutral-700 dark:text-slate-300">4.8</span>
                                    <span className="text-xs text-neutral-400">(124)</span>
                                </div>
                                <Link to={`/merchandise/${product.id}`}>
                                    <h3 className="font-bold text-neutral-900 dark:text-white line-clamp-2 hover:text-red-500 transition-colors mb-4 min-h-[40px]">
                                        {product.title}
                                    </h3>
                                </Link>
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-black text-neutral-900 dark:text-white">₹{product.price.toLocaleString()}</span>
                                    <button
                                        onClick={(e) => { e.preventDefault(); addToCart(product); }}
                                        className="p-3 bg-red-50 dark:bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                                        title="Add to Cart"
                                    >
                                        <ShoppingBag size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-20">
                        <ShoppingBag className="mx-auto text-neutral-300 dark:text-slate-700 mb-4" size={48} />
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">No products found</h3>
                        <p className="text-neutral-500">Try adjusting your filters or search query.</p>
                    </div>
                )}
            </div>
        </main>
    );
};

export default Merchandise;
