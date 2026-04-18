import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Star, MapPin, ShieldCheck, Mail, Phone,
    Share2, Heart, Info, CheckCircle2,
    Loader2, Camera, Instagram, Facebook, Globe,
    Users, Tag, ChevronRight, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const VendorProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [vendor, setVendor] = useState<any>(null);
    const [services, setServices] = useState<any[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const [vendorRes, servicesRes, reviewsRes] = await Promise.all([
                    api.get(`/vendors/${id}`),
                    api.get(`/services?vendorId=${id}`),
                    api.get(`/reviews?vendorId=${id}`).catch(() => ({ data: [] }))
                ]);
                setVendor(vendorRes.data);
                setServices(servicesRes.data);
                setReviews(reviewsRes.data);
            } catch (err) {
                console.error('Failed to load vendor profile');
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchProfile();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-gray-400 text-sm font-medium">Loading profile...</p>
            </div>
        );
    }

    if (!vendor) return <div className="p-20 text-center text-gray-500 font-medium">Vendor not found</div>;

    return (
        <div className="bg-white dark:bg-slate-950 min-h-screen text-slate-900 border-t border-gray-100">
            {/* Hero & Banner */}
            <div className="relative h-[300px] md:h-[450px] w-full overflow-hidden">
                <img
                    src={vendor.portfolioImages?.[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=2000'}
                    className="w-full h-full object-cover"
                    alt={vendor.businessName}
                />
                <div className="absolute inset-0 bg-black/30" />

                <div className="absolute bottom-6 left-0 w-full px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto flex justify-between items-end">
                        <div className="flex gap-4 items-center mb-2">
                            <Button size="sm" variant="secondary" className="rounded-full w-9 h-9 p-0 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white border-none transition-transform hover:scale-105">
                                <Heart size={18} />
                            </Button>
                            <Button size="sm" variant="secondary" className="rounded-full w-9 h-9 p-0 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white border-none transition-transform hover:scale-105">
                                <Share2 size={18} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* Header Info Card */}
                        <div className="card-minimal space-y-8">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                                <div className="space-y-4 border-l-4 border-primary pl-6">
                                    <div className="flex items-center gap-2">
                                        {vendor.isVerified && (
                                            <Badge className="bg-emerald-50 text-emerald-600 border-none text-[9px] font-black uppercase tracking-widest px-2.5 py-1">
                                                <ShieldCheck size={10} className="mr-1 inline" /> VERIFIED VENDOR
                                            </Badge>
                                        )}
                                        <Badge className="bg-indigo-50 text-indigo-500 border-none text-[9px] font-black uppercase tracking-widest px-2.5 py-1">
                                            {vendor.category?.name || 'EXCLUSIVE PARTNER'}
                                        </Badge>
                                    </div>
                                    <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none uppercase">
                                        {vendor.businessName}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.15em]">
                                        <div className="flex items-center gap-2"><MapPin size={14} className="text-primary" /> {vendor.city || 'India'}</div>
                                        <div className="flex items-center gap-2"><Star size={14} className="text-amber-400 fill-amber-400" /> {vendor.rating || '5.0'} <span className="text-[8px] text-slate-300">({vendor.totalReviews || 0})</span></div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Button className="h-10 px-8 rounded-lg font-black text-[10px] uppercase tracking-widest bg-primary text-white hover:scale-105 transition-soft shadow-xl shadow-primary/20">
                                        Book Consultation
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* About Section */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-3 bg-primary rounded-full"></div>
                                <h2 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Operational Narrative</h2>
                            </div>
                            <p className="text-slate-500 font-bold leading-relaxed text-sm max-w-4xl">
                                {vendor.businessDescription || "A professional service dedicated to providing high-quality experiences tailored to your events needs."}
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                                <div className="p-5 bg-gray-50/50 dark:bg-slate-900 rounded-xl border border-gray-100 flex flex-col justify-between h-24">
                                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Tenure</span>
                                    <span className="text-xl font-black text-slate-900">{vendor.yearsInBusiness || '5+'} <span className="text-[10px] text-slate-400 ml-1">YRS</span></span>
                                </div>
                                <div className="p-5 bg-gray-50/50 dark:bg-slate-900 rounded-xl border border-gray-100 flex flex-col justify-between h-24">
                                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Market Status</span>
                                    <span className="text-xl font-black text-emerald-600 uppercase">ACTIVE</span>
                                </div>
                                <div className="p-5 bg-gray-50/50 dark:bg-slate-900 rounded-xl border border-gray-100 flex flex-col justify-between h-24">
                                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Density Node</span>
                                    <span className="text-xl font-black text-slate-900">10-20 <span className="text-[10px] text-slate-400 ml-1">PTR</span></span>
                                </div>
                                <div className="p-5 bg-gray-50/50 dark:bg-slate-900 rounded-xl border border-gray-100 flex flex-col justify-between h-24">
                                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Entry Delta</span>
                                    <span className="text-xl font-black text-slate-900">₹{Number(vendor.averageBookingPrice).toLocaleString()}</span>
                                </div>
                            </div>
                        </section>

                        {/* Gallery Section */}
                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-1 h-3 bg-primary rounded-full"></div>
                                    <h2 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Work Portfolio</h2>
                                </div>
                                <Badge className="bg-slate-50 text-slate-400 border-none text-[9px] font-black uppercase tracking-widest">{vendor.portfolioImages?.length || 0} CELLS</Badge>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                                {vendor.portfolioImages?.map((img: string, i: number) => (
                                    <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 border border-gray-100 group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500">
                                        <img
                                            src={img}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            alt={`Work ${i + 1}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Packages Section */}
                        <section className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-900">Available Packages</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {(services?.[0]?.packages || [
                                    { name: 'Silver', price: vendor.averageBookingPrice, description: 'Essential services for your event basics.' },
                                    { name: 'Gold', price: Number(vendor.averageBookingPrice) * 1.5, isPopular: true, description: 'Premium tier with extended features.' },
                                    { name: 'Platinum', price: Number(vendor.averageBookingPrice) * 2.5, description: 'The full luxury all-inclusive experience.' }
                                ]).map((pkg: any) => (
                                    <div key={pkg.name} className={`flex flex-col p-6 rounded-xl border bg-white relative transition-all duration-300 ${pkg.isPopular ? 'border-primary shadow-lg shadow-primary/5' : 'border-gray-100 shadow-sm'}`}>
                                        {pkg.isPopular && (
                                            <span className="absolute -top-3 left-6 bg-primary text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                                                MOST POPULAR
                                            </span>
                                        )}
                                        <div className="space-y-2 mb-6">
                                            <h3 className="text-lg font-bold text-slate-900">{pkg.name}</h3>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{pkg.description}</p>
                                        </div>
                                        <div className="flex items-baseline gap-1 mb-6">
                                            <span className="text-2xl font-black text-slate-900">₹{Number(pkg.price).toLocaleString()}</span>
                                            <span className="text-[10px] text-slate-400 font-bold">INR</span>
                                        </div>
                                        <div className="space-y-3 mb-8 flex-1">
                                            {['Professional Staff', 'Premium Setup', 'Full Coverage'].map((feat) => (
                                                <div key={feat} className="flex items-center gap-2 text-[11px] text-slate-600 font-bold italic">
                                                    <CheckCircle2 size={12} className="text-emerald-500" />
                                                    <span>{feat}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <Button variant={pkg.isPopular ? 'default' : 'outline'} className={`h-10 w-full rounded-lg text-xs font-black uppercase tracking-widest transition-soft ${pkg.isPopular ? 'bg-primary text-white shadow-md' : 'border-gray-100 text-slate-400 hover:text-primary hover:border-primary'}`}>
                                            BOOK {pkg.name}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Product & Services List */}
                        {services.length > 0 && (
                            <section className="space-y-6">
                                <h2 className="text-xl font-bold text-gray-900">Services Index</h2>
                                <div className="space-y-3">
                                    {services.map((item: any) => (
                                        <div key={item.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-gray-100 rounded-xl shadow-sm hover:border-primary/30 transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-primary/5 group-hover:text-primary transition-all">
                                                    <Tag size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors">{item.title}</h4>
                                                    <p className="text-xs text-gray-500 font-medium">Capacity: {item.guestCapacity || 'N/A'} Guests</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-gray-900">₹{Number(item.basePrice).toLocaleString()}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase">Starting price</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Reviews Section */}
                        <section className="space-y-8 pt-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">Client Reviews</h2>
                                <Button variant="ghost" className="text-sm text-primary font-bold hover:bg-primary/5 rounded-lg px-4 h-9">
                                    View All {reviews.length}
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {reviews.length === 0 ? (
                                    <div className="md:col-span-2 py-10 text-center border-2 border-dashed border-gray-100 rounded-2xl text-gray-400 text-sm font-medium italic">
                                        No reviews yet. Be the first to leave one!
                                    </div>
                                ) : (
                                    reviews.map((rev) => (
                                        <div key={rev.id} className="p-5 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gray-200" />
                                                    <div>
                                                        <h4 className="text-sm font-bold text-gray-900">{rev.userName || 'Verified Guest'}</h4>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{new Date(rev.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-0.5 text-amber-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={12} fill={i < rev.rating ? "currentColor" : "none"} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3 italic">
                                                "{rev.reviewText}"
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Area */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-10 space-y-8">

                            {/* Booking CTA Card */}
                            <div className="card-premium space-y-6 flex flex-col items-center text-center">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Availability Lock</p>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter italic">Secure Your Event</h3>
                                </div>

                                <div className="space-y-4 w-full">
                                    <Button className="w-full h-11 bg-primary text-white rounded-lg font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-soft">
                                        Check Calendar
                                    </Button>
                                    <Button variant="outline" className="w-full h-11 border-gray-100 text-slate-400 rounded-lg font-bold text-xs uppercase tracking-tight hover:bg-gray-50 transition-soft">
                                        Chat with Vendor
                                    </Button>
                                </div>

                                <div className="pt-6 border-t border-gray-100 space-y-4">
                                    <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-wide px-1">
                                        <span>Official Handle</span>
                                        <div className="flex gap-4">
                                            <Instagram size={18} className="cursor-pointer hover:text-pink-500 transition-colors" />
                                            <Globe size={18} className="cursor-pointer hover:text-indigo-500 transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Info & Policy Card */}
                            <div className="bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 p-6 space-y-4">
                                <h4 className="flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-widest">
                                    <Info size={14} className="text-primary" /> Store Policies
                                </h4>
                                <ul className="space-y-3">
                                    {[
                                        '20% Advance to confirm date',
                                        'Free cancellation up to 14 days',
                                        'GST invoice provided for all bookings'
                                    ].map(p => (
                                        <li key={p} className="flex items-start gap-2 text-xs text-gray-500 font-medium leading-relaxed">
                                            <CheckCircle2 size={12} className="text-emerald-500 mt-0.5" />
                                            {p}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default VendorProfile;
