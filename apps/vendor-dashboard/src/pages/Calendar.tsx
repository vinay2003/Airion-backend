import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Filter, Plus, Calendar as CalendarIcon, Clock, MapPin, Users, MoreVertical, Search, CheckCircle, PlusCircle } from 'lucide-react';
import { Button, Badge, Skeleton } from '@airion/ui';
import { useAuth } from '@airion/shared';
import { bookingService } from '@airion/shared/lib/services/bookingService';
import { useQuery } from '@tanstack/react-query';

const CalendarPage: React.FC = () => {
    const { user } = useAuth();
    const vendorId = user?.vendor?.id || user?.id || '';
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<number | null>(new Date().getDate());

    const { data: bookings, isLoading } = useQuery({
        queryKey: ['vendor-bookings-calendar', vendorId],
        queryFn: () => vendorId ? bookingService.getVendorBookings(vendorId).catch(() => null) : Promise.resolve(null),
        enabled: !!vendorId
    });

    const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    // Group bookings by day for easy access
    const bookingsOnDays = useMemo(() => {
        const map: {[key: number]: any[]} = {};
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
            days.push(<div key={`prev-${i}`} className="h-28 md:h-32 border-b border-r border-[var(--airion-border-subtle)] bg-[var(--airion-bg-elevated)]/30"></div>);
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
                    className={`h-28 md:h-32 border-b border-r border-[var(--airion-border-subtle)] p-2 transition-all cursor-pointer hover:bg-[var(--airion-brand-primary)]/5 group relative ${isSelected ? 'bg-[var(--airion-brand-primary)]/10' : ''}`}
                >
                    <div className="flex justify-between items-start">
                        <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold ${
                            isToday ? 'bg-[var(--airion-brand-primary)] text-white shadow-lg shadow-indigo-500/30' : 
                            isSelected ? 'text-[var(--airion-brand-primary)] bg-[var(--airion-brand-primary)]/20' : 'text-[var(--airion-text-primary)]'
                        }`}>
                            {d}
                        </span>
                        {hasBooking && (
                            <div className="w-2 h-2 rounded-full bg-[var(--airion-brand-primary)] animate-pulse"></div>
                        )}
                    </div>
                    
                    <div className="mt-2 space-y-1">
                        {hasBooking?.slice(0, 2).map((b) => (
                            <div key={b.id} className={`px-2 py-0.5 rounded text-[9px] font-bold truncate ${
                                b.status.toLowerCase() === 'confirmed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 
                                'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            }`}>
                                {b.time} - {b.title}
                            </div>
                        ))}
                        {hasBooking && hasBooking.length > 2 && (
                            <div className="text-[9px] text-[var(--airion-text-muted)] font-bold ml-2">+{hasBooking.length - 2} more</div>
                        )}
                    </div>
                    
                    {/* Add Button on hover */}
                    <button className="absolute bottom-2 right-2 p-1.5 bg-[var(--airion-bg-surface)] border border-[var(--airion-border-subtle)] rounded-lg text-[var(--airion-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity hover:text-[var(--airion-brand-primary)]">
                        <Plus size={14} />
                    </button>
                </div>
            );
        }

        return days;
    };

    const selectedEvents = selectedDate ? bookingsOnDays[selectedDate] || [] : [];

    return (
        <div className="space-y-6 animate-fadeIn pb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-[var(--airion-text-primary)] tracking-tight leading-none uppercase">Operational Matrix</h1>
                    <p className="text-[var(--airion-text-muted)] font-black text-[10px] mt-2 uppercase tracking-[0.2em] italic opacity-80">Deployment • Resource Allocation • Performance Log</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-[var(--airion-bg-surface)] border border-[var(--airion-border-base)] p-3 rounded-xl text-[var(--airion-text-secondary)] hover:text-[var(--airion-brand-primary)] transition-all shadow-sm hover:shadow-md active:scale-95">
                        <Filter size={18} />
                    </button>
                    <Button 
                        className="h-11 px-8 rounded-xl font-black text-[10px] uppercase tracking-widest bg-[var(--airion-brand-primary)] text-white shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all active:scale-95" 
                        leftIcon={<PlusCircle size={16} />}
                    >
                        Initialize Cell
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Main Calendar Card */}
                <div className="xl:col-span-3 card-premium !p-0 overflow-hidden flex flex-col bg-[var(--airion-bg-surface)] border-[var(--airion-border-base)] shadow-xl shadow-black/5">
                    {/* Calendar Header */}
                    <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[var(--airion-border-subtle)] bg-[var(--airion-bg-elevated)]/30 backdrop-blur-md">
                        <div className="flex items-center gap-6">
                            <h2 className="text-2xl font-black text-[var(--airion-text-primary)] tracking-tight uppercase italic drop-shadow-sm">
                                {monthNames[currentDate.getMonth()]} 
                                <span className="text-[var(--airion-text-muted)] not-italic font-black ml-2 opacity-30">{currentDate.getFullYear()}</span>
                            </h2>
                            <div className="flex bg-[var(--airion-bg-base)] rounded-xl p-1 border border-[var(--airion-border-subtle)]">
                                <button 
                                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} 
                                    className="p-2 hover:bg-[var(--airion-bg-surface)] rounded-lg text-[var(--airion-text-muted)] hover:text-[var(--airion-brand-primary)] transition-all"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <button 
                                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} 
                                    className="p-2 hover:bg-[var(--airion-bg-surface)] rounded-lg text-[var(--airion-text-muted)] hover:text-[var(--airion-brand-primary)] transition-all"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-1 bg-[var(--airion-bg-base)] p-1 rounded-xl border border-[var(--airion-border-subtle)]">
                            <button className="px-5 py-2 text-[10px] font-black uppercase tracking-widest bg-[var(--airion-bg-surface)] border border-[var(--airion-border-base)] text-[var(--airion-brand-primary)] rounded-lg shadow-sm">Portal</button>
                            <button className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-[var(--airion-text-muted)] hover:text-[var(--airion-text-primary)] transition-colors">Phase</button>
                            <button className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-[var(--airion-text-muted)] hover:text-[var(--airion-text-primary)] transition-colors">Node</button>
                        </div>
                    </div>

                    {/* Day Headers */}
                    <div className="grid grid-cols-7 border-b border-[var(--airion-border-subtle)] bg-[var(--airion-bg-elevated)]/50">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                            <div key={day} className="py-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-[var(--airion-text-muted)]">{day}</div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 flex-1">
                        {isLoading ? (
                            <div className="col-span-7 h-96 flex flex-col items-center justify-center gap-4 bg-[var(--airion-bg-elevated)]/10">
                                <div className="w-12 h-12 border-4 border-[var(--airion-brand-primary)]/20 border-t-[var(--airion-brand-primary)] rounded-full animate-spin"></div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--airion-text-muted)]">Parsing Temporal Flux...</p>
                            </div>
                        ) : renderCalendar()}
                    </div>
                </div>

                {/* Selected Date Details Sidebar */}
                <div className="xl:col-span-1 space-y-6">
                    <div className="card-premium p-6 bg-[var(--airion-bg-surface)] border-[var(--airion-border-base)] h-fit sticky top-[100px]">
                        <div className="flex justify-between items-center mb-8 pb-4 border-b border-[var(--airion-border-subtle)]">
                            <div>
                                <h3 className="font-black text-xl text-[var(--airion-text-primary)] uppercase tracking-tight">Timeline</h3>
                                <p className="text-[10px] text-[var(--airion-brand-primary)] font-black uppercase mt-1 tracking-wider">{selectedDate} {monthNames[currentDate.getMonth()]}</p>
                            </div>
                            <div className="p-3 bg-[var(--airion-brand-primary)]/10 rounded-2xl shadow-inner">
                                <CalendarIcon className="text-[var(--airion-brand-primary)]" size={24} />
                            </div>
                        </div>

                        {selectedEvents.length > 0 ? (
                            <div className="space-y-4">
                                {selectedEvents.map((ev) => (
                                    <div key={ev.id} className="relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1.5 before:bg-[var(--airion-brand-primary)] before:rounded-full group hover:bg-[var(--airion-bg-elevated)]/50 p-4 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-[var(--airion-border-subtle)]">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-black text-sm text-[var(--airion-text-primary)] group-hover:text-[var(--airion-brand-primary)] transition-colors leading-tight">{ev.title}</h4>
                                            <button className="text-[var(--airion-text-muted)] hover:text-[var(--airion-text-primary)] transition-colors p-1"><MoreVertical size={14} /></button>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-[11px] text-[var(--airion-text-secondary)] font-bold">
                                                <Clock size={14} className="text-[var(--airion-brand-primary)]" />
                                                {ev.time}
                                            </div>
                                            <div className="flex items-center gap-3 text-[11px] text-[var(--airion-text-secondary)] font-bold">
                                                <Users size={14} className="text-[var(--airion-brand-primary)]" />
                                                {ev.client}
                                            </div>
                                            <div className="pt-2">
                                                <Badge variant={ev.status.toLowerCase() === 'confirmed' ? 'confirmed' : 'pending'} className="rounded-lg px-3 py-1 font-black text-[9px] uppercase tracking-widest">
                                                    {ev.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-16 text-center bg-[var(--airion-bg-base)] rounded-3xl border border-dashed border-[var(--airion-border-base)] px-4">
                                <div className="w-20 h-20 bg-[var(--airion-bg-surface)] rounded-full flex items-center justify-center mx-auto mb-6 border border-[var(--airion-border-subtle)] shadow-inner">
                                    <MapPin size={28} className="text-[var(--airion-text-muted)] opacity-40" />
                                </div>
                                <p className="text-[10px] font-black text-[var(--airion-text-muted)] uppercase tracking-[0.2em]">Zero Events Logged</p>
                                <button className="mt-6 text-[10px] font-black text-[var(--airion-brand-primary)] hover:text-[var(--airion-brand-secondary)] uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mx-auto ring-1 ring-[var(--airion-brand-primary)]/20 px-4 py-2 rounded-full hover:bg-[var(--airion-brand-primary)]/5">
                                    <PlusCircle size={14} />
                                    Reserve Node
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;
