import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Calendar, Users, ArrowRight, Phone, Loader, Crown, AlertCircle, ShoppingBag } from 'lucide-react';
import SEO from '../components/SEO';
import FallingPetals from '../components/FallingPetals';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

const Packages: React.FC = () => {
  const navigate = useNavigate();

  const { data: packages = [], isLoading, isError } = useQuery({
    queryKey: ['service-packages'],
    queryFn: async () => {
      const res = await api.get('/services');
      const services = res.data?.data || res.data || [];
      
      // Normalize and flatten ServicePackage data cleanly
      const allPackages = services.flatMap((service: any) =>
        (service.packages || []).map((pkg: any) => ({
          ...pkg,
          service: {
            id: service.id,
            title: service.title,
            vendor: service.vendor,
          }
        }))
      );
      
      return allPackages;
    },
  });

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300 overflow-x-hidden">
      <FallingPetals />
      <SEO title="Wedding Packages — Bundle & Save" description="Book multiple wedding days together and enjoy priority vendor allocation, a dedicated wedding manager, and exclusive pricing." />

      {/* ── Hero ── */}
      <section className="relative h-[60vh] flex flex-col items-center justify-center text-center overflow-hidden">
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
          <h1 className="text-5xl md:text-7xl font-normal text-white mb-6 leading-tight font-['Playfair_Display']">
            Exclusive <span className="text-[#ffffff]">Packages</span>
          </h1>
          <p className="text-base md:text-lg text-white/80 font-light max-w-xl mx-auto leading-relaxed">
            Discover curated event bundles by our premium vendors.
          </p>
        </motion.div>
      </section>

      {/* ── Dynamic Packages Grid ── */}
      <section className="py-20 px-4 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Available Packages</h2>
            <p className="text-gray-500 dark:text-slate-400">Handcrafted experiences from our top vendors.</p>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader size={48} className="animate-spin text-red-500 mb-4" />
              <p className="text-gray-500 font-bold">Loading premium packages...</p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <AlertCircle size={48} className="text-red-500 mb-4 mx-auto" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Failed to load packages</h3>
              <p className="text-gray-500">There was an error connecting to our servers. Please try again later.</p>
            </div>
          ) : packages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center bg-gray-50 dark:bg-slate-900/50 rounded-3xl border border-gray-100 dark:border-slate-800">
              <ShoppingBag size={64} className="text-gray-300 dark:text-slate-700 mb-6 mx-auto" />
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">No Packages Available</h3>
              <p className="text-gray-500 dark:text-slate-400 max-w-md mx-auto">
                Our vendors are currently crafting new amazing experiences. Check back soon for exclusive bundles!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg: any, i: number) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col bg-white dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="bg-gradient-to-br from-slate-800 to-slate-950 p-6 text-white relative">
                    {/* Badge */}
                    <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                      {pkg.service?.vendor?.businessName || 'Premium Vendor'}
                    </div>

                    <Crown size={24} className="text-[#c5a059] mb-4" />
                    <h3 className="text-2xl font-black mb-1 line-clamp-1">{pkg.title || pkg.name}</h3>
                    <p className="text-white/60 text-sm font-medium line-clamp-1 mb-6">{pkg.service?.title}</p>
                    
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black">₹{Number(pkg.price || 0).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    {pkg.description && (
                      <p className="text-sm text-gray-600 dark:text-slate-400 mb-6 line-clamp-3">
                        {pkg.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm font-bold text-gray-700 dark:text-slate-300 mb-6 bg-gray-50 dark:bg-slate-800 p-4 rounded-2xl">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-red-500" />
                        {pkg.deliveryDays ? `${pkg.deliveryDays} Days` : 'Standard'}
                      </div>
                      <div className="w-px h-4 bg-gray-300 dark:bg-slate-700" />
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-red-500" />
                        Custom
                      </div>
                    </div>

                    <div className="mb-8">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Included Features</p>
                      <ul className="space-y-3">
                        {(pkg.features || []).slice(0, 5).map((f: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-gray-700 dark:text-slate-300">
                            <div className="mt-1 bg-green-500/10 rounded-full p-0.5 shrink-0">
                              <Check size={12} className="text-green-500" />
                            </div>
                            <span className="font-medium line-clamp-2">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-auto">
                      <button
                        onClick={() => navigate(`/event/${pkg.service?.id}?package=${pkg.id}`)}
                        className="w-full py-4 rounded-2xl font-black text-sm tracking-widest bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-red-600 dark:hover:bg-red-500 dark:hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        View Package <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Custom CTA ── */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-slate-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-gradient-to-br from-gray-900 to-red-950 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_#ef4444,_transparent)]" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Need a Custom Event Plan?</h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Every event is unique. Tell us your vision and our experts will craft a bespoke package just for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/plan-event')}
                className="inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-lg shadow-red-500/30"
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
    </main>
  );
};

export default Packages;
