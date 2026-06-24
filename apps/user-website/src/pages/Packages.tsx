import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Star, ChevronRight, Crown, Gem, Sparkles, Calendar, Users, ArrowRight, Phone, Mail } from 'lucide-react';
import SEO from '../components/SEO';
import FallingPetals from '../components/FallingPetals';
import { useNavigate } from 'react-router-dom';
import { useRazorpay } from '../hooks/useRazorpay';
import { toast } from 'react-hot-toast';

const packages = [
  {
    id: 'silver',
    tier: 'Essential',
    name: 'Silver Wedding',
    badge: null,
    icon: Star,
    color: 'from-slate-400 to-slate-600',
    accent: 'slate',
    borderColor: 'border-slate-200 dark:border-slate-700',
    days: '3 Days',
    guests: 'Up to 200 Guests',
    price: '₹2L – ₹6L',
    priceNote: 'complete package',
    events: [
      { day: 'Day 1', name: 'Engagement / Roka Night' },
      { day: 'Day 3', name: 'Haldi Sundowner' },
      { day: 'Day 5', name: 'Wedding Ceremony' },
    ],
    features: [
      'Dedicated Wedding Coordinator',
      'Vendor Matching & Allocation',
      'Digital Invitation Suite',
      'Guest Management Portal',
      'Priority Support',
    ],
    popular: false,
  },
  {
    id: 'gold',
    tier: 'Premium',
    name: 'Gold Wedding',
    badge: 'Most Popular',
    icon: Crown,
    color: 'from-amber-400 to-orange-500',
    accent: 'amber',
    borderColor: 'border-amber-300 dark:border-amber-500/50',
    days: '5 Days',
    guests: 'Up to 350 Guests',
    price: '₹5L – ₹15L',
    priceNote: 'complete package',
    events: [
      { day: 'Day 1', name: 'Engagement / Roka Night' },
      { day: 'Day 2', name: 'Mehendi Carnival' },
      { day: 'Day 3', name: 'Haldi Sundowner' },
      { day: 'Day 4', name: 'Sangeet Concert Night' },
      { day: 'Day 5', name: 'Wedding Ceremony' },
    ],
    features: [
      'Senior Wedding Manager',
      'Priority Vendor Allocation',
      'Premium Decor Coordination',
      'Photography & Videography',
      'Catering Menu Curation',
      'Budget Tracking Dashboard',
    ],
    popular: true,
  },
  {
    id: 'platinum',
    tier: 'Luxury',
    name: 'Platinum Wedding',
    badge: null,
    icon: Gem,
    color: 'from-violet-500 to-purple-700',
    accent: 'violet',
    borderColor: 'border-violet-300 dark:border-violet-500/50',
    days: '7 Days',
    guests: 'Up to 500 Guests',
    price: '₹10L – ₹25L+',
    priceNote: 'complete package',
    events: [
      { day: 'Day 1', name: 'Engagement / Roka Night' },
      { day: 'Day 2', name: 'Mehendi Carnival' },
      { day: 'Day 3', name: 'Haldi Sundowner' },
      { day: 'Day 4', name: 'Sangeet Concert Night' },
      { day: 'Day 5', name: 'Wedding Ceremony' },
      { day: 'Day 6', name: 'After Party / Brunch' },
    ],
    features: [
      'All 6 Wedding Days Included',
      'Pre-wedding Cinematic Shoot',
      'Dedicated Wedding Manager',
      'Makeup + Styling (3 Days)',
      'Luxury Venue Sourcing',
      'Full Vendor Coordination',
      'Live Streaming Setup',
      'Honeymoon Planning Assist',
    ],
    popular: false,
  },
];

const experiences = [
  {
    id: 1,
    category: 'WEDDING',
    tagline: 'DAY 1 · KICKOFF',
    title: 'Engagement / Roka Night',
    price: '₹80,000 – ₹1.5L',
    guests: '100 – 150 Guests',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&auto=format&fit=crop&q=100&dpr=2',
    features: [
      '12x8 ft floral stage backdrop with LED signage',
      'DJ console 4 hrs + soft background music',
      '1 Photographer + 1 Videographer, 150–200 edited photos',
      '6–8 item buffet + live snack counter',
      '2 event coordinators + basic sound'
    ],
    addons: 'Couple entry effects (+₹15K–₹25K) · Live singer (+₹10K–₹30K)'
  },
  {
    id: 2,
    category: 'WEDDING',
    tagline: 'DAY 2 · COLOUR & CULTURE',
    title: 'Mehendi Carnival',
    price: '₹80,000 – ₹2L',
    guests: '80 – 120 Guests',
    image: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?w=1200&auto=format&fit=crop&q=100&dpr=2',
    features: [
      'Boho theme decor — low seating, cushions, umbrellas',
      'Mehendi stage 8x8 ft + photo booth corner',
      'Folk singer / acoustic band 2–3 hrs',
      'Light snacks + mocktails + welcome drinks',
      '2 mehendi artists (bridal + guests) + 1 coordinator'
    ],
    addons: 'Floral jewellery set (+₹2K–₹5K) · Extra mehendi artists'
  },
  {
    id: 3,
    category: 'WEDDING',
    tagline: 'DAY 3 · VIBE MOMENT',
    title: 'Haldi Sundowner',
    price: '₹1.5L – ₹4L',
    guests: '80 – 120 Guests',
    image: 'https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?w=1200&auto=format&fit=crop&q=100&dpr=2',
    features: [
      'Yellow floral theme decor + haldi seating stage',
      'Props — sunglasses, floral jewellery',
      'Dhol (2 artists) + DJ 2 hrs',
      'Drone shoot + slow-motion reels, 2 reels + album',
      '6-item snack buffet + traditional drinks (lassi, aam panna)'
    ],
    addons: 'Pool haldi setup (+₹10K–₹20K) · Rain dance (+₹15K–₹30K)'
  },
  {
    id: 4,
    category: 'WEDDING',
    tagline: 'DAY 4 · THE CONCERT',
    title: 'Sangeet Concert Night',
    price: '₹2.5L – ₹7L',
    guests: '200 – 300 Guests',
    image: 'https://plus.unsplash.com/premium_photo-1682092592909-8d26686e7f5e?w=1200&auto=format&fit=crop&q=90&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fHNhbmdlZXQlMjBjZXJlbW9ueXxlbnwwfHwwfHx8MA%3D%3D',
    features: [
      '20x12 ft LED stage + dance floor + lighting rig',
      'DJ 5 hrs + Choreographer (3–4 sessions)',
      '2 photographers + 1 videographer, full event video + teaser reel',
      '10–15 item buffet + live counters (pasta / tandoor)',
      'Stage crew + light technicians + 4 coordinators'
    ],
    addons: 'Cold pyro entry (+₹15K–₹30K) · LED wall upgrade'
  },
  {
    id: 5,
    category: 'WEDDING',
    tagline: 'DAY 5 · THE MAIN EVENT',
    title: 'Royal Wedding Day',
    price: '₹4L – ₹12L',
    guests: '300 – 500 Guests',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=100&dpr=2',
    features: [
      'Premium mandap (custom theme) + entrance gate + pathway decor',
      'Bharat band / DJ + ghodi + shehnai during rituals',
      'Full media team — 2–3 photographers + cinematographer + drone',
      '20–30 item multi-cuisine buffet + dessert counters',
      '6–8 event staff + guest management + valet (optional)'
    ],
    addons: 'Bridal/groom entry theme (+₹20K–₹1L) · Luxury car entry'
  },
  {
    id: 6,
    category: 'WEDDING',
    tagline: 'DAY 6 · GRAND FINALE',
    title: 'Reception Gala Night',
    price: '₹2L – ₹8L',
    guests: '300 – 500 Guests',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&auto=format&fit=crop&q=100&dpr=2',
    features: [
      'Luxury reception stage + LED backdrop + spotlight',
      'DJ / live band + grand couple entry show',
      'Reception photoshoot + full guest coverage',
      'Premium dinner buffet + dessert & beverage section',
      '4–6 staff + professional stage management'
    ],
    addons: 'Cold pyro mist (+₹15K) · Live singer (+₹15K–₹50K)'
  },
  {
    id: 7,
    category: 'PARTIES',
    tagline: 'BIRTHDAY · PRIVATE',
    title: 'Luxury House Party',
    price: '₹50,000 – ₹1.5L',
    guests: 'Up to 50 Guests',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&auto=format&fit=crop&q=100&dpr=2',
    features: [
      'Professional DJ + ambient lighting (warm + neon mix)',
      'Bartender + mocktail bar + premium snack platters',
      'Photographer + reel creator (same-day delivery)',
      'Spotify curated playlist + desi cocktail fusion (paan shots / aam panna)'
    ],
    addons: 'Neon LED signage (+₹5K) · Polaroid booth (+₹8K)'
  },
  {
    id: 8,
    category: 'COUPLE',
    tagline: 'COUPLE · PROPOSAL',
    title: 'Filmy Proposal',
    price: '₹25,000 – ₹50,000',
    guests: 'Intimate Setup',
    image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=1200&auto=format&fit=crop&q=100&dpr=2',
    features: [
      'Private romantic setup — "Marry Me" neon + rose petal aisle',
      'Candlelight dining experience',
      'Hidden photographer + cinematic reel',
      'Shayari moment / violin music cultural add-on'
    ],
    addons: 'Rooftop venue (+₹10K) · Flower wall (+₹5K)'
  },
  {
    id: 9,
    category: 'FAMILY',
    tagline: 'FAMILY · BABY SHOWER',
    title: 'Modern Godh Bharai',
    price: '₹50,000 – ₹2L',
    guests: '30 – 80 Guests',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&auto=format&fit=crop&q=100&dpr=2',
    features: [
      'Pastel decor + floral stage + balloon arch',
      'Fun games + professional anchor/host',
      'Photographer + reel coverage',
      'Catering + dessert table + gift hampers',
      'Traditional rituals with modern styling'
    ],
    addons: 'Slumber rental (+₹5K) · Custom name signage (+₹3K)'
  }
];

const flowSteps = [
  { step: 1, title: 'Select Package', desc: 'Choose your ideal wedding bundle based on days, guests & budget.' },
  { step: 2, title: 'Fill Details', desc: 'Share your wedding date, venue preference and guest count.' },
  { step: 3, title: 'Consultation Call', desc: 'Our wedding manager calls within 24 hrs to discuss your vision.' },
  { step: 4, title: 'Vendor Matching', desc: 'We curate and allocate verified vendors per your requirements.' },
  { step: 5, title: 'Confirm & Pay', desc: 'Lock your package with a small token amount. Pay rest in installments.' },
  { step: 6, title: 'Your Perfect Wedding', desc: 'Sit back and enjoy while we handle everything end-to-end.' },
];

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  date: string;
  guests: string;
  city: string;
  message: string;
}

const BookingModal: React.FC<{ pkg: typeof packages[0]; onClose: () => void }> = ({ pkg, onClose }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<BookingFormData>({ name: '', email: '', phone: '', date: '', guests: '', city: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const { openCheckout, loading: checkoutLoading } = useRazorpay();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate a token amount (e.g., 5% of the lower range)
    // For demo, using a fixed amount or derived from pkg.price
    const priceStr = pkg.price.replace(/[^\d]/g, '');
    const basePrice = parseInt(priceStr.substring(0, 1) + '00000') || 10000;
    const tokenAmount = Math.max(basePrice * 0.05, 5000); // 5% or 5000 min

    openCheckout(tokenAmount, {
      description: `Token for ${pkg.name}`,
      userName: form.name,
      userEmail: form.email,
      userPhone: form.phone,
      onSuccess: () => {
        setSubmitted(true);
        toast.success('Payment verified! Redirecting...');
        setTimeout(() => {
          navigate('/booking-confirmation', {
            state: {
              eventName: pkg.name,
              date: form.date,
              time: '10:00 AM',
              guests: form.guests,
              package: pkg.tier,
              occasion: 'Wedding',
              addons: [],
              total: tokenAmount,
            }
          });
        }, 2000);
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${pkg.color} p-6 relative`}>
          <button onClick={onClose} className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-1.5 transition-all">
            <X size={18} />
          </button>
          <div className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">{pkg.tier}</div>
          <h3 className="text-2xl font-black text-white">{pkg.name}</h3>
          <p className="text-white/80 text-sm mt-1">{pkg.days} · {pkg.guests} · {pkg.price}</p>
        </div>

        {submitted ? (
          <div className="p-10 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-green-500" />
            </div>
            <h4 className="text-xl font-black text-gray-900 dark:text-white mb-2">Request Received!</h4>
            <p className="text-gray-500 dark:text-slate-400 text-sm mb-6">Our wedding manager will call you within 24 hours to discuss your dream wedding.</p>
            <button onClick={onClose} className="bg-red-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-600 transition-colors">
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-2">
              {[1, 2].map(s => (
                <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${step >= s ? 'bg-red-500' : 'bg-gray-200 dark:bg-slate-700'}`} />
              ))}
            </div>
            <p className="text-xs text-gray-400 font-medium">Step {step} of 2</p>

            {step === 1 ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Full Name *</label>
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500"
                    placeholder="Your full name" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Phone *</label>
                    <input required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500"
                      placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Email *</label>
                    <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500"
                      placeholder="you@email.com" />
                  </div>
                </div>
                <button type="button" onClick={() => { if (form.name && form.phone && form.email) setStep(2); }}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                  Continue <ChevronRight size={18} />
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Wedding Date *</label>
                    <input required type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                      className="w-full border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Guest Count *</label>
                    <input required value={form.guests} onChange={e => setForm(f => ({ ...f, guests: e.target.value }))}
                      className="w-full border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500"
                      placeholder="e.g. 200" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">City / Venue Preference</label>
                  <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                    className="w-full border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500"
                    placeholder="e.g. Patna, Delhi, Mumbai" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Special Requirements</label>
                  <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={3}
                    className="w-full border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 resize-none"
                    placeholder="Tell us about your dream wedding..." />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)}
                    className="flex-1 border-2 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 py-3 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                    Back
                  </button>
                  <button type="submit" disabled={checkoutLoading}
                    className="flex-2 flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold transition-colors disabled:opacity-50">
                    {checkoutLoading ? 'Processing...' : 'Confirm & Pay Now ✨'}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </motion.div>
    </motion.div>
  );
};

const Packages: React.FC = () => {
  const [selectedPkg, setSelectedPkg] = useState<typeof packages[0] | null>(null);
  const [activeFilter, setActiveFilter] = useState('ALL EVENTS');
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300 overflow-x-hidden">
      <FallingPetals />
      <SEO title="Wedding Packages — Bundle & Save" description="Book multiple wedding days together and enjoy priority vendor allocation, a dedicated wedding manager, and exclusive pricing." />

      {/* ── Hero ── */}
      <section className="relative h-[90vh] flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=3840&auto=format&fit=crop&q=100&dpr=2"
            alt="Luxury Wedding"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/80" />
        </div>


        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 max-w-4xl px-4 flex flex-col items-center"
        >
          {/* Location / Tagline */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-[1px] w-12 bg-[#c5a059]/50" />
            <span className="text-sm md:text-base font-bold text-[#c5a059] uppercase tracking-[0.4em]">
              India
            </span>
            <div className="h-[1px] w-12 bg-[#c5a059]/50" />
          </div>

          {/* Main Title */}
          <h1 className="text-6xl md:text-8xl font-normal text-white mb-8 leading-tight font-['Playfair_Display']">
            Your Wedding,<br />
            <span className="text-[#c5a059]">Day by Day</span>
          </h1>

          {/* Description */}
          <p className="text-base md:text-lg text-white/80 font-light max-w-xl mx-auto leading-relaxed mb-12">
            Luxury-modern cultural experiences curated for upper-middle and premium families.
            Every function, every moment, elevated.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button className="px-10 py-4 bg-[#c5a059] hover:bg-[#b38f4a] text-black font-bold text-sm tracking-widest transition-all duration-300">
              Explore Packages
            </button>
            <button className="px-10 py-4 border border-[#c5a059] hover:bg-[#c5a059]/10 text-white font-bold text-sm tracking-widest transition-all duration-300">
              Free Consultation
            </button>
          </div>
        </motion.div>


      </section>


      {/* ── Day-wise Experiences Section ── */}
      <section className="bg-white dark:bg-[#0a0a0a] py-12 px-4 overflow-hidden border-b border-gray-100 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <span className="text-[#c5a059] text-sm md:text-base font-bold uppercase tracking-[0.4em] mb-6 block">
              Day-wise Experiences
            </span>
            <h2 className="text-5xl md:text-7xl text-gray-900 dark:text-white font-normal mb-8 font-['Playfair_Display'] leading-tight">
              5–7 Day Wedding<br />
              Experience Packages
            </h2>
            <p className="text-gray-500 dark:text-white/40 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
              Filter by vibe, select your days, and build your perfect celebration story.
            </p>
          </motion.div>

          {/* Filter Bar */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {[
              { label: 'All Events', value: 'ALL EVENTS' },
              { label: 'Wedding', value: 'WEDDING' },
              { label: 'Parties', value: 'PARTIES' },
              { label: 'Couple', value: 'COUPLE' },
              { label: 'Family', value: 'FAMILY' }
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`px-8 py-3.5 text-sm font-bold tracking-widest transition-all duration-500 border ${activeFilter === filter.value
                  ? 'bg-[#c5a059] border-[#c5a059] text-black shadow-lg shadow-[#c5a059]/20'
                  : 'bg-transparent border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/40 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-white/30'
                  }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="h-8 bg-white dark:bg-slate-950" /> {/* Gap/Spacer */}

      {/* ── Experience Cards Grid ── */}
      <section className="bg-white dark:bg-[#0a0a0a] pb-16 px-4 md:px-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experiences
              .filter(exp => activeFilter === 'ALL EVENTS' || exp.category === activeFilter)
              .map((exp, i) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-gray-50 dark:bg-[#111111] border border-gray-200 dark:border-white/5 overflow-hidden flex flex-col h-full transition-colors duration-300 shadow-sm hover:shadow-xl"
                >
                  {/* Card Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={exp.image}
                      alt={exp.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-60" />
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <span className="text-[#c5a059] text-sm font-bold uppercase tracking-[0.3em] mb-2 block">
                      {exp.tagline}
                    </span>
                    <h3 className="text-2xl text-gray-900 dark:text-white font-normal mb-3 font-['Playfair_Display'] leading-tight">
                      {exp.title}
                    </h3>

                    <div className="flex flex-col gap-0.5 mb-4">
                      <span className="text-[#c5a059] text-lg font-bold">{exp.price}</span>
                      <span className="text-gray-600 dark:text-white/40 text-sm font-medium">{exp.guests}</span>
                    </div>

                    <ul className="space-y-2 mb-5">
                      {exp.features.map((feature, idx) => (
                        <li key={idx} className="flex gap-3 text-sm text-gray-700 dark:text-white/60 font-medium leading-relaxed line-clamp-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#c5a059]/40 mt-1.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto">
                      <p className="text-sm text-gray-500 dark:text-white/40 mb-0 leading-relaxed line-clamp-2 font-medium">
                        <span className="text-[#c5a059]/60 not-italic font-bold mr-1 text-sm">Add-ons:</span>
                        {exp.addons}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* ── Main Wedding Packages ── */}
      <section className="py-16 px-4 bg-white dark:bg-slate-950 border-t border-gray-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-[1px] w-8 bg-red-500/30" />
              <span className="text-red-500 text-base font-black uppercase tracking-[0.2em]">Full Week Coverage</span>
              <div className="h-[1px] w-8 bg-red-500/30" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">Premium Combo Packages</h2>
            <p className="text-gray-500 dark:text-slate-400 max-w-2xl mx-auto font-medium text-base md:text-lg">
              Save more by bundling multiple days. Our premium packages include dedicated management and priority vendor allocation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {packages.map((pkg, i) => {
              const Icon = pkg.icon;
              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative flex flex-col rounded-3xl border-2 ${pkg.borderColor} bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 ${pkg.popular ? 'lg:-mt-4 lg:mb-4' : ''}`}
                >
                  {pkg.badge && (
                    <div className="absolute top-4 right-4 z-10 bg-amber-400 text-black text-sm font-medium uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                      {pkg.badge}
                    </div>
                  )}

                  <div className={`bg-gradient-to-br ${pkg.color} p-6 text-white`}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <Icon size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="text-white/70 text-sm font-bold uppercase tracking-widest leading-none mb-1">{pkg.tier}</p>
                        <h3 className="text-xl font-black leading-none">{pkg.name}</h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-white/80 text-sm mb-4">
                      <span className="flex items-center gap-1.5 font-bold"><Calendar size={14} /> {pkg.days}</span>
                      <span className="flex items-center gap-1.5 font-bold"><Users size={14} /> {pkg.guests}</span>
                    </div>
                    <div className="flex items-baseline gap-1.5 whitespace-nowrap">
                      <span className="text-3xl font-black text-white">{pkg.price}</span>
                      <span className="text-white/60 text-[11px] uppercase tracking-widest font-bold">/ {pkg.priceNote}</span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col gap-5">
                    <div>
                      <p className="text-sm font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3">Included Events</p>
                      <div className="space-y-2">
                        {pkg.events.map((ev, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className={`w-16 text-sm font-black text-center py-0.5 rounded-full bg-gradient-to-r ${pkg.color} text-white flex-shrink-0`}>
                              {ev.day}
                            </div>
                            <span className="text-sm text-gray-700 dark:text-slate-300 font-bold">{ev.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3">Premium Benefits</p>
                      <ul className="space-y-2">
                        {pkg.features.map((f, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-gray-600 dark:text-slate-400">
                            <div className="mt-1 bg-green-500/10 rounded-full p-0.5">
                              <Check size={14} className="text-green-500 flex-shrink-0" />
                            </div>
                            <span className="font-medium line-clamp-1">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-auto pt-2">
                      <button
                        onClick={() => setSelectedPkg(pkg)}
                        className={`w-full py-3.5 rounded-2xl font-black text-sm tracking-widest transition-all duration-300 ${pkg.popular
                          ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-[1.02]'
                          : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-red-600 dark:hover:bg-red-500 dark:hover:text-white hover:scale-[1.02]'
                          }`}
                      >
                        Book Bundle
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>


      {/* ── Our Process ── */}
      <section className="bg-white dark:bg-[#0a0a0a] py-16 px-4 border-t border-gray-100 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-[1px] w-8 bg-[#c5a059]/30" />
              <span className="text-[#c5a059] text-sm font-bold uppercase tracking-[0.4em]">Our Process</span>
              <div className="h-[1px] w-8 bg-[#c5a059]/30" />
            </div>

            <h2 className="text-4xl md:text-6xl text-gray-900 dark:text-white font-normal font-['Playfair_Display'] leading-tight">
              How We Build Your<br />
              <span className=" text-[#c5a059]">Celebration Story</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-white/5">
            {[
              {
                num: '01',
                title: 'Free Consultation',
                desc: 'Share your vision, guest count, budget, and preferred dates. Our team maps the perfect package combination for your story.'
              },
              {
                num: '02',
                title: 'Choose Your Vibe',
                desc: 'Select your mood — Romantic, Royal, Party, or Minimal. We match premium vendors who deliver exactly that experience.'
              },
              {
                num: '03',
                title: 'Customise Each Day',
                desc: 'Add-ons, upgrades, and cultural layers are all à la carte. Every day is tailored down to the playlist and the petal count.'
              },
              {
                num: '04',
                title: 'We Execute Flawlessly',
                desc: 'Dedicated coordinators, vetted vendors, and day-of management. You celebrate; we handle everything else.'
              }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 text-left border-r border-b lg:border-b-0 border-white/5 hover:bg-white/[0.02] transition-colors group"
              >
                <span className="text-5xl font-light text-gray-200 dark:text-white/10 group-hover:text-[#c5a059]/20 transition-colors mb-8 block font-['Playfair_Display']">
                  {step.num}
                </span>
                <h4 className="text-gray-900 dark:text-white font-bold text-base uppercase tracking-widest mb-4">{step.title}</h4>
                <p className="text-gray-600 dark:text-white/40 text-sm leading-relaxed font-medium">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Client Stories ── */}
      <section className="bg-white dark:bg-[#0a0a0a] py-16 px-4 transition-colors duration-300">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-[1px] w-8 bg-[#c5a059]/30" />
              <span className="text-[#c5a059] text-sm font-bold uppercase tracking-[0.4em]">Client Stories</span>
              <div className="h-[1px] w-8 bg-[#c5a059]/30" />
            </div>
            <h2 className="text-4xl md:text-6xl text-gray-900 dark:text-white font-normal font-['Playfair_Display'] leading-tight">
              Moments They'll<br />
              <span className=" text-[#c5a059]">Never Forget</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                text: "The Haldi Sundowner was absolutely viral-worthy. Our drone shots made it to three Instagram pages the same evening. Ease2Event delivered something we didn't even know we wanted.",
                author: "PRIYA & RAHUL SHARMA",
                meta: "Gold Package · Patna, 2024"
              },
              {
                text: "We booked the Platinum 7-day package. The dedicated manager was the real game-changer — not a single stressful moment during the entire week. Pure magic from start to finish.",
                author: "ANJALI & VIKRAM SINGH",
                meta: "Platinum Package · Bihar Sharif, 2025"
              },
              {
                text: "Our Sangeet Concert Night genuinely felt like a Bollywood production. The LED stage, the pyro entry, the live singer — guests are still talking about it six months later.",
                author: "NEHA & ARJUN KAPOOR",
                meta: "Silver Package · Muzaffarpur, 2025"
              }
            ].map((story, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-50 dark:bg-white/[0.03] p-10 text-left border border-gray-200 dark:border-white/5 relative group hover:border-[#c5a059]/20 transition-all"
              >
                <div className="text-[#c5a059] mb-8">
                  <Mail size={24} className="opacity-20" /> {/* Using Mail as a placeholder for quote icon or just a visual element */}
                </div>
                <p className="text-gray-700 dark:text-white/80 text-base leading-relaxed font-medium mb-10">
                  "{story.text}"
                </p>
                <div>
                  <h5 className="text-[#c5a059] text-sm font-bold uppercase tracking-widest mb-1">{story.author}</h5>
                  <p className="text-gray-500 dark:text-white/30 text-sm uppercase tracking-tighter font-medium">{story.meta}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ── Custom CTA ── */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-gradient-to-br from-gray-900 to-red-950 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_#ef4444,_transparent)]" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Need a Custom Wedding Plan?
            </h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Every wedding is unique. Tell us your vision and our experts will craft a bespoke package just for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/plan-event')}
                className="inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-black transition-all hover:scale-105 shadow-lg shadow-red-500/30"
              >
                Build Custom Package <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-2xl font-bold transition-all"
              >
                <Phone size={16} /> Talk to an Expert
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedPkg && (
          <BookingModal pkg={selectedPkg} onClose={() => setSelectedPkg(null)} />
        )}
      </AnimatePresence>
    </main>
  );
};

export default Packages;
