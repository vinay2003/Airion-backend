import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchGuests, createGuest, updateGuest, deleteGuest } from '../../lib/api';
import { Plus, Search, Filter, Mail, Phone, Users, CheckCircle2, XCircle, Clock, MoreVertical, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import Skeleton from '../../components/Skeleton';

const GuestList: React.FC = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGroup, setFilterGroup] = useState('All');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // New Guest Form State
    const [newGuest, setNewGuest] = useState({
        name: '',
        email: '',
        phone: '',
        group: 'Bride Side',
        rsvpStatus: 'pending'
    });

    const { data: guests = [], isLoading } = useQuery({
        queryKey: ['guests'],
        queryFn: fetchGuests,
    });

    const createMutation = useMutation({
        mutationFn: createGuest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['guests'] });
            setIsAddModalOpen(false);
            setNewGuest({ name: '', email: '', phone: '', group: 'Bride Side', rsvpStatus: 'pending' });
            toast.success('Guest added successfully');
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string, data: any }) => updateGuest(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['guests'] });
            toast.success('Guest updated');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteGuest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['guests'] });
            toast.success('Guest removed');
        }
    });

    const filteredGuests = guests.filter((g: any) => {
        const matchesSearch = g.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            g.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGroup = filterGroup === 'All' || g.group === filterGroup;
        return matchesSearch && matchesGroup;
    });

    const groups = ['All', 'Bride Side', 'Groom Side', 'Friends', 'Family', 'VVIP'];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'confirmed': return <CheckCircle2 className="text-green-500" size={16} />;
            case 'declined': return <XCircle className="text-red-500" size={16} />;
            default: return <Clock className="text-amber-500" size={16} />;
        }
    };

    if (isLoading) return <div className="space-y-4"><Skeleton className="h-20" /><Skeleton className="h-64" /></div>;

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tight">Guest List</h1>
                    <p className="text-neutral-500 dark:text-slate-400 font-medium">Manage your event attendees and RSVP status.</p>
                </div>
                <Button onClick={() => setIsAddModalOpen(true)} className="bg-red-600 hover:bg-neutral-900 text-white font-bold rounded-xl flex items-center gap-2">
                    <Plus size={18} /> Add Guest
                </Button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-3 space-y-6">
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                            <Input 
                                placeholder="Search guests..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-white dark:bg-slate-900 border-neutral-200 dark:border-slate-800 rounded-xl"
                            />
                        </div>
                        <div className="flex overflow-x-auto gap-2 scrollbar-hide">
                            {groups.map(group => (
                                <button
                                    key={group}
                                    onClick={() => setFilterGroup(group)}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                                        filterGroup === group 
                                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900' 
                                        : 'bg-white dark:bg-slate-900 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    {group}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-neutral-200 dark:border-slate-800 overflow-hidden shadow-sm">
                        <table className="w-full text-left">
                            <thead className="bg-neutral-50 dark:bg-slate-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Guest</th>
                                    <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Group</th>
                                    <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-slate-800">
                                <AnimatePresence>
                                    {filteredGuests.map((guest: any) => (
                                        <motion.tr 
                                            key={guest.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-neutral-50/50 dark:hover:bg-slate-800/30 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center text-red-600 font-black">
                                                        {guest.name[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-neutral-900 dark:text-white">{guest.name}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-neutral-500 dark:text-slate-400">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2"><Mail size={12} /> {guest.email || 'N/A'}</div>
                                                    <div className="flex items-center gap-2"><Phone size={12} /> {guest.phone || 'N/A'}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-slate-800 text-[10px] font-black uppercase text-neutral-600 dark:text-slate-400">
                                                    {guest.group}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm font-bold capitalize">
                                                    {getStatusIcon(guest.rsvpStatus)}
                                                    {guest.rsvpStatus}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button 
                                                        onClick={() => {
                                                            const nextStatus = guest.rsvpStatus === 'pending' ? 'confirmed' : guest.rsvpStatus === 'confirmed' ? 'declined' : 'pending';
                                                            updateMutation.mutate({ id: guest.id, data: { rsvpStatus: nextStatus } });
                                                        }}
                                                        className="p-2 hover:bg-neutral-100 dark:hover:bg-slate-800 rounded-lg text-neutral-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => deleteMutation.mutate(guest.id)}
                                                        className="p-2 hover:bg-neutral-100 dark:hover:bg-slate-800 rounded-lg text-neutral-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                        {filteredGuests.length === 0 && (
                            <div className="py-20 text-center">
                                <Users size={48} className="mx-auto text-neutral-300 mb-4" />
                                <p className="text-neutral-500 font-bold">No guests found matching your criteria</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Sidebar */}
                <div className="space-y-6">
                    <div className="bg-neutral-900 dark:bg-white rounded-3xl p-6 text-white dark:text-neutral-900">
                        <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                            <Users size={20} /> RSVP Summary
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs font-bold uppercase mb-1 opacity-60">Confirmed</div>
                                <div className="text-2xl font-black">{guests.filter((g: any) => g.rsvpStatus === 'confirmed').length}</div>
                            </div>
                            <div className="w-full bg-white/20 dark:bg-neutral-200 h-1 rounded-full overflow-hidden">
                                <div 
                                    className="bg-green-500 h-full" 
                                    style={{ width: `${(guests.filter((g: any) => g.rsvpStatus === 'confirmed').length / (guests.length || 1)) * 100}%` }} 
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div>
                                    <div className="text-xs font-bold uppercase opacity-60">Pending</div>
                                    <div className="text-lg font-black">{guests.filter((g: any) => g.rsvpStatus === 'pending').length}</div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold uppercase opacity-60">Declined</div>
                                    <div className="text-lg font-black">{guests.filter((g: any) => g.rsvpStatus === 'declined').length}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-3xl p-6">
                        <h4 className="font-bold text-amber-900 dark:text-amber-400 mb-2">Need Help?</h4>
                        <p className="text-sm text-amber-800/70 dark:text-amber-400/70">Send digital invites to your guests to track RSVPs automatically.</p>
                        <Button className="w-full mt-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold">
                            Send Digital Invites
                        </Button>
                    </div>
                </div>
            </div>

            {/* Add Guest Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-8 shadow-2xl">
                        <h2 className="text-2xl font-black mb-6">Add New Guest</h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-neutral-500">Name</label>
                                <Input value={newGuest.name} onChange={e => setNewGuest({...newGuest, name: e.target.value})} className="rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-neutral-500">Email</label>
                                <Input type="email" value={newGuest.email} onChange={e => setNewGuest({...newGuest, email: e.target.value})} className="rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-neutral-500">Phone</label>
                                <Input type="tel" value={newGuest.phone} onChange={e => setNewGuest({...newGuest, phone: e.target.value})} className="rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-neutral-500">Group</label>
                                <select 
                                    className="w-full bg-neutral-50 dark:bg-slate-800 p-3 rounded-xl outline-none"
                                    value={newGuest.group}
                                    onChange={e => setNewGuest({...newGuest, group: e.target.value})}
                                >
                                    {groups.filter(g => g !== 'All').map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-4 mt-8">
                            <Button onClick={() => setIsAddModalOpen(false)} className="flex-1 rounded-xl bg-neutral-100 text-neutral-900 font-bold hover:bg-neutral-200">Cancel</Button>
                            <Button 
                                onClick={() => createMutation.mutate(newGuest)} 
                                disabled={createMutation.isPending || !newGuest.name}
                                className="flex-1 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700"
                            >
                                {createMutation.isPending ? 'Adding...' : 'Add Guest'}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default GuestList;
