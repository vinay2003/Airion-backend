import React, { useState, useRef } from 'react';
import { Upload, X, Camera, Plus, Trash2, Eye, Sparkles, Loader2, Image as ImageIcon, Zap, Target, Activity, ShieldCheck, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@ease2event/shared';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { Button } from '@ease2event/ui';

interface GalleryItem {
    id: string;
    imageUrl: string;
    title?: string;
    createdAt: Date;
}

/**
 * 🎨 Visual Asset Management: Portfolio Node
 * Modernized with theme-aware styling, ultra-bold typography, and premium gallery interface.
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
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-24">
            {/* Header Section */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10 border-b border-[var(--ease2event-border-subtle)] padding-bottom-12">
                <div className="space-y-6">
                    <h1 className="text-4xl font-black text-[var(--ease2event-text-primary)] tracking-tighter leading-none uppercase italic">Visual Repository</h1>
                    <p className="text-lg font-bold text-[var(--ease2event-text-muted)] uppercase tracking-widest flex items-center gap-4">
                        <Zap size={24} className="text-blue-500 animate-pulse" />
                        Neural Asset Management • Multi-Node Portfolio Sync v3.5
                    </p>
                </div>

                <div className="flex gap-6 w-full xl:w-auto">
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
                        className="btn-primary flex-1 xl:flex-initial !h-16 px-14 rounded-3xl text-xs font-black tracking-[0.3em] uppercase shadow-2xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all italic"
                    >
                        {uploading ? <Loader2 className="animate-spin mr-3" size={24} /> : <Plus size={24} className="mr-3" />}
                        <span>{uploading ? 'SYNCING...' : 'INITIALIZE UPLOAD'}</span>
                    </Button>
                </div>
            </div>

            {/* Empty State */}
            {gallery.length === 0 ? (
                <div className="card-minimal !p-32 flex flex-col items-center justify-center text-center space-y-10 bg-[var(--ease2event-bg-elevated)]/20 border-4 border-dashed border-[var(--ease2event-border-base)] rounded-[4rem] shadow-inner">
                    <div className="w-40 h-40 bg-blue-500/10 rounded-[3rem] flex items-center justify-center text-blue-500 border-4 border-blue-500/10 shadow-2xl transition-transform hover:scale-110 group relative overflow-hidden">
                        <div className="absolute inset-0 bg-blue-500/10 group-hover:scale-150 transition-transform duration-1000" />
                        <ImageIcon size={64} className="relative z-10" />
                    </div>
                    <div className="max-w-xl space-y-6">
                        <h3 className="text-4xl font-black text-[var(--ease2event-text-primary)] uppercase tracking-tighter italic leading-none">Repository Null</h3>
                        <p className="text-lg text-[var(--ease2event-text-muted)] font-bold uppercase tracking-tight leading-loose opacity-70">Synchronize visual telemetry to enhance marketplace visibility index and establish regional presence.</p>
                    </div>
                    <Button
                        onClick={() => fileInputRef.current?.click()}
                        className="btn-secondary !h-16 px-14 text-xs font-black uppercase tracking-[0.4em] border-2 border-[var(--ease2event-border-base)] rounded-3xl hover:bg-blue-600 hover:text-white transition-all shadow-xl italic"
                    >
                        Force Node Sync
                    </Button>
                </div>
            ) : (
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-10 space-y-10">
                    {gallery.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.8 }}
                            onClick={() => setSelectedImage(item)}
                            className="relative group cursor-pointer break-inside-avoid rounded-[3rem] overflow-hidden border-2 border-[var(--ease2event-border-subtle)] shadow-2xl transition-all duration-700 hover:border-blue-500/50 hover:shadow-[0_40px_80px_rgba(0,0,0,0.3)] hover:scale-[1.02] bg-[var(--ease2event-bg-surface)]"
                        >
                            <img
                                src={item.imageUrl}
                                alt={item.title || 'Registry item'}
                                className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-110 opacity-95 group-hover:opacity-100"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--ease2event-bg-surface)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-end p-10">
                                <div className="space-y-6 translate-y-10 group-hover:translate-y-0 transition-transform duration-700">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck size={18} className="text-blue-500" />
                                        <span className="text-[10px] text-blue-500 font-black uppercase tracking-[0.3em]">SECURE ASSET</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[var(--ease2event-text-primary)] text-sm font-black uppercase tracking-[0.2em] truncate pr-6 italic">
                                            {item.title || 'ARCHIVE_NODE'}
                                        </span>
                                        <div className="flex gap-4">
                                            <button
                                                onClick={(e) => handleDelete(item.id, e)}
                                                className="w-12 h-12 flex items-center justify-center bg-rose-600 shadow-xl shadow-rose-600/20 rounded-2xl text-white hover:scale-110 active:scale-95 transition-all"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                            <button className="w-12 h-12 flex items-center justify-center bg-blue-600 shadow-xl shadow-blue-600/20 rounded-2xl text-white hover:scale-110 active:scale-95 transition-all">
                                                <Maximize2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="h-2 w-0 group-hover:w-full bg-blue-600 transition-all duration-1000 absolute bottom-0 left-0 shadow-[0_0_20px_rgba(37,99,235,0.6)]"></div>
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
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 bg-[var(--ease2event-bg-base)]/95 backdrop-blur-3xl"
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 50, rotateX: 15 }}
                            animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 50, rotateX: 15 }}
                            className="relative max-w-7xl w-full h-full flex flex-col items-center justify-center"
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute -top-6 right-0 text-[var(--ease2event-text-muted)] hover:text-white transition-all flex items-center gap-6 font-black text-xs uppercase tracking-[0.4em] p-6 hover:scale-105"
                            >
                                CLOSE NODE SEQUENCE <X size={44} className="p-2.5 bg-rose-600 text-white rounded-2xl shadow-2xl shadow-rose-600/30" />
                            </button>
                            <div className="w-full h-[80vh] rounded-[4rem] overflow-hidden border-4 border-[var(--ease2event-border-base)] shadow-[0_50px_100px_rgba(0,0,0,0.6)] bg-[var(--ease2event-bg-surface)] group relative">
                                <img
                                    src={selectedImage.imageUrl}
                                    className="w-full h-full object-contain p-4"
                                    alt="Global preview"
                                />
                                <div className="absolute inset-0 bg-blue-500/[0.02] pointer-events-none" />
                            </div>
                            {selectedImage.title && (
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="mt-12 flex items-center gap-6 bg-[var(--ease2event-bg-surface)] px-14 py-6 rounded-[2.5rem] border-2 border-[var(--ease2event-border-base)] shadow-[0_30px_60px_rgba(0,0,0,0.4)]"
                                >
                                    <div className="w-4 h-4 bg-blue-500 rounded-full animate-ping" />
                                    <p className="text-[var(--ease2event-text-primary)] font-black text-xl uppercase tracking-[0.2em] italic">{selectedImage.title}</p>
                                    <div className="h-6 w-0.5 bg-[var(--ease2event-border-subtle)] mx-2" />
                                    <span className="text-xs font-black text-[var(--ease2event-text-muted)] uppercase tracking-widest">{new Date(selectedImage.createdAt).toLocaleDateString()}</span>
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Gallery;
