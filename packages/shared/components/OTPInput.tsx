import React, { useState, useRef, useEffect } from 'react';

interface OTPInputProps {
    length?: number;
    onComplete: (otp: string) => void;
    disabled?: boolean;
    error?: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({ 
    length = 6, 
    onComplete, 
    disabled = false,
    error = false 
}) => {
    const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        // Auto-focus first input on mount
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const val = e.target.value;
        if (isNaN(Number(val))) return;

        const newOtp = [...otp];
        // Take only the last character if multiple are entered (e.g. on mobile)
        newOtp[index] = val.substring(val.length - 1);
        setOtp(newOtp);

        // Move to next input if value is entered
        if (val && index < length - 1 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus();
        }

        // Trigger completion
        const fullOtp = newOtp.join('');
        if (fullOtp.length === length) {
            onComplete(fullOtp);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
            // Move to previous input on backspace if current is empty
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const data = e.clipboardData.getData('text').slice(0, length);
        if (isNaN(Number(data))) return;

        const newOtp = [...otp];
        data.split('').forEach((char, i) => {
            if (i < length) newOtp[i] = char;
        });
        setOtp(newOtp);

        // Focus the last filled input or the one after
        const nextIdx = Math.min(data.length, length - 1);
        inputRefs.current[nextIdx]?.focus();

        if (data.length === length) {
            onComplete(data);
        }
    };

    return (
        <div className="flex gap-2 sm:gap-3 justify-center mb-6">
            {otp.map((digit, index) => (
                <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={digit}
                    disabled={disabled}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-2xl font-black rounded-xl border-2 transition-all outline-none 
                        ${disabled ? 'bg-neutral-100 text-neutral-400 border-neutral-200' : 
                          error ? 'bg-red-50 border-red-500 text-red-600' : 
                          'bg-white dark:bg-slate-900 border-neutral-200 dark:border-slate-800 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-neutral-900 dark:text-white'
                        }`}
                />
            ))}
        </div>
    );
};

export default OTPInput;
