import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

interface ErrorAlertProps {
    type?: 'error' | 'success' | 'warning' | 'info';
    title: string;
    message: string;
    className?: string;
}

export const StatusAlert: React.FC<ErrorAlertProps> = ({
    type = 'error',
    title,
    message,
    className = '',
}) => {
    const variants = {
        error: {
            variant: 'destructive' as const,
            icon: AlertCircle,
            className: 'border-red-500 text-red-900 dark:text-red-100',
        },
        success: {
            variant: 'default' as const,
            icon: CheckCircle,
            className: 'border-green-500 bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-100',
        },
        warning: {
            variant: 'default' as const,
            icon: AlertTriangle,
            className: 'border-yellow-500 bg-yellow-50 text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-100',
        },
        info: {
            variant: 'default' as const,
            icon: Info,
            className: 'border-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-900/20 dark:text-blue-100',
        },
    };

    const config = variants[type];
    const Icon = config.icon;

    return (
        <Alert variant={config.variant} className={`${config.className} ${className}`}>
            <Icon className="h-4 w-4" />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
        </Alert>
    );
};

export default StatusAlert;
