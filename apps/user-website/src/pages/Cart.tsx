import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';

const Cart: React.FC = () => {
    const { items, removeFromCart, updateQuantity, totalPrice } = useCart();
    const navigate = useNavigate();

    return (
        <main className="min-h-screen bg-neutral-50 dark:bg-slate-950 pt-28 pb-16">
            <div className="max-w-5xl mx-auto px-4">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/merchandise')}
                    className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white font-bold text-sm mb-6 transition-colors"
                >
                    <ArrowLeft size={16} /> Back to Store
                </button>

                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight mb-8">
                    Your Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
                </h1>

                {items.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-xl border border-neutral-250/60 dark:border-slate-800 space-y-4">
                        <div className="w-16 h-16 bg-neutral-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                            <ShoppingBag size={28} className="text-neutral-400 dark:text-slate-500" />
                        </div>
                        <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Your cart is empty</h3>
                        <p className="text-neutral-500 text-sm max-w-sm mx-auto">
                            You haven't added any premium merchandise products to your cart yet.
                        </p>
                        <Link
                            to="/merchandise"
                            className="inline-block px-6 py-2.5 bg-red-650 text-white font-bold rounded-lg text-xs tracking-wider uppercase"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left: Cart Items List */}
                        <div className="lg:col-span-8 space-y-4">
                            {items.map(item => (
                                <div
                                    key={item.id}
                                    className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-xl border border-neutral-200 dark:border-slate-800 flex gap-4"
                                >
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-neutral-100 dark:bg-slate-800 flex-shrink-0">
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                    </div>
                                    
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start gap-2">
                                                <h4 className="font-bold text-neutral-900 dark:text-white text-sm line-clamp-1">
                                                    {item.title}
                                                </h4>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-neutral-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <p className="text-xs text-neutral-500 dark:text-slate-400 mt-1">{item.category}</p>
                                        </div>

                                        <div className="flex items-center justify-between mt-4">
                                            {/* Quantity Selector */}
                                            <div className="flex items-center gap-2.5 bg-neutral-50 dark:bg-slate-800 rounded-lg p-1 border border-neutral-200 dark:border-slate-700">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors"
                                                >
                                                    <Minus size={12} className="text-neutral-600 dark:text-slate-350" />
                                                </button>
                                                <span className="text-xs font-bold text-neutral-900 dark:text-white w-4 text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors"
                                                >
                                                    <Plus size={12} className="text-neutral-600 dark:text-slate-350" />
                                                </button>
                                            </div>
                                            <span className="font-bold text-sm text-neutral-900 dark:text-white">
                                                ₹{(item.price * item.quantity).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Right: Cart Summary Card */}
                        <div className="lg:col-span-4">
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-neutral-200 dark:border-slate-800 space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">Order Summary</h3>
                                
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-500 dark:text-slate-400">Subtotal</span>
                                        <span className="font-bold text-neutral-900 dark:text-white">₹{totalPrice.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-neutral-500 dark:text-slate-400">Taxes & Shipping</span>
                                        <span className="text-neutral-400 italic">Calculated at checkout</span>
                                    </div>
                                    
                                    <div className="pt-3 border-t border-neutral-200 dark:border-slate-800 flex justify-between text-base">
                                        <span className="font-bold text-neutral-900 dark:text-white">Total</span>
                                        <span className="font-bold text-neutral-900 dark:text-white">
                                            ₹{totalPrice.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate('/checkout')}
                                    className="w-full py-3.5 bg-red-650 hover:bg-red-700 text-white rounded-lg font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    Proceed to Checkout <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default Cart;
