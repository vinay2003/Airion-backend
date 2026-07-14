import React, { useState } from 'react';
import {
 Calendar as CalendarIcon,
 Search,
 Clock,
 MapPin,
 Users,
 DollarSign,
 CheckCircle,
 XCircle,
 AlertCircle,
 ChevronRight,
 MoreVertical,
 Target,
 Activity,
 Zap,
 Filter,
 Plus
} from 'lucide-react';
import { Tabs, Input, Button, Badge, Modal, notify } from '@ease2event/ui';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

 interface Booking {
 id: string;
 venueName: string;
 clientName: string;
 date: string;
 time: string;
 guests: number;
 amount: string;
 status: string;
 eventType: string;
 }

/**
 * 🎫 Booking Registry: High-Fidelity Management Interface
 * Refactored for 'Premium SaaS' aesthetics and theme-aware interactivity.
 */
const Bookings: React.FC = () => {
 const queryClient = useQueryClient();
 const [filter, setFilter] = useState<string>('all');
 const [searchQuery, setSearchQuery] = useState('');
 const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
 const [isDetailsOpen, setIsDetailsOpen] = useState(false);

 const { data: bookings = [], isLoading } = useQuery({
 queryKey: ['vendor-bookings'],
 queryFn: async () => {
 const res: any = await api.get('/bookings/vendor');
 return res.data.map((b: any) => ({
 id: b.id,
 venueName: b.service?.title || 'Main Hub',
 clientName: b.user?.name || 'Customer Node',
 date: b.eventDate ? new Date(b.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD',
 time: '10:00 AM - 06:00 PM', // Placeholder unless stored in DB
 guests: 100, // Placeholder
 amount: `₹${Number(b.totalAmount).toLocaleString()}`,
 status: b.status.charAt(0).toUpperCase() + b.status.slice(1),
 eventType: b.service?.title || 'General Booking'
 }));
 }
 });

 const stats = [
 { label: 'Total Volume', value: bookings.length.toString(), icon: Activity, trend: '+12%' },
 { label: 'Active Pipeline', value: bookings.filter((b: Booking) => b.status === 'Confirmed').length.toString(), icon: Zap, trend: '+5%' },
 { label: 'Pending Nodes', value: bookings.filter((b: Booking) => b.status === 'Pending').length.toString(), icon: Clock, trend: '-2%' },
 { label: 'Target Capture', value: `₹${bookings.reduce((sum: number, b: Booking) => sum + parseInt(b.amount.replace(/[^0-9.-]+/g,"")), 0).toLocaleString()}`, icon: Target, trend: '+18%' },
 ];

 const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');



 const tabsData = [
 { id: 'all', label: 'All Clusters' },
 { id: 'Confirmed', label: 'Confirmed' },
 { id: 'Pending', label: 'In_Hold' },
 { id: 'Cancelled', label: 'Terminated' },
 ];

 const updateStatusMutation = useMutation({
 mutationFn: async ({ id, status }: { id: string, status: string }) => {
 return api.patch(`/bookings/${id}/status`, { status });
 },
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: ['vendor-bookings'] });
 notify.success('Booking Status Updated');
 }
 });

 const handleApprove = (id: string) => {
 updateStatusMutation.mutate({ id, status: 'confirmed' });
 };

 const handleOpenDetails = (booking: Booking) => {
 setSelectedBooking(booking);
 setIsDetailsOpen(true);
 };

 const filteredBookings = bookings.filter((booking: Booking) => {
 const matchesFilter = filter === 'all' || booking.status.toLowerCase() === filter.toLowerCase();
 const matchesSearch = booking.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
 booking.venueName.toLowerCase().includes(searchQuery.toLowerCase());
 return matchesFilter && matchesSearch;
 });

 return (
 <div
 
 
 
 className="space-y-6 pb-6 px-6 w-full max-w-7xl mx-auto"
 >
 {/* Header: Operational Matrix */}
 <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pt-0 pb-6 border-b border-[var(--ease2event-border-subtle)]">
 <div >
 <h1 className="text-xl font-bold tracking-tight text-[var(--ease2event-text-primary)]">Bookings Manager</h1>
 <div className="flex items-center gap-3 mt-2">
 <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded-full border border-blue-500/30">
 <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
 Connected
 </span>
 <p className="text-[var(--ease2event-text-secondary)] font-bold text-[12px] tracking-widest leading-none">Manage your upcoming events and client coordination</p>
 </div>
 </div>

 <div className="flex bg-[var(--ease2event-bg-elevated)] p-1.5 rounded-2xl border border-[var(--ease2event-border-subtle)] ">
 <button
 onClick={() => setViewMode('daily')}
 className={`px-6 py-2.5 text-sm font-bold tracking-widest rounded-xl transition-all ${viewMode === 'daily'
 ? 'bg-[var(--ease2event-bg-surface)] text-[var(--ease2event-brand-primary)] border border-[var(--ease2event-border-base)]'
 : 'text-[var(--ease2event-text-secondary)] hover:text-[var(--ease2event-text-primary)]'
 }`}
 >
 Daily
 </button>
 <button
 onClick={() => setViewMode('weekly')}
 className={`px-6 py-2.5 text-sm font-bold tracking-widest rounded-xl transition-all ${viewMode === 'weekly'
 ? 'bg-[var(--ease2event-bg-surface)] text-[var(--ease2event-brand-primary)] border border-[var(--ease2event-border-base)]'
 : 'text-[var(--ease2event-text-secondary)] hover:text-[var(--ease2event-text-primary)]'
 }`}
 >
 Weekly
 </button>
 </div>
 </div>

 {/* Smart Stats Grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
 {stats.map((stat, idx) => (
 <div
 key={idx}
 className="card-minimal p-7 flex flex-col justify-between group cursor-pointer transition-all relative overflow-hidden bg-[var(--ease2event-bg-surface)] border-[var(--ease2event-border-base)]"
 >
 <div className="flex justify-between items-start mb-8 relative z-10">
 <div className="p-4 rounded-2xl bg-[var(--ease2event-bg-elevated)] text-[var(--ease2event-brand-primary)] group-hover:bg-[var(--ease2event-brand-primary)] group-hover:text-white transition-all border border-[var(--ease2event-border-subtle)]">
 <stat.icon size={22} className="group-hover:rotate-12 transition-all " />
 </div>
 <span className="text-sm font-black px-2 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-lg">{stat.trend}</span>
 </div>
 <div className="relative z-10">
 <p className="text-[var(--ease2event-text-secondary)] font-bold text-xs tracking-widest mb-2 group-hover:text-[var(--ease2event-brand-primary)] transition-all">{stat.label}</p>
 <h3 className="text-lg font-bold text-[var(--ease2event-text-primary)] tracking-tighter leading-none">{stat.value}</h3>
 </div>
 <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
 <stat.icon size={110} />
 </div>
 </div>
 ))}
 </div>

 {/* Filters & Navigation */}
 <div className="flex flex-col xl:flex-row gap-5 justify-between items-start xl:items-center py-6">
 <div className="flex flex-wrap gap-2 bg-[var(--ease2event-bg-elevated)] p-1.5 rounded-2xl border border-[var(--ease2event-border-subtle)] w-full xl:w-auto">
 {tabsData.map(tab => (
 <button
 key={tab.id}
 onClick={() => setFilter(tab.id as any)}
 className={`flex-1 sm:flex-none px-5 py-3 text-sm font-bold tracking-widest rounded-xl transition-all whitespace-nowrap ${filter === tab.id ? 'bg-[var(--ease2event-brand-primary)] text-white /20' : 'text-[var(--ease2event-text-secondary)] hover:text-[var(--ease2event-text-primary)]'}`}
 >
 {tab.label}
 </button>
 ))}
 </div>
 <div className="relative w-full xl:w-96">
 <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--ease2event-text-muted)]" size={18} />
 <input
 placeholder="Filter by client / venue..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full pl-14 pr-6 py-4 bg-[var(--ease2event-bg-elevated)]/50 border border-[var(--ease2event-border-subtle)] rounded-2xl text-sm font-normal not-italic outline-none focus:ring-2 focus:ring-[var(--ease2event-brand-primary)]/20 transition-all text-[var(--ease2event-text-primary)] normal-case tracking-normal"
 />
 </div>
 </div>

 {/* Registry Flow (The \"Table\" replacement) */}
 <div className="grid grid-cols-1 gap-6">
 {viewMode === 'weekly' ? (
 <div
 key="weekly-timeline"
 className="bg-[var(--ease2event-bg-elevated)]/30 rounded-xl border border-[var(--ease2event-border-subtle)] p-6 "
 >
 <div className="flex items-center justify-between mb-10">
 <h2 className="text-lg font-bold tracking-tighter text-[var(--ease2event-text-primary)]">Weekly Timeline</h2>
 <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-xl border border-emerald-500/20 text-[10px] font-black tracking-widest">
 <Clock size={14} /> Real-time Sync
 </div>
 </div>
 <div className="overflow-x-auto pb-6 scrollbar-hide">
 <div className="grid grid-cols-7 gap-6 min-w-[1000px] lg:min-w-0">
 {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
 <div key={day} className="flex flex-col gap-6">
 <div className="text-center py-4 bg-[var(--ease2event-bg-surface)] rounded-2xl border border-[var(--ease2event-border-subtle)] ">
 <p className="text-[11px] font-black text-[var(--ease2event-brand-primary)] tracking-[0.2em]">{day}</p>
 </div>
 <div className="flex-1 min-h-[250px] bg-[var(--ease2event-bg-elevated)]/40 rounded-3xl border border-dashed border-[var(--ease2event-border-subtle)]/40 flex flex-col items-center justify-start p-3 gap-4">
 {day === 'Wed' || day === 'Sat' ? (
 <div className="w-full p-5 bg-white dark:bg-slate-800 rounded-2xl border border-[var(--ease2event-border-subtle)] hover:scale-[1.05] transition-all cursor-pointer ">
 <div className="flex items-center gap-2 mb-2">
 <Clock size={12} className="text-[var(--ease2event-brand-primary)]" />
 <p className="text-[9px] font-black text-[var(--ease2event-text-secondary)] tracking-widest">10:00 AM</p>
 </div>
 <p className="text-xs font-bold text-[var(--ease2event-text-primary)] leading-tight">Wedding Reception</p>
 <p className="text-[8px] font-bold text-[var(--ease2event-text-muted)] mt-2">Grand Ballroom</p>
 </div>
 ) : (
 <div className="mt-20 w-10 h-10 rounded-full border-2 border-dashed border-[var(--ease2event-text-muted)]/10 flex items-center justify-center">
 <Plus size={14} className="text-[var(--ease2event-text-muted)]/20" />
 </div>
 )}
 </div>
 </div>
 ))}
 </div>
 </div>
 <div className="mt-10 p-6 bg-[var(--ease2event-brand-primary)]/5 rounded-2xl border border-[var(--ease2event-brand-primary)]/20">
 <p className="text-sm font-bold text-[var(--ease2event-brand-primary)] flex items-center gap-2">
 <AlertCircle size={18} /> PRO TIP: Your weekly capacity is at 85% for this cluster.
 </p>
 </div>
 </div>
 ) : (
 <>
 {isLoading ? (
 <div className="text-center py-24 text-[var(--ease2event-text-secondary)]">Loading bookings...</div>
 ) : (
 filteredBookings.map((booking: Booking) => (
 <div
 key={booking.id}
 className="card-minimal !p-0 overflow-hidden  transition-all group bg-[var(--ease2event-bg-surface)] border-[var(--ease2event-border-base)] "
 >
 <div className="flex flex-col xl:flex-row xl:items-stretch">
 {/* Left Side: Branding */}
 <div className="xl:w-2/3 p-5 flex flex-col justify-between border-b xl:border-b-0 xl:border-r border-[var(--ease2event-border-subtle)]">
 <div className="flex flex-col justify-between h-full">
 <div className="space-y-6">
 <div className="space-y-1">
 <div className="flex items-center gap-3 flex-wrap">
 <h3 className="text-sm sm:text-base font-bold text-[var(--ease2event-text-primary)] tracking-tight leading-tight group-hover:text-[var(--ease2event-brand-primary)] transition-colors">{booking.venueName}</h3>
 <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></div>
 </div>
 <p className="text-[10px] sm:text-xs font-bold text-[var(--ease2event-text-secondary)] tracking-[0.15em] leading-relaxed">{booking.eventType}</p>
 </div>

 <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
 <div className="space-y-1.5">
 <p className="text-[10px] font-bold text-[var(--ease2event-text-secondary)] tracking-widest">Venue</p>
 <div className="flex items-center gap-2 text-sm font-bold text-[var(--ease2event-text-primary)]">
 <MapPin size={14} className="text-[var(--ease2event-brand-primary)]" />
 Main Level Hub
 </div>
 </div>
 <div className="space-y-1.5">
 <p className="text-[10px] font-bold text-[var(--ease2event-text-secondary)] tracking-widest">Date</p>
 <div className="flex items-center gap-2 text-sm font-bold text-[var(--ease2event-text-primary)]">
 <CalendarIcon size={14} className="text-[var(--ease2event-brand-primary)]" />
 {booking.date}
 </div>
 </div>
 <div className="space-y-1.5">
 <p className="text-[10px] font-bold text-[var(--ease2event-text-secondary)] tracking-widest">Guests</p>
 <div className="flex items-center gap-2 text-sm font-bold text-[var(--ease2event-text-primary)]">
 <Users size={14} className="text-[var(--ease2event-brand-primary)]" />
 {booking.guests} People
 </div>
 </div>
 <div className="space-y-1.5">
 <p className="text-[10px] font-bold text-[var(--ease2event-text-secondary)] tracking-widest">Amount</p>
 <div className="flex items-center gap-2 text-sm font-bold text-[var(--ease2event-text-primary)]">
 <DollarSign size={14} className="text-emerald-600 dark:text-emerald-400" />
 {booking.amount}
 </div>
 </div>
 </div>
 </div>

 <div className="mt-10 flex justify-start">
 <Badge className={`font-black text-[10px] px-5 py-2.5 rounded-2xl tracking-widest border shrink-0 ${booking.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30' :
 booking.status === 'Pending' ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30' : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30'
 }`}>
 {booking.status}
 </Badge>
 </div>
 </div>
 </div>

 {/* Right Side: Actions & Client */}
 <div className="xl:w-1/3 bg-[var(--ease2event-bg-elevated)]/30 p-5 flex flex-col justify-between">
 <div className="flex justify-between items-start mb-6">
 <div className="space-y-1">
 <p className="text-[10px] font-black text-[var(--ease2event-text-secondary)] tracking-widest opacity-70">Registry Authority</p>
 <h4 className="font-black text-lg text-[var(--ease2event-text-primary)] tracking-tight">{booking.clientName}</h4>
 </div>
 <button className="p-3 bg-[var(--ease2event-bg-surface)] rounded-2xl border border-[var(--ease2event-border-subtle)] text-[var(--ease2event-text-muted)] hover:text-[var(--ease2event-brand-primary)] transition-all">
 <MoreVertical size={16} />
 </button>
 </div>

 <div className="flex gap-4">
 <Button
 onClick={() => handleOpenDetails(booking)}
 className="flex-1 h-12 bg-[var(--ease2event-bg-surface)] border border-[var(--ease2event-border-base)] text-[var(--ease2event-text-primary)] rounded-2xl text-[11px] font-bold tracking-widest hover:bg-[var(--ease2event-bg-elevated)]"
 >
 View Details
 </Button>
 {booking.status === 'Pending' && (
 <Button
 onClick={() => handleApprove(booking.id)}
 className="flex-1 h-12 bg-[var(--ease2event-brand-primary)] text-white /20 rounded-2xl text-[11px] font-bold tracking-widest  transition-all"
 >
 Approve
 </Button>
 )}
 </div>
 </div>
 </div>
 </div>
 )))}

 {filteredBookings.length === 0 && (
  <div
    className="text-center py-24 bg-[var(--ease2event-bg-elevated)]/30 rounded-3xl border border-[var(--ease2event-border-subtle)] border-dashed"
  >
 <AlertCircle size={48} className="mx-auto text-[var(--ease2event-text-secondary)] mb-6 opacity-40 animate-pulse" />
 <h3 className="text-lg font-black text-[var(--ease2event-text-primary)] font-display tracking-tight">Registry Node Empty</h3>
 <p className="text-sm text-[var(--ease2event-text-secondary)] font-black tracking-widest mt-3 opacity-100">Modify filters for new unit synchronization</p>
 </div>
 )}
 </>
 )}
 </div>

 {/* High-Fidelity Details Modal */}
 <Modal
 isOpen={isDetailsOpen}
 onClose={() => setIsDetailsOpen(false)}
 title="Event Particulars"
 size="lg"
 >
 {selectedBooking && (
 <div className="space-y-5 py-4">
 <div className="grid grid-cols-2 gap-5">
 <div className="space-y-1.5">
 <p className="text-[10px] font-black text-[var(--ease2event-text-secondary)] tracking-[0.2em] opacity-60">Venue Node</p>
 <p className="text-sm font-black text-[var(--ease2event-text-primary)]">{selectedBooking.venueName}</p>
 </div>
 <div className="space-y-1.5">
 <p className="text-[10px] font-black text-[var(--ease2event-text-secondary)] tracking-[0.2em] opacity-60">Registry Authority</p>
 <p className="text-sm font-black text-[var(--ease2event-text-primary)]">{selectedBooking.clientName}</p>
 </div>
 <div className="space-y-1.5">
 <p className="text-[10px] font-black text-[var(--ease2event-text-secondary)] tracking-[0.2em] opacity-60">Operational Window</p>
 <p className="text-sm font-black text-[var(--ease2event-text-primary)]">{selectedBooking.date} • {selectedBooking.time}</p>
 </div>
 <div className="space-y-1.5">
 <p className="text-[10px] font-black text-[var(--ease2event-text-secondary)] tracking-[0.2em] opacity-60">Classification</p>
 <p className="text-sm font-black text-[var(--ease2event-text-primary)] ">{selectedBooking.eventType}</p>
 </div>
 <div className="space-y-1.5">
 <p className="text-[10px] font-black text-[var(--ease2event-text-secondary)] tracking-[0.2em] opacity-60">Guest Payload</p>
 <div className="flex items-center gap-2">
 <Users size={14} className="text-[var(--ease2event-brand-primary)]" />
 <p className="text-sm font-black text-[var(--ease2event-text-primary)]">{selectedBooking.guests} Nodes</p>
 </div>
 </div>
 <div className="space-y-1.5">
 <p className="text-[10px] font-black text-[var(--ease2event-text-secondary)] tracking-[0.2em] opacity-60">Transaction Value</p>
 <div className="flex items-center gap-2">
 <DollarSign size={14} className="text-emerald-500" />
 <p className="text-sm font-black text-emerald-500">{selectedBooking.amount}</p>
 </div>
 </div>
 </div>

 <div className="p-6 bg-[var(--ease2event-bg-elevated)]/50 rounded-2xl border border-[var(--ease2event-border-subtle)]">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="p-2 bg-[var(--ease2event-bg-surface)] rounded-xl border border-[var(--ease2event-border-subtle)]">
 <Activity size={16} className="text-[var(--ease2event-brand-primary)]" />
 </div>
 <p className="text-[11px] font-black text-[var(--ease2event-text-primary)] tracking-widest">Operational Status</p>
 </div>
 <Badge
 variant={selectedBooking.status.toLowerCase() as any}
 className="font-black text-[9px] tracking-widest px-4"
 >
 {selectedBooking.status}
 </Badge>
 </div>
 </div>
 </div>
 )}
 </Modal>
 </div>
 );
};

export default Bookings;
