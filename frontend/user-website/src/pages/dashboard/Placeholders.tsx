import React from 'react';

export const Payments: React.FC = () => (
    <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payments & Invoices</h2>
        <p className="text-gray-500">Track all your transactions and download invoices here.</p>
        <div className="mt-8 p-12 bg-gray-50 dark:bg-slate-800 rounded-3xl border border-dashed border-gray-300 dark:border-slate-700">
            <p className="text-gray-400">No transactions yet.</p>
        </div>
    </div>
);

export const GuestList: React.FC = () => (
    <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Guest List Management</h2>
        <p className="text-gray-500">Easily manage your guest list and RSVPs.</p>
        <button className="mt-6 bg-red-500 text-white px-6 py-3 rounded-full font-bold hover:bg-red-600 transition-colors">
            Create New Guest List
        </button>
    </div>
);

export const DigitalInvites: React.FC = () => (
    <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Digital Invitations</h2>
        <p className="text-gray-500">Create beautiful digital invites and share them via WhatsApp or Email.</p>
        <button className="mt-6 bg-red-500 text-white px-6 py-3 rounded-full font-bold hover:bg-red-600 transition-colors">
            Browse Templates
        </button>
    </div>
);

export const Support: React.FC = () => (
    <div className="max-w-2xl mx-auto py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Support & Help</h2>
        <div className="grid gap-6">
            <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
                <h3 className="font-bold mb-2">Contact Support</h3>
                <p className="text-sm text-gray-500 mb-4">Need help with a booking? Our team is available 24/7.</p>
                <div className="flex gap-4">
                    <button className="text-red-500 font-bold text-sm">Chat Now</button>
                    <button className="text-red-500 font-bold text-sm">Email Us</button>
                </div>
            </div>
            <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
                <h3 className="font-bold mb-2">FAQs</h3>
                <p className="text-sm text-gray-500">Check our frequently asked questions for quick answers.</p>
            </div>
        </div>
    </div>
);
