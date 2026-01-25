import React from 'react';

import { Mail, MapPin, Phone, Send } from 'lucide-react';

const ContactUs: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-6xl w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
                {/* Contact Info Side */}
                <div className="md:w-2/5 bg-gray-900 dark:bg-black text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -ml-32 -mb-32"></div>

                    <div className="relative z-10">
                        <h1 className="text-4xl font-bold mb-6">Let's chat.</h1>
                        <p className="text-gray-400 text-lg mb-12">
                            Tell us about your event, ask a question, or just say hello. We're here to help you create something amazing.
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="bg-white/10 p-3 rounded-xl">
                                    <MapPin size={24} className="text-red-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Visit Us</h3>
                                    <p className="text-gray-400">Kareli, Allahabad<br />Uttar Pradesh, India - 211016</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-white/10 p-3 rounded-xl">
                                    <Mail size={24} className="text-red-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Email Us</h3>
                                    <p className="text-gray-400">support@aayojan.com</p>
                                    <p className="text-gray-400">info@aayojan.com</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-white/10 p-3 rounded-xl">
                                    <Phone size={24} className="text-red-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Call Us</h3>
                                    <p className="text-gray-400">+91 123 456 7890</p>
                                    <p className="text-gray-400">Mon-Fri from 8am to 5pm</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 mt-12">
                        <div className="flex gap-4">
                            {/* Social Icons Placeholder */}
                            <div className="w-10 h-10 bg-white/10 rounded-full hover:bg-red-500 transition-colors cursor-pointer flex items-center justify-center">
                                <span className="font-bold">IG</span>
                            </div>
                            <div className="w-10 h-10 bg-white/10 rounded-full hover:bg-red-500 transition-colors cursor-pointer flex items-center justify-center">
                                <span className="font-bold">TW</span>
                            </div>
                            <div className="w-10 h-10 bg-white/10 rounded-full hover:bg-red-500 transition-colors cursor-pointer flex items-center justify-center">
                                <span className="font-bold">LN</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Side */}
                <div className="md:w-3/5 p-8 md:p-12 bg-white dark:bg-slate-900">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Send us a message</h2>
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">First Name</label>
                                <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all" placeholder="John" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Last Name</label>
                                <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all" placeholder="Doe" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Email Address</label>
                            <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all" placeholder="john@example.com" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Subject</label>
                            <select className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all">
                                <option>General Inquiry</option>
                                <option>Event Planning</option>
                                <option>Vendor Partnership</option>
                                <option>Support</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Message</label>
                            <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all" placeholder="How can we help you?"></textarea>
                        </div>

                        <button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                            <Send size={20} />
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
