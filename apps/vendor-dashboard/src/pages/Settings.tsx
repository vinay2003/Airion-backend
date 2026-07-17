import React from 'react';

const Settings: React.FC = () => {
    return (
        <div className="space-y-6 px-6 w-full max-w-7xl mx-auto pb-32">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[var(--ease2event-border-subtle)] pb-6">
                <div className="space-y-2">
                    <h1 className="text-xl font-bold tracking-tight leading-normal">Settings</h1>
                    <p className="text-sm font-semibold text-[var(--ease2event-text-secondary)]">Manage your account</p>
                </div>
            </div>
            
            <div className="p-8 text-center text-gray-500 border border-dashed border-gray-200 rounded-xl bg-gray-50 dark:bg-slate-900/50 dark:border-slate-800">
                <p>Settings options have been moved to your Profile section.</p>
            </div>
        </div>
    );
};

export default Settings;
