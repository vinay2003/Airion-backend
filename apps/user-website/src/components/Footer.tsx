import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-50 dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 transition-colors duration-300">
            <div className="max-w-[1536px] mx-auto px-4 md:px-8 lg:px-16 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-3 hover:scale-105 transition-transform inline-flex">
                            <img
                                src="/logo.svg"
                                alt="Ease2Event Logo"
                                className="h-12 w-auto object-contain flex-shrink-0 drop-shadow-md"
                            />
                            <span className="text-3xl font-black text-red-500 tracking-tighter">Ease<span className="text-gray-900 dark:text-white">2</span>event</span>
                        </Link>
                        <p className="text-gray-500 dark:text-slate-400 text-[15px] font-medium leading-relaxed">
                            The premier digital ecosystem for event orchestration. Discover, collaborate, and execute flawless experiences with verified vendors.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { Icon: Facebook, href: 'https://www.facebook.com/profile.php?id=61560780569664' },
                                { Icon: Instagram, href: 'https://www.instagram.com/ease2event' },
                            ].map(({ Icon, href }, i) => (
                                <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white dark:bg-slate-800 border border-neutral-100 dark:border-slate-800 rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/10 transition-all">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-[15px]">
                            <li><Link to="/about" className="text-gray-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">About Us</Link></li>
                            <li><Link to="/marketplace?category=weddings" className="text-gray-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">Weddings</Link></li>
                            <li><Link to="/marketplace?category=parties" className="text-gray-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">Parties</Link></li>
                            <li><Link to="/inspiration" className="text-gray-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">Inspiration</Link></li>
                        </ul>
                    </div>

                    {/* For Vendors */}
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-4">For Vendors</h4>
                        <ul className="space-y-2 text-[15px]">
                            <li><Link to="/become-vendor" className="text-gray-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">List Your Business</Link></li>
                            <li><Link to="/packages" className="text-gray-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">Pricing</Link></li>
                            <li><Link to="/become-vendor" className="text-gray-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">Vendor Hub</Link></li>
                            <li><Link to="/contact" className="text-gray-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">Support</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-black text-gray-700 dark:text-white mb-4">Contact</h4>
                        <ul className="space-y-3 text-[15px] font-bold text-gray-500 dark:text-slate-400">
                            <li className="flex items-center gap-3 hover:text-red-500 transition-colors cursor-pointer">
                                <Mail size={18} className="text-red-500" />
                                <span>contact@ease2event.com</span>
                            </li>
                            <li className="flex items-center gap-3 hover:text-red-500 transition-colors cursor-pointer">
                                <Phone size={18} className="text-red-500" />
                                <span>+91 81306 07796</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                                <span>India</span>
                            </li>
                        </ul>
                    </div>
                </div >

                <div className="border-t border-gray-200 dark:border-slate-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600 dark:text-slate-400">
                    <p>&copy; {new Date().getFullYear()} Ease2event. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link to="/privacy" className="hover:text-red-500 transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-red-500 transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div >
        </footer >
    );
};

export default Footer;
