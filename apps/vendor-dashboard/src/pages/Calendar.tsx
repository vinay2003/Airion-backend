import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Filter, Calendar as CalendarIcon, Clock, MapPin, Users, MoreVertical, PlusCircle, Target, Activity } from 'lucide-react';
import { Button, Badge, Skeleton } from '@ease2event/ui';
import { useAuth } from '@ease2event/shared';
import { bookingService } from '@ease2event/shared/lib/services/bookingService';
import { useQuery } from '@tanstack/react-query';

/**
 * 🗓 Operational Matrix (Calendar)
 * Modernized with theme-aware tokens, large typography, and premium glassmorphism.
 */
const CalendarPage: React.FC = () => {
    const { user } = useAuth();
    const vendorId = user?.vendor?.id || user?.id || '';
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<number | null>(new Date().getDate());
    const [activeView, setActiveView] = useState('portal');

    const { data: bookings, isLoading } = useQuery({
        queryKey: ['vendor-bookings-calendar', vendorId],
        queryFn: () => vendorId ? bookingService.getVendorBookings(vendorId).catch(() => null) : Promise.resolve(null),
        enabled: !!vendorId
    });

    const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const bookingsOnDays = useMemo(() => {
        const map: { [key: number]: any[] } = {};
        if (!bookings) return map;

        bookings.forEach(b => {
            const date = new Date(b.eventDate);
            if (date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear()) {
                const day = date.getDate();
                if (!map[day]) map[day] = [];
                map[day].push({
                    id: b.id,
                    title: b.listingName || 'Service Booking',
                    time: new Date(b.eventDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                    client: b.userName || 'Customer',
                    status: b.status.charAt(0).toUpperCase() + b.status.slice(1)
                });
            }
        });
        return map;
    }, [bookings, currentDate]);

    const renderCalendar = () => {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const totalDays = daysInMonth(month, year);
        const startOffset = firstDayOfMonth(month, year);
        const days = [];

        // Previous month filler
        for (let i = 0; i < startOffset; i++) {
            days.push(<div key={`prev-${i}`} className="h-28 border-b border-r border-[var(--ease2event-border-subtle)] bg-[var(--ease2event-bg-elevated)]/30"></div>);
        }

        // Current month
        for (let d = 1; d <= totalDays; d++) {
            const hasBooking = bookingsOnDays[d];
            const isSelected = selectedDate === d;
            const isToday = d === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();

            days.push(
                <div
                    key={d}
                    onClick={() => setSelectedDate(d)}
                    className={`h-28 border-b border-r border-[var(--ease2event-border-subtle)] p-4 transition-all cursor-pointer hover:bg-[var(--ease2event-brand-primary)]/5 group relative ${isSelected ? 'bg-[var(--ease2event-bg-elevated)]' : ''}`}
                >
                    <div className="flex justify-between items-start">
                        <span className={`w-10 h-10 flex items-center justify-center rounded-2xl text-base font-black ${isToday ? 'bg-[var(--ease2event-brand-primary)] text-white shadow-xl shadow-blue-500/20 italic' :
                            isSelected ? 'text-[var(--ease2event-brand-primary)] bg-blue-500/10 border border-blue-500/20' : 'text-[var(--ease2event-text-primary)]'
                            }`}>
                            {d}
                        </span>
                        {hasBooking && (
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.6)] animate-pulse"></div>
                        )}
                    </div>

                    <div className="mt-4 space-y-2">
                        {hasBooking?.slice(0, 2).map((b) => (
                            <div key={b.id} className={`px-4 py-1 rounded-lg text-sm font-black truncate border transition-all ${b.status.toLowerCase() === 'confirmed' ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/20' :
                                'bg-amber-500/5 text-amber-500 border-amber-500/20'
                                }`}>
                                {b.time} - {b.title}
                            </div>
                        ))}
                        {hasBooking && hasBooking.length > 2 && (
                            <div className="text-sm text-[var(--ease2event-text-muted)] font-black italic ml-2">+{hasBooking.length - 2} NODES</div>
                        )}
                    </div>
                </div>
            );
        }

        return days;
    };

    const selectedEvents = selectedDate ? bookingsOnDays[selectedDate] || [] : [];

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-24">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-[var(--ease2event-border-subtle)] pb-6">
                <div className="space-y-4">
                    <h1 className="text-3xl font-normal normal-case not-italic tracking-normal leading-normal">Master Schedule</h1>
                    <p className="text-lg font-bold text-[var(--ease2event-text-muted)] flex items-center gap-3 uppercase tracking-widest italic opacity-60">
                        <Activity size={20} className="text-[var(--ease2event-brand-primary)]" />
                        Deployment Schedule • Resource Allocation • Performance Log
                    </p>
                </div>
                <div className="flex items-center gap-5">
                    <Button variant="secondary" className="h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-widest" leftIcon={<Filter size={20} />}>
                        Filter Registry
                    </Button>
                    <Button className="h-14 px-10 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl bg-[var(--ease2event-brand-primary)] text-white shadow-indigo-500/20" leftIcon={<PlusCircle size={20} />}>
                        Initialize Cell
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
                {/* Main Calendar Card */}
                <div className="xl:col-span-3 card-minimal !p-0 overflow-hidden flex flex-col rounded-[3rem] border-[var(--ease2event-border-base)] shadow-2xl bg-[var(--ease2event-bg-surface)]">
                    {/* Calendar Selection Matrix */}
                    <div className="p-4 md:p-8 bg-[var(--ease2event-bg-surface)] border-b border-[var(--ease2event-border-subtle)]">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 bg-[var(--ease2event-bg-elevated)]/50 p-2 md:p-4 rounded-[2rem] border-2 border-[var(--ease2event-border-subtle)] transition-all shadow-sm">
                            <div className="flex items-center gap-4 md:gap-8 w-full md:w-auto">
                                <div className="flex bg-[var(--ease2event-bg-elevated)]/40 rounded-full p-1.5 border border-[var(--ease2event-border-subtle)] shadow-inner shrink-0">
                                    <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-[var(--ease2event-bg-surface)] rounded-full text-[var(--ease2event-text-primary)] hover:text-[var(--ease2event-brand-primary)] transition-all border border-[var(--ease2event-border-subtle)] shadow-sm">
                                        <ChevronLeft size={18} />
                                    </button>
                                    <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-[var(--ease2event-bg-surface)] rounded-full text-[var(--ease2event-text-primary)] hover:text-[var(--ease2event-brand-primary)] transition-all border border-[var(--ease2event-border-subtle)] ml-1 shadow-sm">
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                                <h2 className="text-xl md:text-3xl font-black text-[var(--ease2event-text-primary)] tracking-tighter uppercase italic truncate min-w-0 font-display">
                                    {monthNames[currentDate.getMonth()]}
                                    <span className="text-[var(--ease2event-brand-primary)] font-black ml-2 md:ml-4 tracking-wide text-lg md:text-2xl">
                                        {currentDate.getFullYear()}
                                    </span>                                </h2>
                            </div>

                        </div>
                    </div>

                    <div className="overflow-x-auto scrollbar-hide">
                        <div className="min-w-[800px] flex flex-col">
                            <div className="grid grid-cols-7 border-b border-[var(--ease2event-border-subtle)] bg-[var(--ease2event-bg-elevated)]/50">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                    <div key={day} className="py-4 text-center text-sm font-black uppercase tracking-[0.2em] text-[var(--ease2event-text-muted)]">{day}</div>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 flex-1">
                                {isLoading ? (
                                    <div className="col-span-7 h-[600px] p-10 space-y-4">
                                        <Skeleton className="w-full h-full rounded-2xl" />
                                    </div>
                                ) : renderCalendar()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Selected Date Details Sidebar */}
                <div className="xl:col-span-1 space-y-8">
                    <div className="card-minimal !p-8 rounded-[2.5rem] border-[var(--ease2event-border-base)] shadow-2xl space-y-8 h-fit bg-[var(--ease2event-bg-surface)]">
                        <div className="flex justify-between items-center bg-[var(--ease2event-bg-elevated)] p-5 rounded-[2rem] border border-[var(--ease2event-border-subtle)] shadow-inner">
                            <div className="space-y-1">
                                <h3 className="font-black text-xl text-[var(--ease2event-text-primary)] uppercase tracking-tighter italic font-display">Schedule</h3>
                                <p className="text-[15px] text-[var(--ease2event-brand-primary)] font-black uppercase tracking-[0.2em] italic">{selectedDate} {monthNames[currentDate.getMonth()]}</p>
                            </div>
                            <div className="w-12 h-12 bg-[var(--ease2event-brand-primary)]/10 rounded-[1.25rem] flex items-center justify-center border border-[var(--ease2event-brand-primary)]/20 shadow-lg text-[var(--ease2event-brand-primary)]">
                                <CalendarIcon size={24} />
                            </div>
                        </div>

                        {selectedEvents.length > 0 ? (
                            <div className="space-y-6">
                                {selectedEvents.map((ev) => (
                                    <div key={ev.id} className="relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1.5 before:bg-[var(--ease2event-brand-primary)] before:rounded-full group hover:bg-[var(--ease2event-bg-elevated)]/50 p-5 rounded-[1.5rem] transition-all cursor-pointer border border-[var(--ease2event-border-subtle)] shadow-sm hover:shadow-xl hover:scale-[1.02]">
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="font-black text-md text-[var(--ease2event-text-primary)] group-hover:text-[var(--ease2event-brand-primary)] transition-colors uppercase italic leading-tight">{ev.title}</h4>
                                            <button className="text-[var(--ease2event-text-muted)] hover:text-[var(--ease2event-text-primary)] transition-colors"><MoreVertical size={16} /></button>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-sm text-[var(--ease2event-text-muted)] font-black uppercase tracking-widest italic opacity-60">
                                                <Clock size={14} className="text-[var(--ease2event-brand-primary)]" />
                                                {ev.time}
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-[var(--ease2event-text-muted)] font-black uppercase tracking-widest italic opacity-60">
                                                <Users size={14} className="text-[var(--ease2event-brand-primary)]" />
                                                {ev.client}
                                            </div>
                                            <Badge className={`px-3 h-7 rounded-lg font-black text-[8px] uppercase tracking-widest border ${ev.status.toLowerCase() === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                                                {ev.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center bg-[var(--ease2event-bg-elevated)]/30 rounded-[3rem] border-2 border-dashed border-[var(--ease2event-border-base)] space-y-6">
                                <div className="w-20 h-20 bg-[var(--ease2event-bg-surface)] rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl border border-[var(--ease2event-border-subtle)] relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-[var(--ease2event-brand-primary)]/5 group-hover:scale-150 transition-transform duration-1000" />
                                    <Target size={32} className="text-[var(--ease2event-text-muted)] relative z-10 opacity-40" />
                                </div>
                                <div className="px-6 space-y-2">
                                    <p className="text-sm font-black text-[var(--ease2event-text-muted)] uppercase tracking-[0.3em] italic opacity-60">No Temporal Nodes Found</p>
                                    <button className="text-sm font-black text-[var(--ease2event-brand-primary)] hover:text-[var(--ease2event-brand-secondary)] uppercase tracking-[0.2em] transition-all underline decoration-2 underline-offset-8 italic leading-loose md:leading-normal">INITIATE BLOCK SEQUENCE</button>
                                </div>
                            </div>
                        )}

                        <Button className="w-full !h-16 text-xs font-black uppercase tracking-[0.2em] rounded-[1.5rem] shadow-2xl italic bg-[var(--ease2event-brand-primary)] text-white shadow-indigo-500/20">
                            Log New Operation
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;
