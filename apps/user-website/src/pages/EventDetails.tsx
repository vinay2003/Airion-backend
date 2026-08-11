import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { fetchEventById, checkAvailability } from '../lib/api';
import { useAuth } from '@shared/auth';
import { useWishlist } from '../context/WishlistContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import type { Event } from '../types';
import {
    Star, MapPin, Users, Clock, Check, ArrowLeft, Share2, Heart,
    Wifi, Car, Music, Utensils, Camera, Phone, Mail, Instagram,
    Facebook, Twitter, MessageCircle, ChevronRight, ChevronLeft, Calendar, X
} from 'lucide-react';
import { motion } from 'framer-motion';
import BookingModal from '../components/BookingModal';
import toast from 'react-hot-toast';

const getLocalTodayString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

const EventDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { addRecentlyViewed } = useRecentlyViewed();

    const [event, setEvent] = useState<Event | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Booking Widget State
    const [bookingDate, setBookingDate] = useState('');
    const [bookingTime, setBookingTime] = useState('');
    const [guestMode, setGuestMode] = useState(1);

    const [selectedPackage, setSelectedPackage] = useState<string | undefined>(undefined);
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [checkingAvailability, setCheckingAvailability] = useState(false);

    const isLiked = event ? isInWishlist(event.id) : false;

    const handleShare = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const shareData = {
            title: event?.title,
            text: `Check out this stunning venue on Ease2event: ${event?.title}`,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                if ((err as Error).name !== 'AbortError') {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success('Link copied to clipboard!');
                }
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard!');
        }
    };

    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) {
            toast('Please login or sign up for adding in wishlist.', {
                icon: '🔒',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
            return;
        }
        if (!event) return;
        if (!isLiked) {
            addToWishlist(event);
            toast.success('Added to your wishlist!');
        } else {
            removeFromWishlist(event.id);
            toast('Removed from wishlist');
        }
    };

    const handleBookingClick = (packageName?: string) => {
        if (!user) {
            navigate('/login', { state: { redirect: location.pathname } });
            return;
        }
        if (packageName) {
            setSelectedPackage(packageName);
        }
        setIsBookingOpen(true);
    };

    useEffect(() => {
        const loadEvent = async () => {
            if (id) {
                const data = await fetchEventById(id);
                setEvent(data);
                if (data) {
                    addRecentlyViewed(data);
                }
            }
            setLoading(false);
        };
        loadEvent();
    }, [id]);

    useEffect(() => {
        const verifyAvailability = async () => {
            if (bookingDate && event?.vendorId) {
                const todayStr = getLocalTodayString();
                if (bookingDate < todayStr) {
                    setIsAvailable(false);
                    return;
                }
                setCheckingAvailability(true);
                try {
                    const res = await checkAvailability(event.vendorId, bookingDate);
                    setIsAvailable(res.available);
                } catch (err) {
                    setIsAvailable(true); // Fallback to available on error
                    console.error('Availability check failed:', err);
                } finally {
                    setCheckingAvailability(false);
                }
            } else {
                setIsAvailable(null);
            }
        };
        verifyAvailability();
    }, [bookingDate, event?.vendorId]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.get('booking') === 'true' && event) {
            // Automatically trigger booking flow
            if (!user) {
                navigate('/login', { state: { redirect: `${location.pathname}?booking=true` } });
            } else {
                setIsBookingOpen(true);
            }
        }
    }, [location.search, event, user, navigate]);

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
        `https://images.unsplash.com/photo-1773745060497-4cc1df774c72?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fHJveWFsJTIwd2VkZGluZ3xlbnwwfHwwfHx8MA%3D%3D`,
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
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-slate-950 min-h-screen transition-colors duration-300 pb-24 md:pb-0"
        >
            {/* Navbar Placeholder (if you have a global navbar, this might be redundant but ensures spacing) */}
            <div className={`fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 transition-transform duration-300 ${isScrolled ? 'translate-y-0' : '-translate-y-full'}`}>
                <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                    <h2 className="font-bold text-gray-900 dark:text-white truncate max-w-[200px]">{event.title}</h2>
                    <button
                        onClick={() => handleBookingClick()}
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
                        <button
                            onClick={(e) => handleShare(e)}
                            className="p-2.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors text-gray-700 dark:text-slate-300"
                        >
                            <Share2 size={18} />
                        </button>
                        <button
                            onClick={(e) => handleLike(e)}
                            className={`p-2.5 rounded-full transition-all duration-300 cursor-pointer ${isLiked ? 'bg-red-50 text-red-500 border border-red-100 shadow-lg shadow-red-500/10' : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 hover:scale-110'}`}
                        >
                            <Heart size={18} className={isLiked ? 'fill-current' : ''} />
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
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-3 h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-12"
                >
                    <div className="col-span-1 md:col-span-2 row-span-2 relative group cursor-pointer" onClick={() => { setSelectedImage(0); setIsGalleryOpen(true); }}>
                        <img src={portfolioImages[0]} alt="Main" className="w-full h-full object-cover transition-transform duration-700 " />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                    </div>
                    <div className="col-span-1 row-span-1 relative group cursor-pointer" onClick={() => { setSelectedImage(1); setIsGalleryOpen(true); }}>
                        <img src={portfolioImages[1]} alt="Gallery 1" className="w-full h-full object-cover transition-transform duration-700 " />
                    </div>
                    <div className="col-span-1 row-span-1 relative group cursor-pointer" onClick={() => { setSelectedImage(2); setIsGalleryOpen(true); }}>
                        <img src={portfolioImages[2]} alt="Gallery 2" className="w-full h-full object-cover transition-transform duration-700 " />
                    </div>
                    <div className="col-span-1 row-span-1 relative group cursor-pointer" onClick={() => { setSelectedImage(3); setIsGalleryOpen(true); }}>
                        <img src={portfolioImages[3]} alt="Gallery 3" className="w-full h-full object-cover transition-transform duration-700 " />
                    </div>
                    <div className="col-span-1 row-span-1 relative group cursor-pointer overflow-hidden" onClick={() => { setSelectedImage(4); setIsGalleryOpen(true); }}>
                        <img src={portfolioImages[4]} alt="Gallery 4" className="w-full h-full object-cover transition-transform duration-700 " />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[1px] group-hover:backdrop-blur-none transition-all">
                            <span className="text-white font-bold text-lg">+ 12 Photos</span>
                        </div>
                    </div>
                </motion.div>

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
                        {/* Vendor Link Section */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-6 flex items-center justify-between border border-gray-100 dark:border-slate-800"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm">
                                    <img src={event.vendorImage || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=200"} alt={event.vendorName || "Vendor"} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Hosted by {event.vendorName || 'Ease2Event Partner'}</h3>
                                    <p className="text-sm text-gray-500 dark:text-slate-400">Professional Event Partner</p>
                                </div>
                            </div>
                            <Link to={`/vendor/${event.vendorId}`} className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-4 py-2 rounded-lg text-sm font-bold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                                View Profile <ChevronRight size={16} />
                            </Link>
                        </motion.section>

                        {/* About Section */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
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
                        </motion.section>

                        <div className="h-px bg-gray-200 dark:bg-slate-800" />

                        {/* Packages Section */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Pre-built Packages</h2>
                                    <p className="text-gray-500 dark:text-slate-400 text-sm">Select a curated package designed for your convenience.</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {(event?.packages?.length ? event.packages : [
                                    { title: 'Basic', price: '₹49,999', desc: 'Basic venue setup with standard catering for up to 100 guests.', features: ['Venue Access (6 hours)', 'Standard Decor', 'Buffet Catering'] },
                                    { title: 'Premium', price: '₹99,999', desc: 'Premium event layout including professional photography and DJ.', features: ['Venue Access (8 hours)', 'Premium Floral Decor', 'Photography', 'DJ & Sound System'] },
                                    { title: 'Luxury', price: '₹1,49,999', desc: 'The ultimate luxury experience with full-end event planning.', features: ['Full Day Access', 'Luxury Themed Decor', 'Cinematic Videography', 'Gourmet Catering', 'Live Band'] }
                                ]).map((pkg: any, idx: number) => (
                                    <div key={idx} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 transition-all border-gray-100 dark:border-slate-800/80 relative overflow-hidden group flex flex-col h-full">
                                        {idx === 1 && (
                                            <div className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest">
                                                Most Popular
                                            </div>
                                        )}
                                        <div className="mb-5 flex flex-col gap-2">
                                            <span className={`w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${pkg.title.toLowerCase() === 'basic'
                                                ? 'bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 border-slate-200/60 dark:border-slate-800'
                                                : pkg.title.toLowerCase() === 'premium'
                                                    ? 'bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border-rose-100/60 dark:border-rose-900/30'
                                                    : 'bg-amber-50/50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-100/60 dark:border-amber-900/30'
                                                }`}>
                                                {pkg.title}
                                            </span>
                                            <div className="flex items-baseline gap-1 mt-1">
                                                <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{pkg.price}</span>
                                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">/ event</span>
                                            </div>
                                        </div>

                                        <p className="text-xs text-gray-500 dark:text-slate-400 mb-6 min-h-[32px] leading-relaxed">
                                            {pkg.desc}
                                        </p>

                                        <div className="flex-1">
                                            <ul className="space-y-3 mb-6">
                                                {pkg.features.map((feature, fIdx) => (
                                                    <li key={fIdx} className="flex items-start gap-2 text-xs text-gray-600 dark:text-slate-300">
                                                        <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                                                        <span className="font-medium">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <button
                                            onClick={() => handleBookingClick(pkg.title)}
                                            className="w-full mt-auto py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[0.18em] border-2 border-slate-900 dark:border-slate-700 text-slate-900 dark:text-slate-300 group-hover:bg-red-500 group-hover:border-red-500 group-hover:text-white transition-all duration-300 active:scale-[0.97]"
                                        >
                                            Choose {pkg.title}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </motion.section>

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

                        {/* Cancellation Policy */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Cancellation Policy</h2>
                            <div className="bg-gray-50 dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 space-y-4 flex flex-col pt-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-red-100 dark:bg-red-500/10 p-2.5 rounded-full shrink-0">
                                        <X size={20} className="text-red-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white mb-1">Free cancellation for 48 hours</h4>
                                        <p className="text-sm text-gray-600 dark:text-slate-400">Cancel within 48 hours of booking to get a full refund, as long as the event is at least 14 days away.</p>
                                    </div>
                                </div>
                                <div className="h-px bg-gray-200 dark:bg-slate-800 my-2" />
                                <div className="flex items-start gap-4">
                                    <div className="bg-orange-100 dark:bg-orange-500/10 p-2.5 rounded-full shrink-0">
                                        <Calendar size={20} className="text-orange-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white mb-1">Partial refund after 48 hours</h4>
                                        <p className="text-sm text-gray-600 dark:text-slate-400">Cancel up to 7 days before the event for a 50% refund, minus service fees.</p>
                                    </div>
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
                                    <div className="border border-neutral-200 dark:border-slate-700 rounded-xl overflow-hidden bg-transparent">
                                        <div className="grid grid-cols-2 border-b border-neutral-200 dark:border-slate-700">
                                            <div className="p-3 border-r border-neutral-200 dark:border-slate-700">
                                                <label className="block text-[10px] font-black text-neutral-800 dark:text-slate-300 uppercase tracking-wider mb-1">Event Date</label>
                                                <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} className="w-full bg-transparent text-sm font-semibold outline-none text-neutral-900 dark:text-white" />
                                            </div>
                                            <div className="p-3">
                                                <label className="block text-[10px] font-black text-neutral-800 dark:text-slate-300 uppercase tracking-wider mb-1">Status</label>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {checkingAvailability ? (
                                                        <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                                    ) : isAvailable === false ? (
                                                        <span className="text-[10px] font-black text-red-500 uppercase tracking-tighter">Unavailable</span>
                                                    ) : isAvailable === true ? (
                                                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter flex items-center gap-1"><Check size={10} /> Ready</span>
                                                    ) : (
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Select Date</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <label className="block text-[10px] font-black text-neutral-800 dark:text-slate-300 uppercase tracking-wider mb-1">Estimated Guests</label>
                                            <select value={guestMode} onChange={(e) => setGuestMode(Number(e.target.value))} className="w-full bg-transparent text-sm font-semibold outline-none text-neutral-900 dark:text-white appearance-none cursor-pointer">
                                                <option value={1} className="bg-white dark:bg-slate-900 text-neutral-900 dark:text-white">Up to 50 Guests (1x Multiplier)</option>
                                                <option value={1.5} className="bg-white dark:bg-slate-900 text-neutral-900 dark:text-white">50-200 Guests (1.5x Multiplier)</option>
                                                <option value={2} className="bg-white dark:bg-slate-900 text-neutral-900 dark:text-white">200-500 Guests (2x Multiplier)</option>
                                                <option value={3} className="bg-white dark:bg-slate-900 text-neutral-900 dark:text-white">500+ Guests (3x Multiplier)</option>
                                            </select>
                                        </div>
                                    </div>

                                    {isAvailable === false && (
                                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                                            <X size={16} className="text-red-500 shrink-0 mt-0.5" />
                                            <p className="text-[10px] font-bold text-red-600 leading-tight uppercase tracking-tight">This vendor is already booked or unavailable on this date. Please select another slot.</p>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => handleBookingClick()}
                                    disabled={isAvailable === false || checkingAvailability}
                                    className={`w-full py-5 rounded-2xl font-black text-sm tracking-[0.23em] transition-all duration-300 transform active:scale-[0.98] shadow-xl ${isAvailable === false ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-black dark:hover:bg-white text-white dark:hover:text-black shadow-red-500/20'}`}
                                >
                                    {isAvailable === false ? 'Slot Unavailable' : 'Booking'}
                                </button>

                                <p className="text-center text-xs text-gray-500 mt-4">You won't be charged yet</p>

                                <div className="mt-6 flex justify-between text-sm text-gray-600 dark:text-slate-400">
                                    <span className="underline decoration-dotted">{event.price} x {guestMode} base charge</span>
                                    <span>₹{(parseInt(event.price.replace(/\D/g, '')) * guestMode || 0).toLocaleString()}</span>
                                </div>
                                <div className="mt-2 flex justify-between text-sm text-gray-600 dark:text-slate-400">
                                    <span className="underline decoration-dotted">Ease2event Service Fee</span>
                                    <span>₹{(parseInt(event.price.replace(/\D/g, '')) * guestMode * 0.1 || 0).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-slate-800/50 p-4 border-t border-gray-100 dark:border-slate-800 flex justify-between items-center text-sm">
                                <span className="text-gray-900 dark:text-white font-bold">Total Estimate</span>
                                <span className="font-bold text-gray-900 dark:text-white text-lg">
                                    ₹{(parseInt(event.price.replace(/\D/g, '')) * guestMode * 1.1 || 0).toLocaleString()}
                                </span>
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
                    onClick={() => handleBookingClick()}
                    className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] tracking-[0.2em] shadow-xl shadow-red-500/30 italic"
                >
                    Booking
                </button>
            </div>

            <BookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                eventName={event.title}
                price={event.price}
                vendorId={event.vendorId || event.id}
                initialPackage={selectedPackage}
            />
        </motion.div>
    );
};

export default EventDetails;
