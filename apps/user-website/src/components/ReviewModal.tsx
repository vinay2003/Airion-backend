import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
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

const ReviewModal: React.FC<ReviewModalProps> = ({ bookingId, vendorName, isOpen, onClose, onSuccess }) => {
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await submitReview({ bookingId, rating, reviewText });
            toast.success('Thank you! Your review has been submitted.');
            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to submit review. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-slate-800">
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Rate your experience</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">with {vendorName}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="flex flex-col items-center justify-center py-4">
                        <div className="flex items-center gap-2 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="p-1 focus:outline-none transition-transform hover:scale-110 active:scale-95"
                                >
                                    <Star
                                        size={36}
                                        className={`transition-colors ${
                                            star <= rating
                                                ? 'fill-amber-400 text-amber-400'
                                                : 'fill-transparent text-gray-300 dark:text-slate-600'
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            {rating === 5 ? 'Excellent' : rating === 4 ? 'Very Good' : rating === 3 ? 'Average' : rating === 2 ? 'Poor' : 'Terrible'}
                        </span>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Leave a Review (Optional)
                        </label>
                        <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Tell us what you liked (or didn't like) about this vendor..."
                            className="w-full h-32 px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition-shadow"
                        />
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-slate-800">
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
                            className="flex-1 rounded-xl bg-primary text-white hover:bg-primary/90"
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
