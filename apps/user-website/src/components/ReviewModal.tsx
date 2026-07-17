import React, { useState, useRef } from 'react';
import { Star, X, Camera, Trash2, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'react-hot-toast';
import { submitReview } from '../lib/api';

interface ReviewModalProps {
    bookingId: string;
    vendorName: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const STAR_LABELS = ['Terrible', 'Poor', 'Average', 'Very Good', 'Excellent'];

const ReviewModal: React.FC<ReviewModalProps> = ({ bookingId, vendorName, isOpen, onClose, onSuccess }) => {
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [photos, setPhotos] = useState<File[]>([]);
    const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (photos.length + files.length > 5) {
            toast.error('You can upload a maximum of 5 photos.');
            return;
        }
        const newFiles = files.slice(0, 5 - photos.length);
        const newPreviews = newFiles.map(f => URL.createObjectURL(f));
        setPhotos(prev => [...prev, ...newFiles]);
        setPhotoPreviews(prev => [...prev, ...newPreviews]);
        // Reset input so same file can be re-selected
        e.target.value = '';
    };

    const removePhoto = (index: number) => {
        URL.revokeObjectURL(photoPreviews[index]);
        setPhotos(prev => prev.filter((_, i) => i !== index));
        setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // In production: upload photos to storage first, then submit review with URLs
            await submitReview({ bookingId, rating, reviewText });
            toast.success('🌟 Thank you! Your review has been submitted.');
            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to submit review. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const displayRating = hoverRating || rating;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-slate-800">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Rate your experience</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">with {vendorName}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Star Rating */}
                    <div className="flex flex-col items-center py-2">
                        <div className="flex items-center gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="p-1 focus:outline-none"
                                >
                                    <Star
                                        size={36}
                                        className={`transition-all ${star <= displayRating ? 'fill-amber-400 text-amber-400 scale-110' : 'fill-transparent text-gray-300 dark:text-slate-600'}`}
                                    />
                                </button>
                            ))}
                        </div>
                        <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
                            {STAR_LABELS[displayRating - 1] || ''}
                        </span>
                    </div>

                    {/* Review Text */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Your Review <span className="text-gray-400 font-normal">(optional)</span>
                        </label>
                        <textarea
                            value={reviewText}
                            onChange={e => setReviewText(e.target.value)}
                            placeholder="Tell us what you liked (or didn't like) about this vendor..."
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500/30 focus:border-red-500 resize-none transition-all outline-none"
                        />
                    </div>

                    {/* Photo Upload */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Add Photos <span className="text-gray-400 font-normal">(up to 5)</span>
                        </label>

                        {/* Previews */}
                        {photoPreviews.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {photoPreviews.map((src, idx) => (
                                    <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-neutral-200 dark:border-slate-700 group">
                                        <img src={src} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removePhoto(idx)}
                                            className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Upload Button */}
                        {photos.length < 5 && (
                            <>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={handlePhotoSelect}
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-600 text-gray-500 dark:text-slate-400 hover:border-red-400 hover:text-red-500 dark:hover:border-red-500 dark:hover:text-red-400 transition-colors text-sm font-medium"
                                >
                                    <Camera size={18} />
                                    {photos.length === 0 ? 'Upload Photos' : `Add More (${5 - photos.length} left)`}
                                </button>
                            </>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-2 border-t border-gray-100 dark:border-slate-800">
                        <Button
                            type="button"
                            onClick={onClose}
                            variant="outline"
                            className="flex-1 rounded-xl"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Submit Review'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;
