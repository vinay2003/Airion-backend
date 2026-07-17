import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartDrawer: React.FC = () => {
    const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice } = useCart();
    const navigate = useNavigate();

    return null;
    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[2000]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
                        className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white dark:bg-slate-900 shadow-2xl z-[2010] flex flex-col border-l border-neutral-200 dark:border-slate-800"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-neutral-100 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="text-red-500" size={24} />
                                <h2 className="text-xl font-black text-neutral-900 dark:text-white">Your Cart</h2>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 hover:bg-neutral-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                            >
                                <X size={20} className="text-neutral-500" />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-24 h-24 bg-neutral-50 dark:bg-slate-800 rounded-full flex items-center justify-center">
                                        <ShoppingBag size={48} className="text-neutral-300 dark:text-slate-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Your cart is empty</h3>
                                    <p className="text-neutral-500 text-sm max-w-[200px]">Looks like you haven't added any merchandise yet.</p>
                                    <button
                                        onClick={() => { setIsCartOpen(false); navigate('/merchandise'); }}
                                        className="px-6 py-2.5 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors"
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                items.map(item => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-24 h-24 rounded-2xl bg-neutral-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start gap-2">
                                                    <h4 className="font-bold text-neutral-900 dark:text-white text-sm line-clamp-2">{item.title}</h4>
                                                    <button onClick={() => removeFromCart(item.id)} className="text-neutral-400 hover:text-red-500 transition-colors">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                                <p className="text-xs text-neutral-500 dark:text-slate-400 mt-1">{item.category}</p>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-3 bg-neutral-50 dark:bg-slate-800 rounded-lg p-1 border border-neutral-200 dark:border-slate-700">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors"
                                                    >
                                                        <Minus size={14} className="text-neutral-600 dark:text-slate-300" />
                                                    </button>
                                                    <span className="text-sm font-bold text-neutral-900 dark:text-white w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors"
                                                    >
                                                        <Plus size={14} className="text-neutral-600 dark:text-slate-300" />
                                                    </button>
                                                </div>
                                                <span className="font-black text-red-500">₹{(item.price * item.quantity).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-neutral-100 dark:border-slate-800 bg-neutral-50/50 dark:bg-slate-900/50">
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-500 dark:text-slate-400">Subtotal</span>
                                        <span className="font-bold text-neutral-900 dark:text-white">₹{totalPrice.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-500 dark:text-slate-400">Taxes & Shipping</span>
                                        <span className="text-neutral-400 italic">Calculated at checkout</span>
                                    </div>
                                    <div className="pt-3 border-t border-neutral-200 dark:border-slate-700 flex justify-between">
                                        <span className="font-bold text-neutral-900 dark:text-white">Total</span>
                                        <span className="font-black text-xl text-red-500">₹{totalPrice.toLocaleString()}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => { setIsCartOpen(false); navigate('/checkout'); }}
                                    className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm transition-colors shadow-lg shadow-red-500/30"
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
