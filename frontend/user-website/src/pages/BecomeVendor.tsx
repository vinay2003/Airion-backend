import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, TrendingUp, Users, Wallet } from 'lucide-react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

const BecomeVendor: React.FC = () => {
    return (
        <main className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
            <SEO title="Become a Vendor" description="Join Airion and grow your business. Connect with thousands of customers planning their events." />

            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center bg-gray-900 text-white overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2000&auto=format&fit=crop"
                        alt="Vendor Hero"
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                            Grow Your Business with Airion
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed">
                            Join Bihar's fastest-growing event marketplace. Connect with verified leads and manage bookings effortlessly.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a href="/vendor/signup" className="bg-red-500 hover:bg-red-600 text-white px-10 py-4 rounded-full font-bold text-lg transition-all shadow-lg shadow-red-500/30 flex items-center justify-center gap-2">
                                Register Your Business <ArrowRight size={20} />
                            </a>
                            <Link to="/contact" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-10 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center">
                                Contact Sales
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Benefits Stats */}
            <section className="py-12 bg-gray-50 dark:bg-slate-900 border-y border-gray-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex items-center gap-4 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
                            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <Users size={28} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">10k+</h3>
                                <p className="text-gray-500 dark:text-slate-400">Monthly Visitors</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
                            <div className="w-14 h-14 bg-green-100 dark:bg-green-500/10 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400">
                                <TrendingUp size={28} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">3x</h3>
                                <p className="text-gray-500 dark:text-slate-400">Revenue Growth</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
                            <div className="w-14 h-14 bg-purple-100 dark:bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                                <Wallet size={28} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">0%</h3>
                                <p className="text-gray-500 dark:text-slate-400">Commission on First 10 Booking</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Join */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">Why Partner with Us?</h2>
                        <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">We provide the tools and exposure you need to take your event business to the next level.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: 'Verified Inquiries', desc: 'Stop chasing cold leads. Get detailed inquiries from serious customers ready to book.' },
                            { title: 'Online Showcase', desc: 'Create a stunning portfolio page with photos, videos, pricing, and reviews.' },
                            { title: 'Booking Management', desc: 'Manage your calendar, bookings, and payments all in one powerful dashboard.' },
                            { title: 'Marketing Support', desc: 'Get featured in our newsletters, social media, and top-ranking search results.' },
                            { title: 'Analytics & Insights', desc: 'Track your performance with detailed analytics on views, clicks, and conversion rates.' },
                            { title: 'Secure Payments', desc: 'Receive payments directly to your bank account with our secure payment gateway.' },
                        ].map((item, idx) => (
                            <div key={idx} className="p-8 rounded-3xl bg-gray-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-slate-700 shadow-sm hover:shadow-xl">
                                <div className="w-12 h-12 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 mb-6 font-bold text-xl">
                                    {idx + 1}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                                <p className="text-gray-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="pb-20 px-4 md:px-8">
                <div className="max-w-5xl mx-auto bg-red-600 rounded-3xl p-12 md:p-20 text-center text-white shadow-2xl shadow-red-600/30">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Scale Your Business?</h2>
                    <p className="text-white/90 text-lg md:text-xl mb-10 max-w-2xl mx-auto">Join thousands of successful vendors on Airion today. It takes less than 5 minutes to get started.</p>
                    <a href="/vendor/signup" className="inline-block bg-white text-red-600 px-12 py-5 rounded-full font-bold text-xl hover:bg-gray-100 transition-all shadow-lg hover:scale-105">
                        Join as a Vendor
                    </a>
                    <p className="mt-6 text-sm text-white/70">No credit card required for basic listing</p>
                </div>
            </section>
        </main>
    );
};

export default BecomeVendor;
