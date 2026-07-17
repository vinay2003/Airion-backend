import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, MapPin, Search, Users, Check, Minus, Plus, Sparkles, LocateFixed, Loader2, PartyPopper, Heart, Cake, Briefcase, Mic2, Wine, Flower2, Music, Image as ImageIcon, type LucideIcon } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from './ui/popover';
import { POPULAR_LOCATIONS } from '../lib/constants';

const EVENT_TYPES: { value: string; label: string; icon: LucideIcon; color: string; bg: string }[] = [
    { value: 'wedding', label: 'Wedding', icon: Heart, color: 'text-pink-600', bg: 'bg-pink-50 dark:bg-pink-950/40' },
    { value: 'birthday', label: 'Birthday Party', icon: Cake, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/40' },
    { value: 'corporate', label: 'Corporate', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/40' },
    { value: 'conference', label: 'Conference', icon: Mic2, color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-950/40' },
    { value: 'anniversary', label: 'Anniversary', icon: Wine, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/40' },
    { value: 'reception', label: 'Reception', icon: Flower2, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-950/40' },
    { value: 'concert', label: 'Concert', icon: Music, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-950/40' },
    { value: 'exhibition', label: 'Exhibition', icon: ImageIcon, color: 'text-teal-600', bg: 'bg-teal-50 dark:bg-teal-950/40' },
];

const TypewriterEffect = ({ words }: { words: string[] }) => {
    const [index, setIndex] = useState(0);
    const [subIndex, setSubIndex] = useState(0);
    const [reverse, setReverse] = useState(false);
    const [blink, setBlink] = useState(true);

    // Blinking cursor
    React.useEffect(() => {
        const timeout2 = setInterval(() => {
            setBlink((prev) => !prev);
        }, 500);
        return () => clearInterval(timeout2);
    }, []);

    // Typing logic
    React.useEffect(() => {
        if (index >= words.length) {
            setIndex(0); // Loop back
            return;
        }

        if (subIndex === words[index].length + 1 && !reverse) {
            setReverse(true);
            return;
        }

        if (subIndex === 0 && reverse) {
            setReverse(false);
            setIndex((prev) => (prev + 1) % words.length);
            return;
        }

        const timeout = setTimeout(() => {
            setSubIndex((prev) => prev + (reverse ? -1 : 1));
        }, reverse ? 75 : Math.random() * (150 - 50) + 50); // Speed: Deleting is faster

        return () => clearTimeout(timeout);
    }, [subIndex, index, reverse, words]);

    return (
        <span className="flex items-center">
            {`Search city, e.g. "${words[index].substring(0, subIndex)}"`}
            <span className={`ml-0.5 w-[2px] h-4 bg-red-500 ${blink ? 'opacity-100' : 'opacity-0'}`}></span>
        </span>
    );
};

const SearchBar = () => {
    const navigate = useNavigate();
    const [location, setLocation] = useState("");
    const [locationSearch, setLocationSearch] = useState(""); // ✅ search filter state
    const [openLocation, setOpenLocation] = useState(false);
    const [geoLocating, setGeoLocating] = useState(false);
    const [geoError, setGeoError] = useState("");

    const detectCurrentLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setGeoError("Geolocation not supported by your browser.");
            return;
        }
        setGeoLocating(true);
        setGeoError("");
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
                        { headers: { 'Accept-Language': 'en' } }
                    );
                    const data = await res.json();
                    const city =
                        data.address?.city ||
                        data.address?.town ||
                        data.address?.village ||
                        data.address?.county ||
                        data.address?.state ||
                        "";
                    if (city) {
                        // Try to match with POPULAR_LOCATIONS first
                        const matched = POPULAR_LOCATIONS.find(
                            (loc) => loc.label.toLowerCase().includes(city.toLowerCase())
                        );
                        setLocation(matched ? matched.value : city);
                        setOpenLocation(false);
                    } else {
                        setGeoError("Could not determine your city.");
                    }
                } catch {
                    setGeoError("Failed to fetch location name.");
                } finally {
                    setGeoLocating(false);
                }
            },
            (err) => {
                setGeoLocating(false);
                if (err.code === err.PERMISSION_DENIED) {
                    setGeoError("Location access denied. Please allow it in browser settings.");
                } else {
                    setGeoError("Unable to retrieve your location.");
                }
            },
            { timeout: 10000 }
        );
    }, []);

    const [date, setDate] = useState<DateRange | undefined>(undefined);
    const [openDate, setOpenDate] = useState(false);

    const [guests, setGuests] = useState(0);
    const [openGuests, setOpenGuests] = useState(false);

    const [eventType, setEventType] = useState("");
    const [openEventType, setOpenEventType] = useState(false);

    // AI Search States
    const [searchMode, setSearchMode] = useState<'standard' | 'ai'>('standard');
    const [aiQuery, setAiQuery] = useState('');
    const [isListening, setIsListening] = useState(false);
    
    // Voice Recognition setup
    const startListening = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('Speech recognition is not supported in this browser.');
            return;
        }
        
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-IN'; // Indian English optimization
        
        recognition.onstart = () => {
            setIsListening(true);
        };
        
        recognition.onresult = (event: any) => {
            const transcript = Array.from(event.results)
                .map((result: any) => result[0])
                .map(result => result.transcript)
                .join('');
            setAiQuery(transcript);
        };
        
        recognition.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            setIsListening(false);
        };
        
        recognition.onend = () => {
            setIsListening(false);
        };
        
        recognition.start();
    };

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchMode === 'ai' && aiQuery) {
            params.append('ai_query', aiQuery);
        } else {
            if (location) params.append('location', location);
            if (eventType) params.append('category', eventType); // VendorDiscovery reads 'category'
            if (date?.from) params.append('check_in', date.from.toISOString());
            if (date?.to) params.append('check_out', date.to.toISOString());
            if (guests > 0) params.append('guests', guests.toString());
        }
        navigate(`/search?${params.toString()}`);
    };

    return (
        <div className="flex flex-col items-center w-full gap-4 relative z-[100]">
            {/* Search Mode Toggle */}
            <div className="flex items-center gap-2 p-1 bg-white/20 dark:bg-slate-800/50 backdrop-blur-md rounded-full shadow-sm border border-white/30 dark:border-slate-700/50">
                <button
                    type="button"
                    onClick={() => setSearchMode('standard')}
                    className={cn(
                        "px-4 py-1.5 rounded-full text-xs md:text-sm font-bold transition-all duration-300",
                        searchMode === 'standard' ? "bg-white text-gray-900 shadow-md" : "text-white/80 hover:text-white"
                    )}
                >
                    Standard Search
                </button>
                <button
                    type="button"
                    onClick={() => setSearchMode('ai')}
                    className={cn(
                        "px-4 py-1.5 rounded-full text-xs md:text-sm font-bold transition-all duration-300 flex items-center gap-1.5",
                        searchMode === 'ai' ? "bg-red-500 text-white shadow-md shadow-red-500/20" : "text-white/80 hover:text-white"
                    )}
                >
                    <Sparkles size={14} className={searchMode === 'ai' ? "text-white" : "text-red-400"} />
                    AI Assistant
                </button>
            </div>

            <div className={cn(
                "relative bg-white dark:bg-slate-900 p-1.5 shadow-airbnb-hover hover:shadow-[0_20px_50px_-12px_rgba(225,29,72,0.3)] border border-gray-100 dark:border-slate-700 flex flex-col md:flex-row gap-0 md:gap-2 w-full mx-auto transition-all duration-500 overflow-hidden",
                searchMode === 'ai' ? "rounded-[2rem] md:rounded-full max-w-2xl" : "rounded-[2rem] max-w-4xl"
            )}>
                {searchMode === 'ai' ? (
                    <div className="flex items-center w-full px-2">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                            {isListening ? (
                                <div className="relative flex items-center justify-center w-8 h-8">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <Mic2 className="w-5 h-5 text-red-500 relative z-10 animate-pulse" />
                                </div>
                            ) : (
                                <Sparkles className="w-5 h-5 text-red-500" />
                            )}
                        </div>
                        <input 
                            type="text" 
                            value={aiQuery}
                            onChange={(e) => setAiQuery(e.target.value)}
                            placeholder="Describe your dream event... e.g., 'A beach wedding in Goa for 200 guests next month'"
                            className="flex-1 bg-transparent border-none outline-none text-sm md:text-base font-medium text-gray-900 dark:text-white placeholder-gray-400 px-2 h-14"
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button
                            type="button"
                            onClick={startListening}
                            className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all mr-2",
                                isListening ? "bg-red-100 text-red-600" : "hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500"
                            )}
                        >
                            <Mic2 size={18} />
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Location Selector */}
                        <div className="w-full md:w-[230px] md:flex-shrink-0 relative group/input border-b md:border-b-0 border-gray-100 dark:border-slate-800">
                            <Popover open={openLocation} onOpenChange={(open) => {
                                setOpenLocation(open);
                                if (!open) setLocationSearch(""); // reset search when closed
                            }}>
                    <PopoverTrigger asChild>
                        <div className="h-full px-4 md:px-5 py-3 md:py-3 bg-transparent hover:bg-gray-50 dark:hover:bg-slate-800 md:rounded-full rounded-2xl cursor-pointer transition-colors flex items-center gap-3 active:ring-2 active:ring-red-500 overflow-hidden">
                            <MapPin className={`w-5 h-5 shrink-0 ${location ? "text-red-500" : "text-gray-400 group-hover/input:text-red-500"} transition-colors`} />
                            <div className="text-left min-w-0 overflow-hidden flex-1">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 cursor-pointer">Location</label>
                                <div className={`text-sm truncate max-w-full overflow-hidden ${location ? "text-gray-900 dark:text-white font-bold" : "text-gray-400"}`}>
                                    {location ? (
                                        POPULAR_LOCATIONS.find((loc) => loc.value === location)?.label || location
                                    ) : (
                                        <TypewriterEffect words={["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Jaipur", "Goa", "Chennai", "Pune"]} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-[380px] overflow-hidden rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700" align="start" sideOffset={12}>
                        <div className="bg-white dark:bg-slate-900">
                            {/* Use my location button */}
                            <button
                                type="button"
                                onClick={detectCurrentLocation}
                                disabled={geoLocating}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors border-b border-gray-100 dark:border-slate-800 group disabled:opacity-60"
                            >
                                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center shrink-0 group-hover:bg-red-200 transition-colors">
                                    {geoLocating ? (
                                        <Loader2 className="w-4 h-4 text-red-600 animate-spin" />
                                    ) : (
                                        <LocateFixed className="w-4 h-4 text-red-600" />
                                    )}
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-black text-gray-900 dark:text-white group-hover:text-red-600 transition-colors">
                                        {geoLocating ? "Detecting location…" : "Use my current location"}
                                    </p>
                                    {geoError ? (
                                        <p className="text-[10px] text-red-500 font-bold">{geoError}</p>
                                    ) : (
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Auto-detect via GPS</p>
                                    )}
                                </div>
                            </button>
                            {/* Search input */}
                            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-slate-800">
                                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                                <input
                                    autoFocus
                                    type="text"
                                    value={locationSearch}
                                    placeholder="Where are you heading?"
                                    className="w-full bg-transparent outline-none text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400"
                                    onChange={(e) => setLocationSearch(e.target.value)}
                                />
                            </div>
                            {/* Location list */}
                            <div className="py-2 max-h-[300px] overflow-y-auto">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-4 py-2">
                                    {locationSearch ? 'Search Results' : 'Popular Destinations'}
                                </p>
                                {POPULAR_LOCATIONS
                                    .filter(loc => loc.label.toLowerCase().includes(locationSearch.toLowerCase()))
                                    .map((loc) => (
                                        <button
                                            key={loc.value}
                                            type="button"
                                            onClick={() => {
                                                setLocation(loc.value === location ? "" : loc.value);
                                                setOpenLocation(false);
                                            }}
                                            className="w-full flex items-center gap-4 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-950/20 group transition-all text-left"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors shadow-sm shrink-0">
                                                <MapPin className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
                                            </div>
                                            <div className="flex flex-col overflow-hidden flex-1">
                                                <span className="font-black text-gray-900 dark:text-white group-hover:text-red-600 truncate text-sm">
                                                    {loc.label.split(',')[0]}
                                                </span>
                                                <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                                                    {loc.label.split(',')[1]?.trim() || "Local Destination"}
                                                </span>
                                            </div>
                                            <Check className={cn("h-5 w-5 text-red-500 shrink-0", location === loc.value ? "opacity-100" : "opacity-0")} />
                                        </button>
                                    ))}
                                {POPULAR_LOCATIONS.filter(loc => loc.label.toLowerCase().includes(locationSearch.toLowerCase())).length === 0 && (
                                    <p className="text-sm text-gray-400 text-center py-6 font-medium">No destinations found</p>
                                )}
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            <div className="w-full h-px md:w-px md:h-auto bg-gray-100 dark:bg-slate-800 md:my-2"></div>

            {/* Event Type Selector */}
            <div className="w-full md:w-[180px] md:flex-shrink-0 relative group/input border-b md:border-b-0 border-gray-100 dark:border-slate-800">
                <Popover open={openEventType} onOpenChange={setOpenEventType}>
                    <PopoverTrigger asChild>
                        <div className="h-full px-4 md:px-5 py-3 md:py-3 bg-transparent hover:bg-gray-50 dark:hover:bg-slate-800 md:rounded-full rounded-2xl cursor-pointer transition-colors flex items-center gap-3 active:ring-2 active:ring-red-500 overflow-hidden">
                            {(() => {
                                const selected = EVENT_TYPES.find(e => e.value === eventType);
                                const Icon = selected?.icon ?? PartyPopper;
                                return <Icon className={`w-5 h-5 shrink-0 ${eventType ? (selected?.color ?? 'text-red-500') : 'text-gray-400 group-hover/input:text-red-500'} transition-colors`} />;
                            })()}
                            <div className="text-left min-w-0 overflow-hidden flex-1">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 cursor-pointer">Event Type</label>
                                <p className={`text-sm truncate font-bold ${eventType ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                                    {eventType ? EVENT_TYPES.find(e => e.value === eventType)?.label : 'Any Event'}
                                </p>
                            </div>
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-[300px] overflow-hidden rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700" align="start" sideOffset={12}>
                        <div className="bg-white dark:bg-slate-900">
                            <div className="px-4 pt-3 pb-2 border-b border-gray-100 dark:border-slate-800 text-center">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">What's the occasion?</p>
                            </div>
                            <div className="py-1.5 flex flex-col gap-1 p-2 max-h-[300px] overflow-y-auto">
                                {EVENT_TYPES.map((ev) => {
                                    const Icon = ev.icon;
                                    const isSelected = eventType === ev.value;
                                    return (
                                        <button
                                            key={ev.value}
                                            type="button"
                                            onClick={() => {
                                                setEventType(isSelected ? '' : ev.value);
                                                setOpenEventType(false);
                                            }}
                                            className={cn(
                                                'flex items-center gap-3 p-2.5 rounded-xl transition-all border text-left w-full',
                                                isSelected
                                                    ? 'border-red-400 bg-red-50 dark:bg-red-950/30'
                                                    : 'border-transparent hover:border-gray-200 dark:hover:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800'
                                            )}
                                        >
                                            <div className={cn('w-8 h-8 rounded-full flex items-center justify-center shrink-0', ev.bg)}>
                                                <Icon className={cn('w-4 h-4', isSelected ? 'text-red-600' : ev.color)} />
                                            </div>
                                            <span className={cn(
                                                'text-xs font-bold leading-tight',
                                                isSelected ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
                                            )}>{ev.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            <div className="w-full h-px md:w-px md:h-auto bg-gray-100 dark:bg-slate-800 md:my-2"></div>

            {/* Date Range Picker */}
            <div className="w-full md:w-[200px] md:flex-shrink-0 relative group/input">
                <Popover open={openDate} onOpenChange={setOpenDate}>
                    <PopoverTrigger asChild>
                        <div className="h-full px-4 md:px-5 py-3 md:py-3 bg-transparent hover:bg-gray-50 dark:hover:bg-slate-800 md:rounded-full rounded-2xl cursor-pointer transition-colors flex items-center gap-3 active:ring-2 active:ring-red-500">
                            <CalendarIcon className={`w-5 h-5 shrink-0 ${date?.from ? "text-red-500" : "text-gray-400 group-hover/input:text-red-500"} transition-colors`} />
                            <div className="text-left min-w-0 overflow-hidden flex-1">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 cursor-pointer">Date</label>
                                <p className={`text-sm truncate ${date?.from ? "text-gray-900 dark:text-white font-bold" : "text-gray-400"}`}>
                                    {date?.from ? (
                                        date.to ? (
                                            <>
                                                {format(date.from, "LLL dd")} - {format(date.to, "LLL dd")}
                                            </>
                                        ) : (
                                            format(date.from, "LLL dd")
                                        )
                                    ) : (
                                        "Check-in - Check-out"
                                    )}
                                </p>
                            </div>
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-none shadow-2xl overflow-hidden rounded-[2rem]" align="center" sideOffset={12}>
                        <div className="bg-white dark:bg-slate-900 p-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
                            <span className="text-sm font-black uppercase tracking-widest text-gray-400">Select Dates</span>
                            <div className="flex gap-2">
                                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                                <span className="text-[10px] font-bold text-red-500">LIVE AVAILABILITY</span>
                            </div>
                        </div>
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={1}
                            className="bg-white dark:bg-slate-900 min-h-[350px]"
                            showOutsideDays={true}
                            fixedWeeks={true}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            <div className="w-full h-px md:w-px md:h-auto bg-gray-100 dark:bg-slate-800 md:my-2"></div>

            {/* Guest Counter */}
            <div className="w-full md:w-[140px] md:flex-shrink-0 relative group/input">
                <Popover open={openGuests} onOpenChange={setOpenGuests}>
                    <PopoverTrigger asChild>
                        <div className="h-full px-4 md:px-5 py-3 md:py-3 bg-transparent hover:bg-gray-50 dark:hover:bg-slate-800 md:rounded-full rounded-2xl cursor-pointer transition-colors flex items-center gap-3 active:ring-2 active:ring-red-500">
                            <Users className={`w-5 h-5 shrink-0 ${guests > 1 ? "text-red-500" : "text-gray-400 group-hover/input:text-red-500"} transition-colors`} />
                            <div className="text-left min-w-0 overflow-hidden flex-1">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 cursor-pointer">Guests</label>
                                <p className={`text-sm truncate font-bold ${guests > 0 ? "text-gray-900 dark:text-white" : "text-gray-400"}`}>
                                    {guests === 0 ? 'Add Guests' : `${guests} ${guests === 1 ? 'Guest' : 'Guests'}`}
                                </p>
                            </div>
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-[360px] p-0 overflow-hidden" align="end" sideOffset={12}>
                        <div className="p-6 space-y-6 bg-white dark:bg-slate-900">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div className="flex flex-col">
                                    <span className="font-black text-gray-900 dark:text-white">Total Guests</span>
                                    <span className="text-xs text-gray-400 font-medium leading-relaxed">Include all adults and children</span>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-800 p-1.5 rounded-full border border-gray-100 dark:border-slate-700 w-fit self-start md:self-auto">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        type="button"
                                        className="h-9 w-9 rounded-full bg-white dark:bg-slate-700 shadow-sm hover:scale-110 active:scale-90 transition-all border border-gray-100 dark:border-slate-600 disabled:opacity-30 text-xs font-bold text-gray-900 dark:text-white"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setGuests(Math.max(0, guests - 10));
                                        }}
                                        disabled={guests < 10}
                                    >
                                        -10
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        type="button"
                                        className="h-9 w-9 rounded-full bg-white dark:bg-slate-700 shadow-sm hover:scale-110 active:scale-90 transition-all border border-gray-100 dark:border-slate-600 disabled:opacity-30"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setGuests(Math.max(0, guests - 1));
                                        }}
                                        disabled={guests <= 0}
                                    >
                                        <Minus className="h-4 w-4 text-gray-900 dark:text-white" />
                                    </Button>
                                    <span className="w-10 text-center text-base font-black text-gray-900 dark:text-white">{guests}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        type="button"
                                        className="h-9 w-9 rounded-full bg-white dark:bg-slate-700 shadow-sm hover:scale-110 active:scale-90 transition-all border border-gray-100 dark:border-slate-600 disabled:opacity-30"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setGuests(Math.min(1200, guests + 1));
                                        }}
                                        disabled={guests >= 1200}
                                    >
                                        <Plus className="h-4 w-4 text-gray-900 dark:text-white" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        type="button"
                                        className="h-9 w-9 rounded-full bg-white dark:bg-slate-700 shadow-sm hover:scale-110 active:scale-90 transition-all border border-gray-100 dark:border-slate-600 disabled:opacity-30 text-xs font-bold text-gray-900 dark:text-white"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setGuests(Math.min(1200, guests + 10));
                                        }}
                                        disabled={guests >= 1200}
                                    >
                                        +10
                                    </Button>
                                </div>
                            </div>

                            <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-100 dark:border-red-900/30">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                                        <Sparkles className="w-4 h-4 text-red-600" />
                                    </div>
                                    <p className="text-xs text-red-900 dark:text-red-300 font-bold leading-tight">
                                        Capacity validation active for selected venues.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

                    </>
                )}
                {/* Search Button */}
                <div className="p-2 md:p-2 pt-0 md:pt-2">
                    <button
                        onClick={handleSearch}
                        className="w-full md:w-[60px] h-14 md:h-[60px] bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg transform transition-all  active:scale-95 group/btn"
                    >
                        <Search className="h-6 w-6 group-hover/btn:scale-110 transition-transform" />
                        <span className="md:hidden ml-2 font-bold text-lg">Search</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
