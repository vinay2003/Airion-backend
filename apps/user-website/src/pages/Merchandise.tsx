import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart, Product } from '../context/CartContext';
import { Filter, ShoppingBag, Search, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../lib/api';

const MOCK_PRODUCTS: (Product & { description: string; rating: number; reviewsCount: number; stock: number })[] = [
    {
        id: 'm1',
        title: 'Premium LED Fairy Lights (50m)',
        price: 1200,
        category: 'Decor',
        image: 'https://images.unsplash.com/photo-1543594680-cb03264c7cc3?q=80&w=600',
        description: 'Enchanting warm white LED string lights. Waterproof and durable, perfect for backdrops and canopy ceilings.',
        rating: 4.8,
        reviewsCount: 124,
        stock: 45
    },
    {
        id: 'm2',
        title: 'Elegant Floral Centerpiece Set',
        price: 4500,
        category: 'Decor',
        image: 'https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?q=80&w=600',
        description: 'Handcrafted artificial rose and hydrangea floral centerpieces. Adds a touch of luxury to event guest tables.',
        rating: 4.9,
        reviewsCount: 98,
        stock: 20
    },
    {
        id: 'm3',
        title: 'Personalized Welcome Sign (Acrylic)',
        price: 3000,
        category: 'Signage',
        image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=600',
        description: 'Frosted acrylic sheet with custom gold foil text. Customize with your name and event date.',
        rating: 4.7,
        reviewsCount: 65,
        stock: 15
    },
    {
        id: 'm4',
        title: 'Bridal Squad Satin Robes (Pack of 5)',
        price: 7500,
        category: 'Apparel',
        image: 'https://images.unsplash.com/photo-1516041042571-063943ed2949?q=80&w=600',
        description: 'Super-soft silk satin robes with "Bride" and "Bridesmaid" embroidered on the back in gold script.',
        rating: 4.8,
        reviewsCount: 112,
        stock: 30
    },
    {
        id: 'm5',
        title: 'Vintage Photo Booth Props Kit',
        price: 800,
        category: 'Entertainment',
        image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=600',
        description: 'Fun collection of vintage-style cardboard props including retro glasses, hats, mustaches, and signs.',
        rating: 4.6,
        reviewsCount: 88,
        stock: 80
    },
    {
        id: 'm6',
        title: 'Custom Engraved Champagne Flutes',
        price: 2200,
        category: 'Gifts',
        image: 'https://images.unsplash.com/photo-1510657158737-1424a520a23e?q=80&w=600',
        description: 'Pair of crystal champagne glasses engraved with initials. Elegant keepsake for the bride and groom.',
        rating: 4.9,
        reviewsCount: 140,
        stock: 25
    },
    {
        id: 'm7',
        title: 'Vintage Metal Lantern Candle Holder',
        price: 1500,
        category: 'Decor',
        image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?q=80&w=600',
        description: 'Distressed black metal lantern with glass panels. Perfect for aisle decoration and tabletop ambience.',
        rating: 4.7,
        reviewsCount: 76,
        stock: 60
    },
    {
        id: 'm8',
        title: 'Groom & Groomsmen Bow Tie Set (Pack of 5)',
        price: 3500,
        category: 'Apparel',
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600',
        description: 'Premium matching velvet bow ties in deep emerald green. Pre-tied with adjustable straps.',
        rating: 4.8,
        reviewsCount: 42,
        stock: 18
    },
    {
        id: 'm9',
        title: 'Golden Table Number Stands (Set of 1-20)',
        price: 2500,
        category: 'Signage',
        image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=600',
        description: 'Elegant hoop design table card holders in metallic polished gold. Stable heavy base.',
        rating: 4.5,
        reviewsCount: 33,
        stock: 40
    },
    {
        id: 'm10',
        title: 'Handmade Scented Soy Candles (Box of 4)',
        price: 1800,
        category: 'Gifts',
        image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=600',
        description: 'Luxury lavender and vanilla scented soy candles in elegant amber jars. Perfect event return favors.',
        rating: 4.9,
        reviewsCount: 110,
        stock: 55
    },
    {
        id: 'm11',
        title: 'Wireless LED Party Uplighter (Rechargeable)',
        price: 5200,
        category: 'Entertainment',
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600',
        description: 'Compact wireless RGBWA+UV uplight. Remote controlled with active sound syncing capabilities.',
        rating: 4.8,
        reviewsCount: 57,
        stock: 12
    },
    {
        id: 'm12',
        title: 'Custom Wooden Photo Guestbook',
        price: 2800,
        category: 'Gifts',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600',
        description: 'Laser-engraved wooden cover book with thick blank pages. Fits Polaroid guest photos and signatures.',
        rating: 4.9,
        reviewsCount: 84,
        stock: 22
    }
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
        <main className="min-h-screen bg-neutral-50 dark:bg-slate-950 pt-20 pb-16">
            {/* Premium Hero Banner */}
            <div className="relative overflow-hidden bg-neutral-900 text-white py-16 sm:py-20 mb-12">
                {/* Neon glow effect background */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.15),transparent_40%)]" />
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-500/10 rounded-full blur-[100px]" />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-7 space-y-6">
                        <span className="px-3.5 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest rounded-full">
                            Airion Event Store
                        </span>
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-none">
                            Elevate Your Event <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">With Premium Goods</span>
                        </h1>
                        <p className="text-neutral-400 text-base max-w-xl leading-relaxed">
                            Discover handpicked luxury centerpieces, custom signs, custom matching apparel, and lighting setups to make your special day absolutely flawless.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-2">
                            <a href="#store-grid" className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/20 text-sm">
                                Browse Collection
                            </a>
                            <button 
                                onClick={() => {
                                    const spotlight = MOCK_PRODUCTS[0];
                                    addToCart(spotlight);
                                    toast.success('Spotlight item added to cart!');
                                }}
                                className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl border border-neutral-700 transition-colors text-sm"
                            >
                                Get Featured Lights (₹1,200)
                            </button>
                        </div>
                    </div>

                    {/* Spotlight Product Banner Card (Glassmorphism) */}
                    <div className="lg:col-span-5 hidden lg:block">
                        <div className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl flex gap-4 items-center">
                            <div className="w-28 h-28 rounded-2xl overflow-hidden bg-neutral-800 flex-shrink-0">
                                <img src="https://images.unsplash.com/photo-1543594680-cb03264c7cc3?q=80&w=600" alt="Spotlight item" className="w-full h-full object-cover" />
                            </div>
                            <div className="space-y-2">
                                <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Store Spotlight</span>
                                <h3 className="font-bold text-white text-sm line-clamp-1">Premium LED Fairy Lights (50m)</h3>
                                <p className="text-neutral-400 text-xs line-clamp-2">Ambient warm lighting for weddings, birthdays, and canopy setups.</p>
                                <div className="flex items-center justify-between pt-1">
                                    <span className="font-black text-white text-sm">₹1,200</span>
                                    <button 
                                        onClick={() => addToCart(MOCK_PRODUCTS[0])}
                                        className="text-xs font-bold text-red-400 hover:text-red-300"
                                    >
                                        Add to Cart →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="store-grid" className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Search & Filter Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pb-6 border-b border-neutral-200/50 dark:border-slate-800">
                    <div>
                        <h2 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">Our Collection</h2>
                        <p className="text-xs text-neutral-500 dark:text-slate-400 mt-1">{filteredProducts.length} items available in category "{selectedCategory}"</p>
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-sm font-semibold text-neutral-950 dark:text-white"
                        />
                    </div>
                </div>

                {/* Categories Tab Bar */}
                <div className="flex overflow-x-auto pb-4 mb-8 gap-2 custom-scrollbar">
                    {CATEGORIES.map(cat => {
                        const count = cat === 'All' ? products.length : products.filter(p => p.category === cat).length;
                        return (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                                    selectedCategory === cat
                                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                                        : 'bg-white dark:bg-slate-900 text-neutral-600 dark:text-slate-300 hover:bg-neutral-50 dark:hover:bg-slate-800 border border-neutral-200 dark:border-slate-800'
                                }`}
                            >
                                {cat}
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                    selectedCategory === cat 
                                        ? 'bg-white/20 text-white' 
                                        : 'bg-neutral-100 dark:bg-slate-800 text-neutral-500 dark:text-slate-400'
                                }`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product, idx) => {
                        const productStock = (product as any).stock || 10;
                        const productRating = (product as any).rating || 4.8;
                        const reviews = (product as any).reviewsCount || 100;
                        return (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white dark:bg-slate-900 rounded-3xl border border-neutral-200/60 dark:border-slate-800 overflow-hidden group hover:shadow-xl hover:border-red-100 dark:hover:border-red-950/20 transition-all duration-300 flex flex-col justify-between"
                            >
                                <div>
                                    <Link to={`/merchandise/${product.id}`} className="block relative aspect-square overflow-hidden bg-neutral-100 dark:bg-slate-800">
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            loading="lazy"
                                        />
                                        <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm text-red-650 dark:text-red-400">
                                            {product.category}
                                        </div>
                                        
                                        {/* Stock Badge */}
                                        <div className={`absolute bottom-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-lg backdrop-blur shadow-sm ${
                                            productStock <= 15
                                                ? 'bg-amber-500/90 text-white'
                                                : 'bg-emerald-500/90 text-white'
                                        }`}>
                                            {productStock <= 15 ? `Only ${productStock} left!` : 'In Stock'}
                                        </div>
                                    </Link>
                                    
                                    <div className="p-5 space-y-2">
                                        <div className="flex items-center gap-1">
                                            <Star className="text-yellow-400 fill-yellow-400 animate-pulse" size={14} />
                                            <span className="text-xs font-bold text-neutral-800 dark:text-slate-350">{productRating}</span>
                                            <span className="text-[10px] text-neutral-400">({reviews} reviews)</span>
                                        </div>
                                        <Link to={`/merchandise/${product.id}`}>
                                            <h3 className="font-bold text-neutral-900 dark:text-white line-clamp-2 hover:text-red-500 transition-colors text-sm min-h-[40px] leading-tight">
                                                {product.title}
                                            </h3>
                                        </Link>
                                        <p className="text-xs text-neutral-500 dark:text-slate-400 line-clamp-2 min-h-[32px] leading-relaxed">
                                            {(product as any).description || 'Elevate your event with this high-quality product.'}
                                        </p>
                                    </div>
                                </div>

                                <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-neutral-100 dark:border-slate-800/60 mt-auto">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Price</span>
                                        <span className="text-lg font-black text-neutral-900 dark:text-white leading-none mt-0.5">₹{product.price.toLocaleString()}</span>
                                    </div>
                                    <button
                                        onClick={(e) => { e.preventDefault(); addToCart(product); toast.success('Added to Cart 🛒'); }}
                                        className="p-3 bg-red-50 dark:bg-red-500/10 text-red-650 hover:bg-red-500 hover:text-white rounded-xl transition-all cursor-pointer border border-red-200/20"
                                        title="Add to Cart"
                                    >
                                        <ShoppingBag size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-neutral-200/60 dark:border-slate-800">
                        <ShoppingBag className="mx-auto text-neutral-300 dark:text-slate-700 mb-4" size={48} />
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">No products found</h3>
                        <p className="text-neutral-500 text-sm">Try adjusting your filters or search query.</p>
                    </div>
                )}
            </div>
        </main>
    );
};

export default Merchandise;
