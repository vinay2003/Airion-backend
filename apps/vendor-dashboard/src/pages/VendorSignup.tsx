import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Building, MapPin, Briefcase, TrendingUp, AlertCircle, ShieldCheck, 
    CheckCircle, ArrowRight, ArrowLeft, Plus, X, Sparkles, Camera, 
    Clock, Globe, Wallet, CheckCircle2, Loader2, Phone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@ease2event/shared';
import api from '../lib/api';
import toast from 'react-hot-toast';

const VendorSignupWizard: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [currentStep, setCurrentStep] = useState(1);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        // Business Registration
        businessName: '',
        businessEmail: '',
        businessAddress: '',
        city: '',
        state: '',
        zipCode: '',
        businessPhone: '',
        yearsInBusiness: '',
        gstNumber: '',

        // Business Intelligence
        acquisitionChannels: [] as string[],
        monthlyEventVolume: '',
        averageBookingPrice: '',
        painPoints: [] as string[],

        // Profile Completion
        portfolioImages: [] as string[],
        businessDescription: '',
        website: '',
    });

    const hasCheckedProfile = useRef(false);

    // Check if vendor profile already exists
    useEffect(() => {
        const checkExistingProfile = async () => {
            if (!user || hasCheckedProfile.current) {
                if (!user) setLoadingProfile(false);
                return;
            }
            
            hasCheckedProfile.current = true;
            try {
                const response: any = await api.get('/vendors/me');
                if (response && response.id) {
                    console.log('[VendorSignup] Profile exists, redirecting to dashboard...');
                    navigate('/vendor');
                }
            } catch (err) {
                console.log('[VendorSignup] No existing profile or error, proceeding with onboarding');
            } finally {
                setLoadingProfile(false);
            }
        };
        checkExistingProfile();
    }, [user, navigate]);

    // Auto-fill from user context if available
    useEffect(() => {
        if (user) {
            const defaultName = user.email?.split('@')[0] || user.name || user.phoneNumber || 'My Business';
            setFormData(prev => ({
                ...prev,
                businessName: prev.businessName || defaultName,
                businessEmail: prev.businessEmail || user.email || '',
            }));
        }
    }, [user]);

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (name: string, value: string) => {
        setFormData(prev => {
            const currentList = prev[name as keyof typeof prev] as string[];
            if (currentList.includes(value)) {
                return { ...prev, [name]: currentList.filter(item => item !== value) };
            } else {
                return { ...prev, [name]: [...currentList, value] };
            }
        });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSubmitting(true);
            try {
                const files = Array.from(e.target.files);
                for (const file of files) {
                    const uploadData = new FormData();
                    uploadData.append('file', file);
                    const uploadRes: any = await api.post('/uploads/image', uploadData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    const url = uploadRes.url || uploadRes.data?.url;
                    if (url) {
                        setFormData(prev => ({
                            ...prev,
                            portfolioImages: [...prev.portfolioImages, url].slice(0, 8)
                        }));
                    }
                }
            } catch (err: any) {
                toast.error('Failed to upload image(s).');
                console.error(err);
            } finally {
                setSubmitting(false);
            }
        }
    };

    const removeImage = (indexToRemove: number) => {
        setFormData(prev => ({
            ...prev,
            portfolioImages: prev.portfolioImages.filter((_, index) => index !== indexToRemove)
        }));
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Step validation check
        if (currentStep < 3) {
            nextStep();
            return;
        }

        // Form level validation before submission
        if (!formData.businessAddress || !formData.city || !formData.state || !formData.zipCode) {
            toast.error('Complete business address is required');
            return;
        }

        setSubmitting(true);
        try {
            // 1. Images are already uploaded during selection
            const uploadedImages = formData.portfolioImages;

            // 2. Prepare Payload with correct types (Match Schema)
            const submissionData = {
                businessName: formData.businessName.trim(),
                businessEmail: formData.businessEmail?.trim() || user?.email || undefined,
                businessPhone: (formData.businessPhone?.trim() || user?.phoneNumber || '+910000000000').replace(/[\s()-]/g, ''),
                city: formData.city.trim(),
                yearsInBusiness: formData.yearsInBusiness || undefined,
                gstNumber: formData.gstNumber.trim() || undefined,
                acquisitionChannels: formData.acquisitionChannels.length > 0 ? formData.acquisitionChannels : undefined,
                monthlyEventVolume: formData.monthlyEventVolume || undefined,
                averageBookingPrice: formData.averageBookingPrice ? Number(formData.averageBookingPrice) : 0,
                painPoints: formData.painPoints.length > 0 ? formData.painPoints : undefined,
                businessDescription: formData.businessDescription.trim(),
                portfolioImages: uploadedImages,
                businessAddress: {
                    street: formData.businessAddress.trim(),
                    city: formData.city.trim(),
                    state: formData.state.trim(),
                    country: 'India',
                    zipCode: formData.zipCode.trim(),
                },
                socialLinks: {
                    website: formData.website?.trim() || undefined
                }
            };

            await api.post('/vendors', submissionData);
            toast.success('Registration complete! Redirecting to dashboard...');
            setTimeout(() => navigate('/vendor'), 1500);
        } catch (err: any) {
            console.error('[VendorSignup] Submission failed:', err);
            
            // Extract meaningful message from API error
            let errorMessage = 'Failed to save profile. Please check all fields.';
            
            if (err.error) {
                if (Array.isArray(err.error)) {
                    // Handle Zod validation errors (array of objects with 'message' and 'path')
                    errorMessage = err.error.map((e: any) => {
                        const path = e.path ? `(${e.path.join('.')}) ` : '';
                        return `${path}${e.message || e}`;
                    }).join('. ');
                } else {
                    errorMessage = err.error;
                }
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            toast.error(errorMessage, {
                duration: 6000,
                style: { borderRadius: '15px', background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' }
            });
        } finally {
            setSubmitting(false);
        }
    };

    const renderProgress = () => (
        <div className="flex gap-2 mb-12 max-w-md mx-auto">
            {[1, 2, 3].map(step => (
                <div key={step} className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden relative">
                    <motion.div 
                        initial={false}
                        animate={{ width: currentStep >= step ? '100%' : '0%' }}
                        className={`h-full ${currentStep > step ? 'bg-emerald-500' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`}
                    />
                </div>
            ))}
        </div>
    );

    if (loadingProfile) {
        return (
            <div className="min-h-screen bg-[#0F1117] flex items-center justify-center">
                <div className="text-center space-y-6">
                    <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto" />
                    <p className="text-slate-400 font-medium animate-pulse tracking-wide uppercase text-xs">Verifying Access credentials...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0F1117] text-white font-sans selection:bg-red-500/30">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-20">
                <div className="text-center mb-12">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest mb-4">
                        <Sparkles size={14} /> Vendor Onboarding
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                        {currentStep === 1 && "Business Identity"}
                        {currentStep === 2 && "Growth Intelligence"}
                        {currentStep === 3 && "Visual Showcase"}
                    </h1>
                    <p className="text-slate-400 text-lg">Help us build your professional storefront on Ease2event.</p>
                </div>

                {renderProgress()}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <AnimatePresence mode="wait">
                        {currentStep === 1 && (
                            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Legal Business Name</label>
                                    <div className="relative group">
                                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-red-500 transition-colors" size={20} />
                                        <input required name="businessName" value={formData.businessName} onChange={handleTextChange} placeholder="e.g. Royal Decorators & Events" className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-red-500/50 focus:ring-4 focus:ring-red-500/5 transition-all font-bold" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Business Email (for leads)</label>
                                    <div className="relative group">
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-red-500 transition-colors" size={20} />
                                        <input required type="email" name="businessEmail" value={formData.businessEmail} onChange={handleTextChange} placeholder="e.g. contact@business.com" className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-red-500/50 focus:ring-4 focus:ring-red-500/5 transition-all font-bold" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Official Business Phone</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-red-500 transition-colors" size={20} />
                                        <input required type="tel" name="businessPhone" value={formData.businessPhone} onChange={handleTextChange} placeholder="e.g. 9876543210" className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-red-500/50 focus:ring-4 focus:ring-red-500/5 transition-all font-bold" />
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Complete Address</label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-red-500 transition-colors" size={20} />
                                        <input required name="businessAddress" value={formData.businessAddress} onChange={handleTextChange} placeholder="Shop No, Building, Street Name" className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-red-500/50 focus:ring-4 focus:ring-red-500/5 transition-all font-bold" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <input required name="city" value={formData.city} onChange={handleTextChange} placeholder="City (e.g. Mumbai)" className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 px-4 outline-none focus:border-red-500/50 transition-all font-bold" />
                                </div>
                                <div className="space-y-1">
                                    <input required name="state" value={formData.state} onChange={handleTextChange} placeholder="State (e.g. Maharashtra)" className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 px-4 outline-none focus:border-red-500/50 transition-all font-bold" />
                                </div>
                                <div className="space-y-1">
                                    <input required name="zipCode" value={formData.zipCode} onChange={handleTextChange} placeholder="Zip Code (e.g. 400001)" className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 px-4 outline-none focus:border-red-500/50 transition-all font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Professional Experience</label>
                                    <select name="yearsInBusiness" value={formData.yearsInBusiness} onChange={e => setFormData(p => ({ ...p, yearsInBusiness: e.target.value }))} className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-4 px-4 outline-none focus:border-red-500/50 transition-all font-bold appearance-none">
                                        <option value="" className="bg-slate-950">Select Experience</option>
                                        <option value="0-1" className="bg-slate-950">New Business (Less than 1 Year)</option>
                                        <option value="1-3" className="bg-slate-950">1 - 3 Years</option>
                                        <option value="3-5" className="bg-slate-950">3 - 5 Years</option>
                                        <option value="5+" className="bg-slate-950">5+ Years (Veteran)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">GST Identification (Optional)</label>
                                    <input name="gstNumber" value={formData.gstNumber} onChange={handleTextChange} placeholder="15-digit GSTIN" className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-4 px-4 outline-none focus:border-red-500/50 transition-all font-bold" />
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 2 && (
                            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                                <section className="space-y-4">
                                    <h3 className="text-xl font-bold flex items-center gap-2"><Globe className="text-blue-400" size={20} /> Channel Presence</h3>
                                    <p className="text-slate-400 text-sm">Where do you currently find most of your clients?</p>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {["Instagram", "JustDial", "Google Registry", "WhatsApp", "WedMeGood", "WedPlan"].map(item => (
                                            <button 
                                                key={item} type="button" 
                                                onClick={() => handleCheckboxChange('acquisitionChannels', item)}
                                                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                                                    formData.acquisitionChannels.includes(item) 
                                                    ? 'border-red-500 bg-red-500/10 text-red-500' 
                                                    : 'border-slate-800 bg-slate-900/40 text-slate-500 hover:border-slate-700'
                                                }`}
                                            >
                                                <span className="font-bold">{item}</span>
                                            </button>
                                        ))}
                                    </div>
                                </section>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-slate-400 flex items-center gap-2"><TrendingUp size={16} /> Monthly Project Volume</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {["1-2", "3-5", "5-10", "10+"].map(vol => (
                                                <button key={vol} type="button" onClick={() => setFormData(p => ({...p, monthlyEventVolume: vol}))} className={`py-3 rounded-xl border font-bold transition-all ${formData.monthlyEventVolume === vol ? 'bg-white text-black border-white' : 'border-slate-800 text-slate-500 hover:border-slate-700'}`}>
                                                    {vol} Events
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-sm font-bold text-slate-400 flex items-center gap-2"><Wallet size={16} /> Average Ticket Size (₹)</label>
                                        <input type="number" name="averageBookingPrice" value={formData.averageBookingPrice} onChange={handleTextChange} placeholder="e.g. 150000" className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-4 px-4 outline-none focus:border-red-500/50 transition-all font-bold text-2xl text-emerald-500" />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 3 && (
                            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Business Biography</label>
                                    <textarea required name="businessDescription" value={formData.businessDescription} onChange={handleTextChange} rows={5} placeholder="Describe your signature style, specialty items/services, and why clients love working with you..." className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-6 outline-none focus:border-red-500/50 transition-all font-medium leading-relaxed" />
                                </div>

                                <div className="space-y-6">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <h3 className="text-xl font-bold flex items-center gap-2"><Camera className="text-emerald-400" size={24} /> Work Gallery</h3>
                                            <p className="text-slate-400 text-sm">Upload up to 8 high-resolution showcase photos.</p>
                                        </div>
                                        <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl font-bold text-sm hover:bg-emerald-500 hover:text-black transition-all">
                                            Upload Files
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <AnimatePresence>
                                            {formData.portfolioImages.map((img, i) => (
                                                <motion.div key={i} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="aspect-square rounded-2xl overflow-hidden relative group border border-slate-800">
                                                    <img src={img} className="w-full h-full object-cover" alt="Portfolio" />
                                                    <button type="button" onClick={() => removeImage(i)} className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-colors">
                                                        <X size={14} />
                                                    </button>
                                                </motion.div>
                                            ))}
                                            {formData.portfolioImages.length < 8 && (
                                                <button type="button" onClick={() => fileInputRef.current?.click()} className="aspect-square rounded-2xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-600 hover:border-emerald-500/40 hover:text-emerald-400 transition-all bg-slate-900/20 group">
                                                    <Plus size={24} className="group-hover:scale-125 transition-transform" />
                                                    <span className="text-[10px] font-black uppercase mt-2 tracking-tighter">Add Photo</span>
                                                </button>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" multiple accept="image/*" />
                                </div>

                                <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-4">
                                    <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-emerald-400">Ready for Launch</h4>
                                        <p className="text-slate-400 text-sm leading-relaxed">By clicking complete, you agree to our Vendor Service Terms. Your profile will be live once our curation team verifies your business credentials (usually 24h).</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex gap-4 pt-8">
                        {currentStep > 1 && (
                            <button type="button" onClick={prevStep} className="flex-1 py-5 rounded-2xl border border-slate-800 font-black text-slate-400 hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                                <ArrowLeft size={20} /> Previous
                            </button>
                        )}
                        <button type="submit" disabled={submitting} className={`flex-[2] py-5 rounded-3xl font-black text-lg transition-all shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] ${
                            currentStep === 3 
                            ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/10' 
                            : 'bg-red-600 hover:bg-red-500 text-white shadow-red-500/10'
                        }`}>
                            {submitting ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <>
                                    {currentStep === 3 ? "Complete Profile" : "Continue"}
                                    {currentStep < 3 && <ArrowRight size={22} />}
                                    {currentStep === 3 && <ShieldCheck size={22} />}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VendorSignupWizard;

