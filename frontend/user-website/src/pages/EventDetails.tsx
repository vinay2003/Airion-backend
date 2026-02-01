import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchEventById } from '../lib/api';
import type { Event } from '../types';
import {
    Star, MapPin, Users, Clock, Check, ArrowLeft, Share2, Heart,
    Wifi, Car, Music, Utensils, Camera, Phone, Mail, Instagram,
    Facebook, Twitter, MessageCircle, ChevronRight, ChevronLeft, Calendar, X
} from 'lucide-react';
import BookingModal from '../components/BookingModal';

const EventDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [event, setEvent] = useState<Event | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const loadEvent = async () => {
            if (id) {
                const data = await fetchEventById(id);
                setEvent(data);
            }
            setLoading(false);
        };
        loadEvent();
    }, [id]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Event not found</h2>
                    <Link to="/" className="text-red-500 hover:underline">Return to Home</Link>
                </div>
            </div>
        );
    }

    const portfolioImages = [
        event.image,
        `https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1000&auto=format&fit=crop`,
        `https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1000&auto=format&fit=crop`,
        `https://images.unsplash.com/photo-1587271407850-8d43891882c0?q=80&w=1000&auto=format&fit=crop`,
        `https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop`,
    ];

    const amenities = [
        { icon: Wifi, label: 'High-Speed Wi-Fi', available: true },
        { icon: Car, label: 'Valet Parking', available: true },
        { icon: Music, label: 'Premium Audio', available: true },
        { icon: Utensils, label: 'In-house Catering', available: true },
        { icon: Camera, label: 'Photography Allowed', available: true },
        { icon: Users, label: 'Wheelchair Accessible', available: true },
    ];

    return (
        <div className="bg-white dark:bg-slate-950 min-h-screen transition-colors duration-300 pb-24 md:pb-0">
            {/* Navbar Placeholder (if you have a global navbar, this might be redundant but ensures spacing) */}
            <div className={`fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 transition-transform duration-300 ${isScrolled ? 'translate-y-0' : '-translate-y-full'}`}>
                <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                    <h2 className="font-bold text-gray-900 dark:text-white truncate max-w-[200px]">{event.title}</h2>
                    <button
                        onClick={() => setIsBookingOpen(true)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md"
                    >
                        Book Now
                    </button>
                </div>
            </div>

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-8">
                {/* Breadcrumbs & Back */}
                <div className="flex justify-between items-center mb-6">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors font-medium"
                    >
                        <ArrowLeft size={20} />
                        <span>Back</span>
                    </Link>
                    <div className="flex gap-3">
                        <button className="p-2.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors text-gray-700 dark:text-slate-300">
                            <Share2 size={18} />
                        </button>
                        <button className="p-2.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors text-gray-700 dark:text-slate-300">
                            <Heart size={18} />
                        </button>
                    </div>
                </div>

                {/* Title Block */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                        {event.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 md:gap-8 text-sm md:text-base text-gray-600 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                            <MapPin size={18} className="text-red-500" />
                            <span className="underline decoration-dotted underline-offset-4">{event.location}, India</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star size={18} className="text-yellow-500 fill-yellow-500" />
                            <span className="font-bold text-gray-900 dark:text-white">{event.rating}</span>
                            <span>({event.reviews} reviews)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users size={18} className="text-blue-500" />
                            <span>{event.capacity || '500+'} Guests</span>
                        </div>
                    </div>
                </div>

                {/* Masonry Gallery */}
                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-3 h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-12">
                    <div className="col-span-1 md:col-span-2 row-span-2 relative group cursor-pointer" onClick={() => { setSelectedImage(0); setIsGalleryOpen(true); }}>
                        <img src={portfolioImages[0]} alt="Main" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                    </div>
                    <div className="col-span-1 row-span-1 relative group cursor-pointer" onClick={() => { setSelectedImage(1); setIsGalleryOpen(true); }}>
                        <img src={portfolioImages[1]} alt="Gallery 1" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <div className="col-span-1 row-span-1 relative group cursor-pointer" onClick={() => { setSelectedImage(2); setIsGalleryOpen(true); }}>
                        <img src={portfolioImages[2]} alt="Gallery 2" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <div className="col-span-1 row-span-1 relative group cursor-pointer" onClick={() => { setSelectedImage(3); setIsGalleryOpen(true); }}>
                        <img src={portfolioImages[3]} alt="Gallery 3" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <div className="col-span-1 row-span-1 relative group cursor-pointer overflow-hidden" onClick={() => { setSelectedImage(4); setIsGalleryOpen(true); }}>
                        <img src={portfolioImages[4]} alt="Gallery 4" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[1px] group-hover:backdrop-blur-none transition-all">
                            <span className="text-white font-bold text-lg">+ 12 Photos</span>
                        </div>
                    </div>
                </div>

                {/* Lightbox Modal */}
                {isGalleryOpen && (
                    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
                        <button
                            onClick={() => setIsGalleryOpen(false)}
                            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors p-2"
                        >
                            <X size={32} />
                        </button>

                        <button
                            onClick={(e) => { e.stopPropagation(); setSelectedImage((prev) => (prev === 0 ? portfolioImages.length - 1 : prev - 1)); }}
                            className="absolute left-4 text-white/50 hover:text-white transition-colors p-2"
                        >
                            <ChevronLeft size={48} />
                        </button>

                        <img
                            src={portfolioImages[selectedImage]}
                            alt={`Gallery ${selectedImage + 1}`}
                            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
                        />

                        <button
                            onClick={(e) => { e.stopPropagation(); setSelectedImage((prev) => (prev === portfolioImages.length - 1 ? 0 : prev + 1)); }}
                            className="absolute right-4 text-white/50 hover:text-white transition-colors p-2"
                        >
                            <ChevronRight size={48} />
                        </button>

                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[80vw] py-2">
                            {portfolioImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => { e.stopPropagation(); setSelectedImage(idx); }}
                                    className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-red-500 scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Content */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* About Section */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About this venue</h2>
                            <p className="text-gray-600 dark:text-slate-400 leading-relaxed text-lg">
                                {event.description || `${event.title} is a premier destination for those seeking elegance and style. Nestled in the heart of ${event.location}, this venue offers a perfect blend of modern amenities and classic charm, making it an ideal choice for weddings, corporate gatherings, and social celebrations.`}
                            </p>
                            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                                {amenities.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800">
                                        <item.icon size={20} className="text-gray-500 dark:text-slate-400" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-slate-300">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="h-px bg-gray-200 dark:bg-slate-800" />

                        {/* Location Section */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Location</h2>
                            <div className="bg-gray-100 dark:bg-slate-800 rounded-2xl h-80 overflow-hidden shadow-lg border border-gray-200 dark:border-slate-700 relative">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    scrolling="no"
                                    marginHeight={0}
                                    marginWidth={0}
                                    src={`https://maps.google.com/maps?q=${encodeURIComponent(event.location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                                    className="filter grayscale hover:grayscale-0 transition-all duration-500"
                                ></iframe>
                                <div className="absolute bottom-4 left-4 bg-white dark:bg-slate-900 px-4 py-2 rounded-full shadow-md flex items-center gap-2 pointer-events-none">
                                    <MapPin className="text-red-500" size={16} />
                                    <span className="font-bold text-sm text-gray-900 dark:text-white">{event.location}</span>
                                </div>
                            </div>
                        </section>

                        <div className="h-px bg-gray-200 dark:bg-slate-800" />

                        {/* Reviews Preview */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Guest Reviews</h2>
                                <div className="flex items-center gap-2">
                                    <Star className="text-yellow-500 fill-yellow-500" size={24} />
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{event.rating}</span>
                                    <span className="text-gray-500 dark:text-slate-400">/ 5.0</span>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                {[1, 2].map((_, i) => (
                                    <div key={i} className="bg-gray-50 dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-700" />
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white">Rahul Sharma</p>
                                                <p className="text-xs text-gray-500">October 2023</p>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed">
                                            "Absolutely stunning venue! The staff was incredibly helpful and the arrangements were top-notch. Highly recommended for weddings."
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Sidebar - Sticky Booking Widget */}
                    <div className="lg:col-span-1 relative">
                        <div className="sticky top-24 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 overflow-hidden">
                            <div className="p-6">
                                <div className="flex justify-between items-end mb-6">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">Starting from</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-bold text-gray-900 dark:text-white">{event.price}</span>
                                            <span className="text-sm text-gray-500">/ event</span>
                                        </div>
                                    </div>
                                    <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded text-xs font-bold">
                                        Available
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
                                        <div className="grid grid-cols-2 border-b border-gray-200 dark:border-slate-700">
                                            <div className="p-3 border-r border-gray-200 dark:border-slate-700">
                                                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase mb-1">Check-in</label>
                                                <input type="date" className="w-full bg-transparent text-sm font-medium outline-none text-gray-900 dark:text-white" />
                                            </div>
                                            <div className="p-3">
                                                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase mb-1">Check-out</label>
                                                <input type="date" className="w-full bg-transparent text-sm font-medium outline-none text-gray-900 dark:text-white" />
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase mb-1">Guests</label>
                                            <select className="w-full bg-transparent text-sm font-medium outline-none text-gray-900 dark:text-white">
                                                <option>100-200 Guests</option>
                                                <option>200-500 Guests</option>
                                                <option>500+ Guests</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setIsBookingOpen(true)}
                                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-red-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Check Availability
                                </button>

                                <p className="text-center text-xs text-gray-500 mt-4">You won't be charged yet</p>
                            </div>

                            <div className="bg-gray-50 dark:bg-slate-800/50 p-4 border-t border-gray-100 dark:border-slate-800 flex justify-between items-center text-sm">
                                <span className="text-gray-600 dark:text-slate-400 font-medium">Total Estimate</span>
                                <span className="font-bold text-gray-900 dark:text-white">{event.price} + taxes</span>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <button className="text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white text-sm font-medium flex items-center justify-center gap-2 mx-auto transition-colors">
                                <MessageCircle size={16} />
                                Contact Host
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Fixed Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 p-4 md:hidden z-50 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
                <div>
                    <p className="text-base font-bold text-gray-900 dark:text-white">{event.price}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Total before taxes</p>
                </div>
                <button
                    onClick={() => setIsBookingOpen(true)}
                    className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-red-500/30"
                >
                    Reserve
                </button>
            </div>

            <BookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                eventName={event.title}
                price={event.price}
            />
        </div>
    );
};

export default EventDetails;
