import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, MapPin, Search, Users, Check, Minus, Plus, Sparkles } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from './ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from './ui/popover';
import { POPULAR_LOCATIONS } from '../lib/constants';

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
            {`Search "${words[index].substring(0, subIndex)}"`}
            <span className={`ml-0.5 w-[2px] h-4 bg-red-500 ${blink ? 'opacity-100' : 'opacity-0'}`}></span>
        </span>
    );
};

const SearchBar = () => {
    const navigate = useNavigate();
    const [location, setLocation] = useState("");
    const [openLocation, setOpenLocation] = useState(false);

    const [date, setDate] = useState<DateRange | undefined>(undefined);
    const [openDate, setOpenDate] = useState(false);

    const [guests, setGuests] = useState(1);
    const [openGuests, setOpenGuests] = useState(false);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (location) params.append('location', location);
        if (date?.from) params.append('check_in', date.from.toISOString());
        if (date?.to) params.append('check_out', date.to.toISOString());
        params.append('guests', guests.toString());

        navigate(`/search?${params.toString()}`);
    };

    return (
        <div className="relative z-[100] bg-white dark:bg-slate-900 p-2 rounded-[2rem] shadow-airbnb-hover hover:shadow-[0_20px_50px_-12px_rgba(225,29,72,0.3)] border border-gray-100 dark:border-slate-700 flex flex-col md:flex-row gap-0 md:gap-2 max-w-4xl mx-auto transition-shadow duration-500">
            {/* Location Selector */}
            <div className="flex-1 relative group/input w-full border-b md:border-b-0 border-gray-100 dark:border-slate-800">
                <Popover open={openLocation} onOpenChange={setOpenLocation}>
                    <PopoverTrigger asChild>
                        <div className="h-full px-4 md:px-6 py-4 md:py-4 bg-transparent hover:bg-gray-50 dark:hover:bg-slate-800 md:rounded-full rounded-2xl cursor-pointer transition-colors flex items-center gap-3 active:ring-2 active:ring-red-500">
                            <MapPin className={`w-5 h-5 shrink-0 ${location ? "text-red-500" : "text-gray-400 group-hover/input:text-red-500"} transition-colors`} />
                            <div className="text-left">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 cursor-pointer">Location</label>
                                <div className={`text-base truncate ${location ? "text-gray-900 dark:text-white font-bold" : "text-gray-400"}`}>
                                    {location ? (
                                        POPULAR_LOCATIONS.find((loc) => loc.value === location)?.label || location
                                    ) : (
                                        <TypewriterEffect words={["Mumbai", "Goa", "Delhi", "Bangalore", "Jaipur", "Udaipur"]} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-[350px] overflow-hidden" align="start">
                        <Command className="border-none bg-white dark:bg-slate-900">
                            <CommandInput placeholder="Where are you heading?" className="h-14 font-medium" />
                            <CommandList className="max-h-[300px] py-2">
                                <CommandEmpty className="py-6 text-sm text-gray-400">No matching destinations found.</CommandEmpty>
                                <CommandGroup heading={<span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-2">Popular Destinations</span>}>
                                    {POPULAR_LOCATIONS.map((loc) => (
                                        <CommandItem
                                            key={loc.value}
                                            value={loc.label}
                                            onSelect={() => {
                                                setLocation(loc.value === location ? "" : loc.value);
                                                setOpenLocation(false);
                                            }}
                                            className="cursor-pointer mx-2 rounded-xl my-1 p-3 hover:bg-red-50 dark:hover:bg-red-950/20 group transition-all"
                                        >
                                            <div className="flex items-center gap-4 w-full">
                                                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors shadow-sm">
                                                    <MapPin className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-900 dark:text-white group-hover:text-red-600">{loc.label}</span>
                                                    <span className="text-xs text-gray-400">Experience the best of {loc.label}</span>
                                                </div>
                                                <Check
                                                    className={cn(
                                                        "ml-auto h-5 w-5 text-red-500",
                                                        location === loc.value ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                            </div>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            <div className="hidden md:block w-px bg-gray-200 dark:bg-slate-700 my-2"></div>

            {/* Date Range Picker */}
            <div className="flex-1 relative group/input w-full">
                <Popover open={openDate} onOpenChange={setOpenDate}>
                    <PopoverTrigger asChild>
                        <div className="h-full px-4 md:px-6 py-3 md:py-4 bg-transparent hover:bg-gray-50 dark:hover:bg-slate-800 md:rounded-full rounded-2xl cursor-pointer transition-colors flex items-center gap-3 active:ring-2 active:ring-red-500">
                            <CalendarIcon className={`w-5 h-5 shrink-0 ${date?.from ? "text-red-500" : "text-gray-400 group-hover/input:text-red-500"} transition-colors`} />
                            <div className="text-left">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 cursor-pointer">Date</label>
                                <p className={`text-base truncate ${date?.from ? "text-gray-900 dark:text-white font-bold" : "text-gray-400"}`}>
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
                    <PopoverContent className="w-auto p-0 border-none shadow-2xl overflow-hidden rounded-[2rem]" align="start">
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
                            numberOfMonths={2}
                            pagedNavigation
                            className="bg-white dark:bg-slate-900"
                        />
                    </PopoverContent>
                </Popover>
            </div>

            <div className="hidden md:block w-px bg-gray-200 dark:bg-slate-700 my-2"></div>

            {/* Guest Counter */}
            <div className="flex-1 relative group/input w-full">
                <Popover open={openGuests} onOpenChange={setOpenGuests}>
                    <PopoverTrigger asChild>
                        <div className="h-full px-4 md:px-6 py-4 md:py-4 bg-transparent hover:bg-gray-50 dark:hover:bg-slate-800 md:rounded-full rounded-2xl cursor-pointer transition-colors flex items-center gap-3 active:ring-2 active:ring-red-500">
                            <Users className={`w-5 h-5 shrink-0 ${guests > 1 ? "text-red-500" : "text-gray-400 group-hover/input:text-red-500"} transition-colors`} />
                            <div className="text-left">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 cursor-pointer">Guests</label>
                                <p className="text-base text-gray-900 dark:text-white font-bold truncate">
                                    {guests} {guests === 1 ? 'Guest' : 'Guests'}
                                </p>
                            </div>
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-[320px] p-0 overflow-hidden" align="start">
                        <div className="p-6 space-y-6 bg-white dark:bg-slate-900">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="font-black text-gray-900 dark:text-white">Total Guests</span>
                                    <span className="text-xs text-gray-400 font-medium leading-relaxed">Include all adults and children</span>
                                </div>
                                <div className="flex items-center gap-4 bg-gray-50 dark:bg-slate-800 p-1.5 rounded-full border border-gray-100 dark:border-slate-700">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 rounded-full bg-white dark:bg-slate-700 shadow-sm hover:scale-110 active:scale-90 transition-all border border-gray-100 dark:border-slate-600 disabled:opacity-30"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setGuests(Math.max(1, guests - 1));
                                        }}
                                        disabled={guests <= 1}
                                    >
                                        <Minus className="h-4 w-4 text-gray-900 dark:text-white" />
                                    </Button>
                                    <span className="w-6 text-center text-lg font-black text-gray-900 dark:text-white">{guests}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 rounded-full bg-white dark:bg-slate-700 shadow-sm hover:scale-110 active:scale-90 transition-all border border-gray-100 dark:border-slate-600"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setGuests(Math.min(500, guests + 1));
                                        }}
                                    >
                                        <Plus className="h-4 w-4 text-gray-900 dark:text-white" />
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

            {/* Search Button */}
            <div className="p-2 md:p-2 pt-0 md:pt-2">
                <button
                    onClick={handleSearch}
                    className="w-full md:w-[60px] h-14 md:h-[60px] bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg transform transition-all hover:scale-105 active:scale-95 group/btn"
                >
                    <Search className="h-6 w-6 group-hover/btn:scale-110 transition-transform" />
                    <span className="md:hidden ml-2 font-bold text-lg">Search</span>
                </button>
            </div>
        </div>
    );
};

export default SearchBar;
