import React, { useState } from 'react';
import { Download, Plus, Mail as MailIcon, MessageSquare, Phone, ChevronRight, FileText, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Payments: React.FC = () => {
    const transactions = [
        { id: 'TXN-001', date: '2026-03-10', amount: '₹1,50,000', status: 'Completed', vendor: 'Grand Palace Banquet' },
        { id: 'TXN-002', date: '2026-03-15', amount: '₹25,000', status: 'Pending', vendor: 'Candid Moments Photography' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payments & Invoices</h2>
                    <p className="text-gray-500">Track all your transactions and download invoices here.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-700">
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Transaction ID</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Date</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Vendor</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Amount</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Status</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Invoice</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((txn) => (
                                <tr key={txn.id} className="border-b border-gray-50 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                                    <td className="p-4 text-gray-900 dark:text-white font-medium">{txn.id}</td>
                                    <td className="p-4 text-gray-500 dark:text-gray-400">{txn.date}</td>
                                    <td className="p-4 text-gray-900 dark:text-white">{txn.vendor}</td>
                                    <td className="p-4 text-gray-900 dark:text-white font-bold">{txn.amount}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${txn.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                            {txn.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button className="text-red-500 hover:text-red-600 flex items-center gap-2 text-sm font-medium">
                                            <Download size={16} /> Print
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export const GuestList: React.FC = () => {
    const [guests, setGuests] = useState([
        { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', status: 'Attending', category: 'Family' },
        { id: 2, name: 'Priya Patel', email: 'priya@example.com', status: 'Pending', category: 'Friends' },
    ]);
    const [newGuest, setNewGuest] = useState('');

    const addGuest = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newGuest.trim()) return;
        setGuests([...guests, { id: Date.now(), name: newGuest, email: '', status: 'Pending', category: 'Uncategorized' }]);
        setNewGuest('');
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Guest List Management</h2>
                    <p className="text-gray-500">Manage invitations and track RSVPs.</p>
                </div>
                <form onSubmit={addGuest} className="flex gap-2 w-full sm:w-auto">
                    <Input 
                        placeholder="Quick add guest name..." 
                        value={newGuest}
                        onChange={(e) => setNewGuest(e.target.value)}
                        className="dark:bg-slate-800 dark:border-slate-700" 
                    />
                    <Button type="submit" className="bg-red-500 hover:bg-red-600 text-white"><Plus size={18} /></Button>
                </form>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-700">
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Name</th>
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Category</th>
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">RSVP Status</th>
                            <th className="p-4 text-right font-semibold text-gray-600 dark:text-gray-300">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {guests.map((guest) => (
                            <tr key={guest.id} className="border-b border-gray-50 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                                <td className="p-4 text-gray-900 dark:text-white font-medium">{guest.name}</td>
                                <td className="p-4 text-gray-500 dark:text-gray-400">{guest.category}</td>
                                <td className="p-4">
                                    <span className={`flex items-center gap-1.5 text-sm font-medium ${guest.status === 'Attending' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                                        {guest.status === 'Attending' ? <CheckCircle size={14} /> : <Clock size={14} />}
                                        {guest.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button className="text-gray-400 hover:text-red-500 transition-colors">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const DigitalInvites: React.FC = () => {
    const templates = [
        { id: 1, title: 'Royal Gold', category: 'Wedding', color: 'bg-amber-100 dark:bg-amber-900/30' },
        { id: 2, title: 'Modern Minimal', category: 'Corporate', color: 'bg-slate-100 dark:bg-slate-800' },
        { id: 3, title: 'Floral Elegance', category: 'Party', color: 'bg-pink-100 dark:bg-pink-900/30' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Digital Invitations</h2>
                    <p className="text-gray-500">Select a template and share beautifully crafted invites.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {templates.map((template) => (
                    <div key={template.id} className="group relative rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-lg transition-all cursor-pointer">
                        <div className={`h-40 w-full ${template.color} flex items-center justify-center`}>
                            <FileText size={48} className="text-gray-400/50 dark:text-slate-500/50" />
                        </div>
                        <div className="p-4">
                            <span className="text-xs font-bold text-red-500 dark:text-red-400 uppercase tracking-wider">{template.category}</span>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1">{template.title}</h3>
                            <button className="mt-4 w-full px-4 py-2 border border-gray-200 dark:border-slate-600 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
                                Customize <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const Support: React.FC = () => (
    <div className="max-w-4xl space-y-8">
        <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Help & Support</h2>
            <p className="text-gray-500">Need assistance? We're here to help you coordinate your perfect event.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/10 rounded-2xl border border-red-100 dark:border-red-900/30">
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-red-500 shadow-sm">
                    <MessageSquare size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Live Chat</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Talk to our event support specialists instantly for immediate resolution.</p>
                <Button className="bg-red-500 hover:bg-red-600 text-white rounded-xl w-full">Start Chat</Button>
            </div>

            <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
                <div className="grid gap-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-gray-50 dark:bg-slate-700 rounded-xl text-gray-600 dark:text-gray-300">
                            <Phone size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white">Call Us</h4>
                            <p className="text-sm text-gray-500">+91 1800-AIRION (Toll Free)</p>
                            <p className="text-xs text-gray-400 mt-1">Mon-Sun, 9:00 AM - 9:00 PM</p>
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-gray-50 dark:bg-slate-700 rounded-xl text-gray-600 dark:text-gray-300">
                            <MailIcon size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white">Email Support</h4>
                            <p className="text-sm text-gray-500">support@airion.com</p>
                            <p className="text-xs text-gray-400 mt-1">We typically reply within 24 hours</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
