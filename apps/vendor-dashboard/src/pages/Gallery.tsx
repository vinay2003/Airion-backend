import React, { useState, useRef } from 'react';
import { Upload, X, Camera, Plus, Trash2, Eye, Sparkles, Loader2, Image as ImageIcon, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@airion/shared';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { Button } from '@airion/ui';

interface GalleryItem {
    id: string;
    imageUrl: string;
    title?: string;
    createdAt: Date;
}

/**
 * 🎨 Visual Asset Management: Portfolio Node
 * Modernized with 'Premium Dark Glassmorphism' design nodes.
 */
const Gallery: React.FC = () => {
    const { user, refreshUser } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const gallery = (user?.vendor?.gallery || []) as GalleryItem[];

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        
        setUploading(true);
        const files = Array.from(e.target.files);
        
        try {
            for (const file of files) {
                const reader = new FileReader();
                const promise = new Promise((resolve) => {
                    reader.onloadend = () => resolve(reader.result);
                });
                reader.readAsDataURL(file);
                const base64 = await promise;
                const imageUrl = base64 as string; 

                await api.post('/vendors/gallery', {
                    imageUrl,
                    title: file.name
                });
            }
            
            toast.success(`${files.length} node(s) deployed to registry`);
            refreshUser();
        } catch (err: any) {
            toast.error('Deployment failure');
            console.error(err);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Execute deletion protocol for this asset?')) return;

        try {
            await api.delete(`/vendors/gallery/${id}`);
            toast.success('Asset purged');
            refreshUser();
        } catch (err) {
            toast.error('Purge failure');
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-24">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-10">
                <div className="space-y-3">
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase italic leading-none">Visual Repository</h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] italic flex items-center gap-2">
                        <Zap size={12} className="text-blue-500" />
                        Neural Asset Management & Portfolio Sync
                    </p>
                </div>
                
                <div className="flex gap-4">
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleUpload} 
                        className="hidden" 
                        multiple 
                        accept="image/*" 
                    />
                    <Button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="btn-primary h-12 px-10 rounded-xl text-[10px] tracking-[0.2em] italic"
                    >
                        {uploading ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} className="mr-2" />}
                        <span>{uploading ? 'DEPLOYING NODES...' : 'INITIALIZE UPLOAD'}</span>
                    </Button>
                </div>
            </div>

            {gallery.length === 0 ? (
                <div className="card-minimal !p-20 flex flex-col items-center justify-center text-center space-y-6 bg-white/5 border-dashed border-white/10">
                    <div className="w-24 h-24 bg-blue-500/10 rounded-3xl flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-glow-custom">
                        <ImageIcon size={44} />
                    </div>
                    <div className="max-w-md space-y-3">
                        <h3 className="text-lg font-black text-white uppercase italic tracking-widest">Repository Null</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight italic">Initialize visual telemetry to enhance marketplace visibility index.</p>
                    </div>
                    <Button 
                        onClick={() => fileInputRef.current?.click()}
                        className="btn-secondary h-11 px-8 italic text-[10px] uppercase tracking-widest"
                    >
                        Force Upload Node
                    </Button>
                </div>
            ) : (
                <div className="columns-2 md:columns-3 lg:columns-4 gap-8 space-y-8">
                    {gallery.map((item, index) => (
                        <motion.div 
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05, duration: 0.5 }}
                            onClick={() => setSelectedImage(item)}
                            className="relative group cursor-pointer break-inside-avoid rounded-2xl overflow-hidden border border-white/5 shadow-2xl transition-all duration-700 hover:border-blue-500/30"
                        >
                            <img 
                                src={item.imageUrl} 
                                alt={item.title || 'Registry item'} 
                                className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                            />
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                                <div className="flex justify-between items-center translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <span className="text-white text-[9px] font-black uppercase tracking-widest truncate pr-4 italic">
                                        {item.title || 'ARCHIVE_NODE'}
                                    </span>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={(e) => handleDelete(item.id, e)}
                                            className="p-2.5 bg-rose-600/20 hover:bg-rose-600 border border-rose-600/30 rounded-xl text-rose-400 hover:text-white transition-all duration-300"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                        <button className="p-2.5 bg-blue-600/20 hover:bg-blue-600 border border-blue-600/30 rounded-xl text-blue-400 hover:text-white transition-all duration-300">
                                            <Eye size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="h-1 w-0 group-hover:w-full bg-blue-500 transition-all duration-700 absolute bottom-0 left-0"></div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Matrix Preview Overlay */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-[#020617]/95 backdrop-blur-xl"
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 20 }}
                            className="relative max-w-6xl w-full h-full flex flex-col items-center justify-center"
                            onClick={e => e.stopPropagation()}
                        >
                            <button 
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-0 right-0 text-slate-500 hover:text-white transition-all flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] italic"
                            >
                                Close Node <X size={24} className="p-1.5 bg-white/5 rounded-lg border border-white/10" />
                            </button>
                            <div className="w-full h-[80vh] rounded-3xl overflow-hidden border border-white/5 shadow-[0_0_100px_rgba(59,130,246,0.1)]">
                                <img 
                                    src={selectedImage.imageUrl} 
                                    className="w-full h-full object-contain" 
                                    alt="Global preview" 
                                />
                            </div>
                            {selectedImage.title && (
                                <div className="mt-8 flex items-center gap-4 bg-white/5 px-8 py-3 rounded-2xl border border-white/5">
                                     <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                     <p className="text-white font-black text-sm uppercase italic tracking-widest">{selectedImage.title}</p>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Gallery;
