import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, Loader2, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ContactUs: React.FC = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        subject: 'General Inquiry',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
            await axios.post(`${apiBase}/contacts`, {
                ...formData,
                source: 'aayojan'
            });
            toast.success('Your message has been sent successfully!');
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                subject: 'General Inquiry',
                message: ''
            });
        } catch (error: any) {
            console.error('Contact form error:', error);
            toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

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
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">First Name</label>
                                <input 
                                    name="firstName"
                                    type="text" 
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all" 
                                    placeholder="John" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Last Name</label>
                                <input 
                                    name="lastName"
                                    type="text" 
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all" 
                                    placeholder="Doe" 
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Email Address</label>
                            <input 
                                name="email"
                                type="email" 
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all" 
                                placeholder="john@example.com" 
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Subject</label>
                            <div className="relative">
                                <ChevronDown size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <select 
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all appearance-none"
                                >
                                    <option>General Inquiry</option>
                                    <option>Event Planning</option>
                                    <option>Vendor Partnership</option>
                                    <option>Support</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Message</label>
                            <textarea 
                                name="message"
                                rows={4} 
                                required
                                minLength={10}
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all" 
                                placeholder="How can we help you?"
                            ></textarea>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
