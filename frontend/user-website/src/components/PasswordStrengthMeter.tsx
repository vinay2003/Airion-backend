import React from 'react';

interface PasswordStrengthMeterProps {
    password: string;
}

type StrengthLevel = 'weak' | 'medium' | 'strong';

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
    const calculateStrength = (): { strength: StrengthLevel; score: number; feedback: string[] } => {
        const feedback: string[] = [];
        let score = 0;

        // Length checks
        if (password.length >= 12) {
            score++;
        } else {
            feedback.push('At least 12 characters');
        }

        if (password.length >= 16) score++;
        if (password.length >= 20) score++;

        // Character type checks
        if (/[A-Z]/.test(password)) {
            score++;
        } else {
            feedback.push('One uppercase letter');
        }

        if (/[a-z]/.test(password)) {
            score++;
        } else {
            feedback.push('One lowercase letter');
        }

        if (/\d/.test(password)) {
            score++;
        } else {
            feedback.push('One number');
        }

        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            score++;
        } else {
            feedback.push('One special character');
        }

        // Determine strength
        let strength: StrengthLevel = 'weak';
        if (score <= 3) {
            strength = 'weak';
        } else if (score <= 5) {
            strength = 'medium';
        } else {
            strength = 'strong';
        }

        return { strength, score, feedback };
    };

    if (!password) {
        return null;
    }

    const { strength, score, feedback } = calculateStrength();

    const strengthColors = {
        weak: 'bg-red-500',
        medium: 'bg-yellow-500',
        strong: 'bg-green-500',
    };

    const strengthTextColors = {
        weak: 'text-red-600 dark:text-red-400',
        medium: 'text-yellow-600 dark:text-yellow-400',
        strong: 'text-green-600 dark:text-green-400',
    };

    const bars = 4;
    const filledBars = Math.min(Math.ceil((score / 7) * bars), bars);

    return (
        <div className="space-y-2 mt-2">
            {/* Strength bars */}
            <div className="flex gap-1">
                {Array.from({ length: bars }).map((_, index) => (
                    <div
                        key={index}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${index < filledBars
                                ? strengthColors[strength]
                                : 'bg-gray-200 dark:bg-slate-700'
                            }`}
                    />
                ))}
            </div>

            {/* Strength label */}
            <div className="flex items-center justify-between">
                <span className={`text-sm font-medium capitalize ${strengthTextColors[strength]}`}>
                    {strength}
                </span>
                <span className="text-xs text-gray-500 dark:text-slate-400">
                    {score}/7
                </span>
            </div>

            {/* Feedback */}
            {feedback.length > 0 && (
                <div className="bg-slate-50 dark:bg-slate-800 rounded-md p-3 mt-2">
                    <p className="text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">
                        Password must contain:
                    </p>
                    <ul className="space-y-1">
                        {feedback.map((item, index) => (
                            <li key={index} className="text-xs text-gray-600 dark:text-slate-400 flex items-center gap-1.5">
                                <span className="text-red-500">×</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Success message */}
            {feedback.length === 0 && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-md p-2 mt-2">
                    <p className="text-xs text-green-700 dark:text-green-400 flex items-center gap-1.5">
                        <span className="text-green-500">✓</span>
                        Strong password!
                    </p>
                </div>
            )}
        </div>
    );
};

export default PasswordStrengthMeter;
