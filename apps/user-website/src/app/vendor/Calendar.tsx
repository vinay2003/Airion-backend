import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Filter, Plus, Calendar as CalendarIcon, Clock, MapPin, Users, MoreVertical, Search, CheckCircle } from 'lucide-react';

const CalendarPage: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<number | null>(new Date().getDate());

    const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    const bookingsOnDays: {[key: number]: any[]} = {
        12: [{ id: 1, title: 'Wedding Reception', time: '6:00 PM', client: 'Arjun Mehra', status: 'Confirmed' }],
        15: [{ id: 2, title: 'Birthday Bash', time: '2:00 PM', client: 'Nisha Sharma', status: 'Pending' }],
        18: [
            { id: 3, title: 'Anniversary Dinner', time: '8:00 PM', client: 'Zoya Khan', status: 'Confirmed' },
            { id: 4, title: 'Corporate Lunch', time: '1:00 PM', client: 'HDFC Bank', status: 'Pending' }
        ],
        22: [{ id: 5, title: 'Engagement Ceremony', time: '4:00 PM', client: 'Rohit Verma', status: 'Confirmed' }],
    };

    const renderCalendar = () => {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const totalDays = daysInMonth(month, year);
        const startOffset = firstDayOfMonth(month, year);
        const days = [];

        // Previous month filler
        for (let i = 0; i < startOffset; i++) {
            days.push(<div key={`prev-${i}`} className="h-28 md:h-32 border-b border-r border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/20"></div>);
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
                    className={`h-28 md:h-32 border-b border-r border-gray-100 dark:border-slate-800 p-2 transition-all cursor-pointer hover:bg-red-50/30 dark:hover:bg-red-500/5 group relative ${isSelected ? 'bg-red-50/50 dark:bg-red-500/10' : ''}`}
                >
                    <div className="flex justify-between items-start">
                        <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold ${
                            isToday ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 
                            isSelected ? 'text-red-500 bg-red-100 dark:bg-red-500/20' : 'text-gray-900 dark:text-white'
                        }`}>
                            {d}
                        </span>
                        {hasBooking && (
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                        )}
                    </div>
                    
                    <div className="mt-2 space-y-1">
                        {hasBooking?.slice(0, 2).map((b) => (
                            <div key={b.id} className={`px-2 py-0.5 rounded text-[9px] font-bold truncate ${
                                b.status === 'Confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 
                                'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400'
                            }`}>
                                {b.time} - {b.title}
                            </div>
                        ))}
                        {hasBooking && hasBooking.length > 2 && (
                            <div className="text-[9px] text-gray-400 font-bold ml-2">+{hasBooking.length - 2} more</div>
                        )}
                    </div>
                    
                    {/* Add Button on hover */}
                    <button className="absolute bottom-2 right-2 p-1.5 bg-gray-100 dark:bg-slate-800 rounded-lg text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500">
                        <Plus size={14} />
                    </button>
                </div>
            );
        }

        return days;
    };

    const selectedEvents = selectedDate ? bookingsOnDays[selectedDate] || [] : [];

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Booking Calendar</h1>
                    <p className="text-gray-500 dark:text-slate-400">View and manage your upcoming schedule</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-2 rounded-xl text-gray-600 dark:text-slate-400 hover:text-red-500 transition-colors">
                        <Filter size={20} />
                    </button>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-red-500/20 transition-all hover:scale-105 transform">
                        <Plus size={20} />
                        Quick Add
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Main Calendar Card */}
                <div className="xl:col-span-3 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                    {/* Calendar Header */}
                    <div className="p-6 flex items-center justify-between border-b border-gray-100 dark:border-slate-800">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl font-bold dark:text-white">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
                            <div className="flex bg-gray-100 dark:bg-slate-950 rounded-xl p-1">
                                <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-gray-500 transition-all">
                                    <ChevronLeft size={18} />
                                </button>
                                <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-gray-500 transition-all">
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="hidden sm:flex gap-2">
                            <button className="px-4 py-2 text-sm font-bold bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-red-500 rounded-xl shadow-sm">Monthly</button>
                            <button className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors">Weekly</button>
                            <button className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors">Daily</button>
                        </div>
                    </div>

                    {/* Day Headers */}
                    <div className="grid grid-cols-7 border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950/20">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                            <div key={day} className="py-3 text-center text-[10px] font-bold uppercase tracking-widest text-gray-400">{day}</div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 flex-1">
                        {renderCalendar()}
                    </div>
                </div>

                {/* Selected Date Details Sidebar */}
                <div className="xl:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="font-bold text-lg dark:text-white uppercase tracking-tight">Today's Schedule</h3>
                                <p className="text-xs text-gray-400 font-bold uppercase">{selectedDate} {monthNames[currentDate.getMonth()]}</p>
                            </div>
                            <CalendarIcon className="text-red-500" size={24} />
                        </div>

                        {selectedEvents.length > 0 ? (
                            <div className="space-y-4">
                                {selectedEvents.map((ev) => (
                                    <div key={ev.id} className="relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-red-500 before:rounded-full group">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-black text-sm dark:text-white group-hover:text-red-500 transition-colors">{ev.title}</h4>
                                            <button className="text-gray-300 hover:text-gray-500 transition-colors"><MoreVertical size={14} /></button>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
                                                <Clock size={12} className="text-red-500" />
                                                {ev.time}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
                                                <Users size={12} className="text-red-500" />
                                                {ev.client}
                                            </div>
                                            <span className={`badge ${ev.status === 'Confirmed' ? 'badge-confirmed' : 'badge-pending'} text-[8px]`}>
                                                {ev.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center">
                                <MapPin size={40} className="mx-auto text-gray-200 mb-4" />
                                <p className="text-sm font-bold text-gray-400 uppercase">No events scheduled</p>
                                <button className="mt-4 text-xs font-black text-red-500 hover:underline">BLOCK THIS DAY</button>
                            </div>
                        )}
                    </div>

                    {/* Progress Card */}
                    <div className="bg-gradient-to-br from-[var(--ease2event-brand-primary)] to-[var(--ease2event-brand-secondary)] rounded-3xl p-6 text-white shadow-xl shadow-red-500/20 relative overflow-hidden group">
                        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="relative z-10">
                            <h3 className="font-black text-lg mb-4 leading-tight">Monthly Target<br />Achived 72%</h3>
                            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mb-4">
                                <div className="h-full bg-white rounded-full w-[72%]"></div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-white/20 border-2 border-red-500 flex items-center justify-center text-[10px] font-bold">
                                            U{i}
                                        </div>
                                    ))}
                                </div>
                                <span className="font-black text-sm uppercase">₹8.4L / 12L</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;
