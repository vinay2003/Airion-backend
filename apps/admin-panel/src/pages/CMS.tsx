import React, { useState, useEffect } from 'react';
import { Layout, Image as ImageIcon, Type, Link as LinkIcon, Plus, Save, Trash2, Edit2, ChevronDown, ChevronUp, MoveVertical, Globe, Smartphone, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';

const defaultHero = {
    title: 'Find the Perfect Vendor for Your Dream Event',
    subtitle: 'Connect with thousands of verified venues, photographers, and caterers across India.',
    buttonText: 'Explore Marketplace',
    backgroundImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80'
};

const defaultCategories = [
    { id: 1, name: 'Venues', icon: 'Hotel', count: 1200 },
    { id: 2, name: 'Photographers', icon: 'Camera', count: 850 },
    { id: 3, name: 'Catering', icon: 'Utensils', count: 500 },
    { id: 4, name: 'Decorators', icon: 'Palette', count: 400 },
];

const CMS: React.FC = () => {
    const [activeTab, setActiveTab] = useState('hero');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [heroSection, setHeroSection] = useState(defaultHero);
    const [categories, setCategories] = useState(defaultCategories);

    useEffect(() => {
        fetchConfigs();
    }, []);

    const fetchConfigs = async () => {
        try {
            setIsLoading(true);
            const { data } = await api.get('/cms');
            if (data.landing_page_hero) setHeroSection(data.landing_page_hero);
            if (data.landing_page_categories) setCategories(data.landing_page_categories);
        } catch (error) {
            console.error('Failed to fetch CMS configs', error);
            toast.error('Failed to load CMS configuration');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            if (activeTab === 'hero') {
                await api.put('/cms/landing_page_hero', { value: heroSection });
            } else if (activeTab === 'categories') {
                await api.put('/cms/landing_page_categories', { value: categories });
            }
            toast.success('Changes published successfully');
        } catch (error) {
            console.error('Failed to save CMS config', error);
            toast.error('Failed to publish changes');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 ">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">Content Management</h1>
                    <p className="text-gray-500 dark:text-slate-400">Manage your platform's public facing content</p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={fetchConfigs}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl text-sm font-bold text-gray-600 dark:text-slate-400"
                    >
                        <RefreshCw size={18} /> Revert Changes
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2 bg-red-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-500/20 disabled:opacity-50"
                    >
                        <Save size={18} /> {isSaving ? 'Publishing...' : 'Publish Changes'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Section Navigation */}
                <div className="lg:col-span-1 space-y-2">
                    {[
                        { id: 'hero', label: 'Hero Section', icon: Layout },
                        { id: 'categories', label: 'Featured Categories', icon: ImageIcon },
                        { id: 'testimonials', label: 'Testimonials', icon: Type },
                        { id: 'footer', label: 'Footer Links', icon: LinkIcon },
                        { id: 'mobile', label: 'Mobile App Banner', icon: Smartphone },
                        { id: 'seo', label: 'SEO Metadata', icon: Globe },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl  ${
                                activeTab === tab.id 
                                ? 'bg-red-500 text-white shadow-lg shadow-red-500/20 translate-x-2' 
                                : 'bg-white dark:bg-slate-900 text-gray-500 dark:text-slate-400 border border-gray-100 dark:border-slate-800'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <tab.icon size={18} />
                                <span className="font-bold text-xs uppercase tracking-widest">{tab.label}</span>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Editor Content */}
                <div className="lg:col-span-3">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 p-8">
                        {activeTab === 'hero' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Hero Section Settings</h2>
                                    <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] font-black uppercase rounded">LIVE</span>
                                </div>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Main Headline</label>
                                        <input 
                                            type="text" 
                                            value={heroSection.title}
                                            onChange={(e) => setHeroSection({...heroSection, title: e.target.value})}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500/20 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Subheadline / Description</label>
                                        <textarea 
                                            rows={3}
                                            value={heroSection.subtitle}
                                            onChange={(e) => setHeroSection({...heroSection, subtitle: e.target.value})}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500/20 text-gray-900 dark:text-white resize-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">CTA Button Text</label>
                                            <input 
                                                type="text" 
                                                value={heroSection.buttonText}
                                                onChange={(e) => setHeroSection({...heroSection, buttonText: e.target.value})}
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500/20 text-gray-900 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">CTA Link URL</label>
                                            <input 
                                                type="text" 
                                                defaultValue="/marketplace"
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500/20 text-gray-900 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Hero Background Image URL</label>
                                        <input
                                            type="text"
                                            value={heroSection.backgroundImage}
                                            onChange={(e) => setHeroSection({...heroSection, backgroundImage: e.target.value})}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500/20 text-gray-900 dark:text-white mb-4"
                                        />
                                        <div className="relative group">
                                            <img src={heroSection.backgroundImage} className="w-full h-48 object-cover rounded-2xl border border-gray-100 dark:border-slate-800 opacity-80" alt="Hero Preview" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'categories' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Featured Categories</h2>
                                    <button className="p-2 bg-red-500 text-white rounded-xl shadow-lg shadow-red-500/20"><Plus size={18} /></button>
                                </div>
                                <div className="space-y-3">
                                    {categories.map((cat, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl group">
                                            <MoveVertical className="text-gray-300 cursor-move" size={20} />
                                            <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center border border-gray-100 dark:border-slate-800 shadow-sm">
                                                <ImageIcon size={20} className="text-red-500" />
                                            </div>
                                            <div className="flex-1">
                                                <input 
                                                    type="text" 
                                                    value={cat.name}
                                                    onChange={(e) => {
                                                        const newCats = [...categories];
                                                        newCats[i].name = e.target.value;
                                                        setCategories(newCats);
                                                    }}
                                                    className="bg-transparent border-none p-0 font-black text-gray-900 dark:text-white uppercase tracking-tight text-sm outline-none w-full"
                                                />
                                                <p className="text-[10px] text-gray-400 font-bold uppercase">{cat.count} listings connected</p>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-100">
                                                <button className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-lg"><Edit2 size={16} /></button>
                                                <button className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab !== 'hero' && activeTab !== 'categories' && (
                            <div className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-sm">
                                Feature Coming Soon
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CMS;

