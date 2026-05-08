import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Star, ChevronRight, Crown, Gem, Sparkles, Calendar, Users, ArrowRight, Phone, Mail } from 'lucide-react';
import SEO from '../components/SEO';
import FallingPetals from '../components/FallingPetals';
import { useNavigate } from 'react-router-dom';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
                  <input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
                    className="w-full border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500"
                    placeholder="Your full name" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Phone *</label>
                    <input required value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))}
                      className="w-full border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500"
                      placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Email *</label>
                    <input required type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
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
                    <input required type="date" value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))}
                      className="w-full border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Guest Count *</label>
                    <input required value={form.guests} onChange={e => setForm(f => ({...f, guests: e.target.value}))}
                      className="w-full border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500"
                      placeholder="e.g. 200" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">City / Venue Preference</label>
                  <input value={form.city} onChange={e => setForm(f => ({...f, city: e.target.value}))}
                    className="w-full border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500"
                    placeholder="e.g. Patna, Delhi, Mumbai" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Special Requirements</label>
                  <textarea value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} rows={3}
                    className="w-full border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 resize-none"
                    placeholder="Tell us about your dream wedding..." />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)}
                    className="flex-1 border-2 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 py-3 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                    Back
                  </button>
                  <button type="submit"
                    className="flex-2 flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold transition-colors">
                    Submit Request ✨
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
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300 overflow-x-hidden">
      <FallingPetals />
      <SEO title="Wedding Packages — Bundle & Save" description="Book multiple wedding days together and enjoy priority vendor allocation, a dedicated wedding manager, and exclusive pricing." />

      {/* ── Hero ── */}
      <section className="relative pt-20 pb-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-50/60 via-rose-50/30 to-transparent dark:from-red-950/20 dark:to-transparent pointer-events-none" />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 px-4 py-2 rounded-full mb-6">
            <Sparkles size={14} className="text-red-500" />
            <span className="text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-widest">Bundle & Save</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
            Wedding Week<br />
            <span className="text-red-500">Combo Packages</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-slate-400 font-medium max-w-xl mx-auto">
            Book multiple days together and enjoy <strong>priority vendor allocation</strong>, a dedicated wedding manager, and exclusive pricing.
          </p>
        </motion.div>
      </section>

      {/* ── Package Cards ── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
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
                  <div className="absolute top-4 right-4 z-10 bg-amber-400 text-black text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                    {pkg.badge}
                  </div>
                )}

                {/* Card Header */}
                <div className={`bg-gradient-to-br ${pkg.color} p-6 text-white`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Icon size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white/70 text-xs font-bold uppercase tracking-widest">{pkg.tier}</p>
                      <h3 className="text-xl font-black">{pkg.name}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-white/80 text-sm">
                    <span className="flex items-center gap-1.5"><Calendar size={13} /> {pkg.days}</span>
                    <span className="flex items-center gap-1.5"><Users size={13} /> {pkg.guests}</span>
                  </div>
                  <div className="mt-4">
                    <span className="text-2xl font-black text-white">{pkg.price}</span>
                    <span className="text-white/60 text-xs ml-2">/ {pkg.priceNote}</span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col gap-6">
                  {/* Events */}
                  <div>
                    <p className="text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-3">What's Included</p>
                    <div className="space-y-2">
                      {pkg.events.map((ev, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className={`w-16 text-[10px] font-black text-center py-0.5 rounded-full bg-gradient-to-r ${pkg.color} text-white flex-shrink-0`}>
                            {ev.day}
                          </div>
                          <span className="text-sm text-gray-700 dark:text-slate-300 font-medium">{ev.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <p className="text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-3">Benefits</p>
                    <ul className="space-y-2">
                      {pkg.features.map((f, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-slate-400">
                          <Check size={15} className="text-green-500 mt-0.5 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <div className="mt-auto">
                    <button
                      onClick={() => setSelectedPkg(pkg)}
                      className={`w-full py-4 rounded-2xl font-black text-sm tracking-wide transition-all duration-300 ${pkg.popular
                        ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-[1.02]'
                        : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-red-600 dark:hover:bg-red-500 dark:hover:text-white hover:scale-[1.02]'
                      }`}
                    >
                      Book This Package ✨
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Booking Flow ── */}
      <section className="bg-gray-50 dark:bg-slate-900/60 py-20 px-4 border-t border-gray-100 dark:border-slate-800">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 px-4 py-2 rounded-full mb-4">
              <span className="text-xs font-black text-red-500 uppercase tracking-widest">How It Works</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
              Your Wedding Journey
            </h2>
            <p className="text-gray-500 dark:text-slate-400 mt-3 max-w-xl mx-auto">
              From package selection to the big day — we handle every detail with precision and love.
            </p>
          </motion.div>

          <div className="relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-[calc(8.33%+20px)] right-[calc(8.33%+20px)] h-0.5 bg-gradient-to-r from-red-200 via-red-400 to-red-200 dark:from-red-900/40 dark:via-red-500/40 dark:to-red-900/40" />

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              {flowSteps.map((s, i) => (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative text-center"
                >
                  <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-2xl border-2 border-red-100 dark:border-red-500/20 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-500/5 relative z-10">
                    <span className="text-2xl font-black text-red-500">0{s.step}</span>
                  </div>
                  <h4 className="font-black text-gray-900 dark:text-white text-sm mb-1">{s.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
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
