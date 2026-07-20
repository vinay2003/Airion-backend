import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart, Product } from '../context/CartContext';
import { Star, ShieldCheck, Truck, RefreshCw, ShoppingCart, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

import { fetchProductById } from '../lib/api';
import { useAuth } from '@ease2event/shared';

const MOCK_PRODUCTS: Product[] = [
    {
        id: 'm1',
        title: 'Premium LED Fairy Lights (50m)',
        price: 1200,
        category: 'Decor',
        image: 'https://images.unsplash.com/photo-1729919561898-f4a994c90b0c?w=600&auto=format&fit=crop&q=80',
    },
    {
        id: 'm2',
        title: 'Elegant Floral Centerpiece Set',
        price: 4500,
        category: 'Decor',
        image: 'https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?q=80&w=600',
    },
    {
        id: 'm3',
        title: 'Personalized Welcome Sign (Acrylic)',
        price: 3000,
        category: 'Signage',
        image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=600',
    },
    {
        id: 'm4',
        title: 'Bridal Squad Satin Robes (Pack of 5)',
        price: 7500,
        category: 'Apparel',
        image: 'https://plus.unsplash.com/premium_photo-1706485734742-4a4153f34d2f?w=600&auto=format&fit=crop&q=80&w=600',
    },
    {
        id: 'm5',
        title: 'Vintage Photo Booth Props Kit',
        price: 800,
        category: 'Entertainment',
        image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=600',
    },
    {
        id: 'm6',
        title: 'Custom Engraved Champagne Flutes',
        price: 2200,
        category: 'Gifts',
        image: 'https://images.unsplash.com/photo-1723431620052-46680a65c7b7?w=600&auto=format&fit=crop&q=80',
    },
    {
        id: 'm7',
        title: 'Vintage Metal Lantern Candle Holder',
        price: 1500,
        category: 'Decor',
        image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?q=80&w=600',
    },
    {
        id: 'm8',
        title: 'Groom & Groomsmen Bow Tie Set (Pack of 5)',
        price: 3500,
        category: 'Apparel',
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600',
    },
    {
        id: 'm9',
        title: 'Golden Table Number Stands (Set of 1-20)',
        price: 2500,
        category: 'Signage',
        image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=600',
    },
    {
        id: 'm10',
        title: 'Handmade Scented Soy Candles (Box of 4)',
        price: 1800,
        category: 'Gifts',
        image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=600',
    },
    {
        id: 'm11',
        title: 'Wireless LED Party Uplighter (Rechargeable)',
        price: 5200,
        category: 'Entertainment',
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600',
    },
    {
        id: 'm12',
        title: 'Custom Wooden Photo Guestbook',
        price: 2800,
        category: 'Gifts',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600',
    }
];

const ProductDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState<Product | undefined>(() => MOCK_PRODUCTS.find(p => p.id === id));
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        if (!id) return;
        setLoading(true);
        fetchProductById(id)
            .then((res: any) => {
                if (res) {
                    setProduct({
                        id: res.id,
                        title: res.title,
                        price: Number(res.price),
                        category: res.category,
                        image: res.image || 'https://images.unsplash.com/photo-1729919561898-f4a994c90b0c?w=600&auto=format&fit=crop&q=80'
                    });
                }
            })
            .catch(() => {
                // fallback to mock already set in useState initializer
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    if (loading && !product) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-24 bg-neutral-50 dark:bg-slate-950">
                <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center pt-24">
                <h2 className="text-2xl font-black text-neutral-900 dark:text-white mb-4">Product Not Found</h2>
                <button onClick={() => navigate('/merchandise')} className="px-6 py-2.5 bg-red-500 text-white rounded-xl font-bold">
                    Back to Shop
                </button>
            </div>
        );
    }

    const { user } = useAuth();

    const handleAddToCart = () => {
        if (!user) {
            toast.error('Please login to add items to cart.');
            navigate('/login', { state: { returnTo: `/merchandise/${id}` } });
            return;
        }
        addToCart(product, quantity);
        toast.success(`Added ${quantity} ${product.title} to cart!`);
    };

    return (
        <main className="min-h-screen bg-neutral-50 dark:bg-slate-950 pt-28 pb-16">
            <div className="max-w-6xl mx-auto px-4">
                <button
                    onClick={() => navigate('/merchandise')}
                    className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white font-bold text-sm mb-8 transition-colors"
                >
                    <ArrowLeft size={16} /> Back to Store
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[32px] border border-neutral-200/60 dark:border-slate-800">

                    {/* Left: Image */}
                    <div className="aspect-square rounded-3xl overflow-hidden bg-neutral-100 dark:bg-slate-800 border border-neutral-200/50 dark:border-slate-800">
                        <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                    </div>

                    {/* Right: Info */}
                    <div className="flex flex-col justify-between">
                        <div>
                            <span className="text-xs font-black text-red-500 uppercase tracking-widest bg-red-50 dark:bg-red-500/10 px-3.5 py-1.5 rounded-full">
                                {product.category}
                            </span>

                            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white mt-4 leading-tight">
                                {product.title}
                            </h1>

                            <div className="flex items-center gap-3 mt-4">
                                <div className="flex items-center gap-1">
                                    <Star className="text-yellow-400 fill-yellow-400" size={16} />
                                    <span className="text-sm font-bold text-neutral-800 dark:text-white">4.8</span>
                                </div>
                                <span className="text-neutral-300 dark:text-slate-700">|</span>
                                <span className="text-sm text-neutral-500 font-medium">124 Reviews</span>
                            </div>

                            <p className="text-3xl font-black text-neutral-900 dark:text-white mt-6">
                                ₹{product.price.toLocaleString()}
                            </p>

                            <p className="text-neutral-500 dark:text-slate-400 mt-6 leading-relaxed text-sm">
                                Elevate your event with this high-quality product. Designed to match standard luxury wedding and party decor setups. Durable, beautiful, and easy to set up. Contact support for bulk pricing requirements.
                            </p>
                        </div>

                        <div className="mt-8 pt-8 border-t border-neutral-100 dark:border-slate-800">
                            {/* Quantity Selector */}
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-sm font-bold text-neutral-700 dark:text-slate-300">Quantity:</span>
                                <div className="flex items-center bg-neutral-50 dark:bg-slate-800 rounded-xl p-1 border border-neutral-200 dark:border-slate-700">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="w-8 h-8 flex items-center justify-center font-bold text-neutral-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors"
                                    >
                                        -
                                    </button>
                                    <span className="w-12 text-center font-bold text-neutral-950 dark:text-white">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(q => q + 1)}
                                        className="w-8 h-8 flex items-center justify-center font-bold text-neutral-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* CTAs */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black uppercase tracking-wider text-sm transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-3"
                                >
                                    <ShoppingCart size={18} /> Add to Cart
                                </button>
                            </div>
                        </div>

                        {/* Badges */}
                        <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-neutral-100 dark:border-slate-800">
                            <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-neutral-50/50 dark:bg-slate-900/50 border border-neutral-100 dark:border-slate-800">
                                <Truck size={20} className="text-neutral-600 dark:text-slate-400 mb-1" />
                                <span className="text-[10px] font-bold text-neutral-700 dark:text-slate-300">Free Shipping</span>
                            </div>
                            <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-neutral-50/50 dark:bg-slate-900/50 border border-neutral-100 dark:border-slate-800">
                                <ShieldCheck size={20} className="text-neutral-600 dark:text-slate-400 mb-1" />
                                <span className="text-[10px] font-bold text-neutral-700 dark:text-slate-300">Secure Payment</span>
                            </div>
                            <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-neutral-50/50 dark:bg-slate-900/50 border border-neutral-100 dark:border-slate-800">
                                <RefreshCw size={20} className="text-neutral-600 dark:text-slate-400 mb-1" />
                                <span className="text-[10px] font-bold text-neutral-700 dark:text-slate-300">7-Day Return</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ProductDetails;
