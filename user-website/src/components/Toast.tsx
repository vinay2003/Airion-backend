import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircle size={20} className="text-green-500" />,
        error: <AlertCircle size={20} className="text-red-500" />,
        warning: <AlertCircle size={20} className="text-yellow-500" />,
        info: <Info size={20} className="text-blue-500" />,
    };

    const bgColors = {
        success: 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20',
        error: 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20',
        warning: 'bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20',
        info: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20',
    };

    return (
        <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm animate-slide-up ${bgColors[type]}`}>
            {icons[type]}
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{message}</p>
            <button onClick={onClose} className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
                <X size={16} className="text-gray-500 dark:text-gray-400" />
            </button>
        </div>
    );
};

export default Toast;
