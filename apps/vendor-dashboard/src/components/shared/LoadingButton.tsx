import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface LoadingButtonProps {
    loading: boolean;
    children: React.ReactNode;
    loadingText?: string;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    className?: string;
    disabled?: boolean;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
    loading,
    children,
    loadingText = 'Processing...',
    onClick,
    type = 'button',
    variant = 'default',
    className = '',
    disabled = false,
}) => {
    return (
        <Button
            type={type}
            onClick={onClick}
            disabled={loading || disabled}
            variant={variant}
            className={`w-full ${className}`}
        >
            {loading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {loadingText}
                </>
            ) : (
                children
            )}
        </Button>
    );
};

export default LoadingButton;
