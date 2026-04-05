import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-50 dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <h3 className="text-2xl font-bold text-red-500 font-cursive mb-4">aayojan</h3>
                        <p className="text-gray-600 dark:text-slate-400 text-sm mb-4">
                            Your one-stop platform for discovering and booking the perfect venues and services for every occasion.
                        </p>
                        <div className="flex gap-3">
                            <a href="#" className="w-8 h-8 bg-gray-200 dark:bg-slate-800 rounded-full flex items-center justify-center hover:bg-red-500 dark:hover:bg-red-500 hover:text-white dark:hover:text-white transition-colors">
                                <Facebook size={16} />
                            </a>
                            <a href="#" className="w-8 h-8 bg-gray-200 dark:bg-slate-800 rounded-full flex items-center justify-center hover:bg-red-500 dark:hover:bg-red-500 hover:text-white dark:hover:text-white transition-colors">
                                <Instagram size={16} />
                            </a>
                            <a href="#" className="w-8 h-8 bg-gray-200 dark:bg-slate-800 rounded-full flex items-center justify-center hover:bg-red-500 dark:hover:bg-red-500 hover:text-white dark:hover:text-white transition-colors">
                                <Twitter size={16} />
                            </a>
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
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-4">Contact Us</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-2 text-gray-600 dark:text-slate-400">
                                <Mail size={16} />
                                <span>hello@aayojan.com</span>
                            </li>
                            <li className="flex items-center gap-2 text-gray-600 dark:text-slate-400">
                                <Phone size={16} />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-start gap-2 text-gray-600 dark:text-slate-400">
                                <MapPin size={16} className="mt-1" />
                                <span>Mumbai, Maharashtra, India</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-slate-800 mt-8 pt-8 text-center text-sm text-gray-600 dark:text-slate-400">
                    <p>&copy; 2024 Airion. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
