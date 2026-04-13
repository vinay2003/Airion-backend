import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-50 dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-6">
                        <Link to="/" className="text-3xl font-black text-red-500 font-bold tracking-tighter hover:scale-105 transition-transform inline-block">Ease2event</Link>
                        <p className="text-gray-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                            The premier digital ecosystem for event orchestration. Discover, collaborate, and execute flawless experiences with verified vendors.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Instagram, Twitter].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 bg-white dark:bg-slate-800 border border-neutral-100 dark:border-slate-800 rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/10 transition-all">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/about" className="text-gray-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400">About Us</Link></li>
                            <li><Link to="/category/weddings" className="text-gray-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400">Weddings</Link></li>
                            <li><Link to="/category/parties" className="text-gray-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400">Parties</Link></li>
                            <li><Link to="/inspiration" className="text-gray-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400">Inspiration</Link></li>
                        </ul>
                    </div>

                    {/* For Vendors */}
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-4">For Vendors</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/contact" className="text-gray-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400">List Your Business</Link></li>
                            <li><a href="#" className="text-gray-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400">Pricing</a></li>
                            <li><a href="#" className="text-gray-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400">Resources</a></li>
                            <li><a href="#" className="text-gray-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400">Support</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-6">
                        <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-[0.2em]">Contact Node</h4>
                        <ul className="space-y-4 text-sm font-bold text-gray-500 dark:text-slate-400">
                            <li className="flex items-center gap-3 hover:text-red-500 transition-colors cursor-pointer">
                                <Mail size={18} className="text-red-500" />
                                <span>concierge@airion.app</span>
                            </li>
                            <li className="flex items-center gap-3 hover:text-red-500 transition-colors cursor-pointer">
                                <Phone size={18} className="text-red-500" />
                                <span>+91 99999 00000</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-red-500 mt-1 flex-shrink-0" />
                                <span>Enterprise Square, Digital Park,<br />Patna, Bihar 800001</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-slate-800 mt-8 pt-8 text-center text-sm text-gray-600 dark:text-slate-400">
                    <p>&copy; 2024 Ease2event. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
