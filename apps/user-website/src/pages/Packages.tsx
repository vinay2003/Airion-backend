import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Star } from 'lucide-react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import FallingPetals from '../components/FallingPetals';

interface Package {
    id: string;
    title: string;
    price: string;
    description: string;
    features: string[];
    isSponsored?: boolean;
    image: string;
    vendor: string;
}

const Packages: React.FC = () => {
    const packages: Package[] = [
        {
            id: 'w-1',
            title: 'Royal Wedding Gold Package',
            price: '₹5,00,000',
            description: 'A complete wedding solution including premium venue, catering for 500 guests, and gold-class decor.',
            features: [
                'Venue: Grand Hotel Ballroom',
                'Catering: 500 Guests (Veg/Non-Veg)',
                'Decor: Premium Floral & Lighting',
                'Photography: Pre-wedding + 2 Day Coverage',
                'Entertainment: Live Band + DJ'
            ],
            isSponsored: true,
            image: 'https://images.unsplash.com/photo-1756190564669-215843660e93?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHJveWFsJTIwd2VkZGluZ3xlbnwwfHwwfHx8MA%3D%3D',
            vendor: 'Grand Hotel & Events'
        },
        {
            id: 'p-1',
            title: 'Intimate Birthday Bash',
            price: '₹50,000',
            description: 'Perfect for small gatherings and birthday celebrations with close friends and family.',
            features: [
                'Venue: Sunset Cafe Rooftop',
                'Catering: 50 Guests (Snacks + Dinner)',
                'Decor: Balloon & Theme Decor',
                'Cake: 3kg Custom Theme Cake',
                'Music: Bluetooth Speaker System'
            ],
            isSponsored: false,
            image: 'https://images.unsplash.com/photo-1744216615372-bbc32acf92c5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHN1bnNldCUyMGNhZmV8ZW58MHx8MHx8fDA%3D',
            vendor: 'Sunset Cafe'
        },
        {
            id: 'c-1',
            title: 'Corporate Seminar Basic',
            price: '₹1,00,000',
            description: 'Standard package for corporate meetings and seminars.',
            features: [
                'Venue: City Conference Hall',
                'Catering: 100 Guests (Hi-Tea + Lunch)',
                'Equipment: Projector, Sound System, Mics',
                'Stationery: Notepads & Pens',
                'Support: Event Coordinator'
            ],
            isSponsored: false,
            image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1000&auto=format&fit=crop',
            vendor: 'City Business Center'
        }
    ];

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-transparent aurora-bg relative transition-colors duration-300 py-12 overflow-x-hidden">
            <FallingPetals />
            <SEO title="Event Packages" description="Explore our curated packages for weddings, birthdays, and corporate events." />

            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">Choose Your Event Package</h1>
                    <p className="text-xl text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Plan your event easily with our affordable packages, We make planning simple and budget-friendly                    </p>
                </div>

                <div className="space-y-12">
                    {/* Sponsored/Featured Section */}
                    {packages.filter(p => p.isSponsored).length > 0 && (
                        <div className="mb-12">
                            <div className="flex items-center gap-2 mb-6">
                                <Star className="text-yellow-500 fill-yellow-500" />
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sponsored Packages</h2>
                            </div>
                            <div className="grid grid-cols-1 gap-8">
                                {packages.filter(p => p.isSponsored).map((pkg) => (
                                    <motion.div
                                        key={pkg.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl border-2 border-yellow-400/50 flex flex-col md:flex-row"
                                    >
                                        <div className="md:w-1/2 h-64 md:h-auto relative">
                                            <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover absolute inset-0" />
                                            <div className="absolute top-4 left-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold shadow-md">
                                                Sponsored
                                            </div>
                                        </div>
                                        <div className="p-8 md:w-1/2 flex flex-col justify-center">
                                            <div className="text-sm text-red-500 font-bold mb-2">{pkg.vendor}</div>
                                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{pkg.title}</h3>
                                            <div className="text-2xl font-bold text-gray-900 dark:text-slate-200 mb-4">{pkg.price}</div>
                                            <p className="text-gray-600 dark:text-slate-400 mb-6">{pkg.description}</p>

                                            <ul className="space-y-3 mb-8">
                                                {pkg.features.map((feature, idx) => (
                                                    <li key={idx} className="flex items-center gap-3 text-gray-700 dark:text-slate-300">
                                                        <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400 flex-shrink-0">
                                                            <Check size={14} />
                                                        </div>
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>

                                            <div className="flex items-center gap-4 mt-auto">
                                                <Link to={`/event/${pkg.id}`} className="flex-1 border-2 border-red-500 text-red-500 py-4 rounded-xl font-bold text-lg text-center hover:bg-red-50 dark:hover:bg-red-900/10 transition-all">
                                                    Details
                                                </Link>
                                                <Link to={`/event/${pkg.id}?booking=true`} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-bold text-lg text-center shadow-lg shadow-red-500/20 transition-all">
                                                    Booking
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Standard Packages */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">More Packages</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {packages.filter(p => !p.isSponsored).map((pkg, idx) => (
                                <motion.div
                                    key={pkg.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-700 flex flex-col"
                                >
                                    <div className="h-48 relative overflow-hidden">
                                        <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="text-xs text-red-500 font-bold mb-2 uppercase tracking-wider">{pkg.vendor}</div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{pkg.title}</h3>
                                        <div className="text-xl font-bold text-gray-900 dark:text-slate-200 mb-4">{pkg.price}</div>
                                        <p className="text-gray-600 dark:text-slate-400 text-sm mb-6 flex-1">{pkg.description}</p>

                                        <ul className="space-y-2 mb-6">
                                            {pkg.features.slice(0, 3).map((feature, fIdx) => (
                                                <li key={fIdx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-slate-400">
                                                    <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                            {pkg.features.length > 3 && (
                                                <li className="text-xs text-gray-400 pl-6 italic">+{pkg.features.length - 3} more items</li>
                                            )}
                                        </ul>

                                        <div className="flex items-center gap-3 mt-auto">
                                            <Link to={`/event/${pkg.id}`} className="flex-1 border-2 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 py-2.5 rounded-xl font-bold text-center text-sm transition-all">
                                                Details
                                            </Link>
                                            <Link to={`/event/${pkg.id}?booking=true`} className="flex-1 bg-red-500 text-white hover:bg-red-600 py-2.5 rounded-xl font-bold text-center text-sm transition-all shadow-md">
                                                Booking
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Custom Package CTA */}
                <div className="mt-20 bg-gray-900 rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-4">Can't find what you're looking for?</h2>
                        <p className="text-gray-400 mb-8 max-w-xl mx-auto">Create a custom package tailored to your specific needs and budget.</p>
                        <Link to="/plan-event" className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors">
                            Build Your Own Package <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Packages;
