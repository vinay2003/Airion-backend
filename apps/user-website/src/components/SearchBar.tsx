import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, MapPin, Search, Users, Check, Minus, Plus } from 'lucide-react';
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
        <div className="bg-white dark:bg-slate-900 p-2 rounded-[2rem] shadow-airbnb-hover hover:shadow-[0_20px_50px_-12px_rgba(225,29,72,0.3)] border border-gray-100 dark:border-slate-700 flex flex-col md:flex-row gap-2 max-w-4xl mx-auto transition-shadow duration-500">
            {/* Location Selector */}
            <div className="flex-1 relative group/input overflow-visible h-auto">
                <Popover open={openLocation} onOpenChange={setOpenLocation}>
                    <PopoverTrigger asChild>
                        <div className="h-full px-4 md:px-6 py-3 md:py-4 bg-transparent hover:bg-gray-50 dark:hover:bg-slate-800 md:rounded-full rounded-2xl cursor-pointer transition-colors flex items-center gap-3">
                            <MapPin className={`w-5 h-5 shrink-0 ${location ? "text-red-500" : "text-gray-400 group-hover/input:text-red-500"} transition-colors`} />
                            <div className="text-left">
                                <label className="block text-xs font-bold text-gray-800 dark:text-white cursor-pointer">Location</label>
                                <div className={`text-sm truncate ${location ? "text-gray-900 dark:text-white font-medium" : "text-gray-400"}`}>
                                    {location ? (
                                        POPULAR_LOCATIONS.find((loc) => loc.value === location)?.label || location
                                    ) : (
                                        <TypewriterEffect words={["Mumbai", "Goa", "Delhi", "Bangalore", "Jaipur", "Udaipur"]} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </PopoverTrigger>
                    <PopoverContent side="bottom" sideOffset={10} className="p-0 w-64 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-gray-200 dark:border-slate-800 shadow-xl rounded-2xl overflow-hidden z-[100] absolute mt-2 mb-4" align="start">
                        <Command className="bg-transparent text-inherit border-none">
                            <div className="border-b border-gray-200 dark:border-slate-800">
                                <CommandInput 
                                    placeholder="Search location..." 
                                    className="border-none focus:ring-0 text-slate-900 dark:text-slate-100 placeholder:text-gray-400 placeholder:font-normal bg-transparent"
                                    value={location}
                                    onValueChange={setLocation}
                                    onFocus={(e) => e.target.select()}
                                />
                            </div>
                            <CommandList className="max-h-48">
                                <CommandEmpty 
                                    className="text-gray-500 py-4 text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                                    onClick={() => setOpenLocation(false)}
                                >
                                    No location found. Use "{location}"?
                                </CommandEmpty>
                                <CommandGroup heading="Suggestions" className="text-gray-500 [&_[cmdk-group-heading]]:text-gray-400 [&_[cmdk-group-heading]]:font-semibold">
                                    {POPULAR_LOCATIONS.map((loc) => (
                                        <CommandItem
                                            key={loc.value}
                                            value={loc.label} // Search by label
                                            onSelect={() => {
                                                setLocation(loc.label);
                                                setOpenLocation(false);
                                            }}
                                            className="cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 aria-selected:bg-gray-100 dark:aria-selected:bg-slate-800 aria-selected:text-slate-900 dark:aria-selected:text-white data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-slate-800 data-[highlighted]:text-slate-900 dark:data-[highlighted]:text-white transition-colors"
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    location === loc.label ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {loc.label}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            <div className="w-full h-px md:w-px md:h-auto bg-gray-100 dark:bg-slate-800 md:my-2"></div>

            {/* Date Range Picker */}
            <div className="flex-1 relative group/input overflow-visible h-auto">
                <Popover open={openDate} onOpenChange={setOpenDate}>
                    <PopoverTrigger asChild>
                        <div className="h-full px-4 md:px-6 py-3 md:py-4 bg-transparent hover:bg-gray-50 dark:hover:bg-slate-800 md:rounded-full rounded-2xl cursor-pointer transition-colors flex items-center gap-3">
                            <CalendarIcon className={`w-5 h-5 shrink-0 ${date?.from ? "text-red-500" : "text-gray-400 group-hover/input:text-red-500"} transition-colors`} />
                            <div className="text-left">
                                <label className="block text-xs font-bold text-gray-800 dark:text-white cursor-pointer">Date</label>
                                <p className={`text-sm truncate ${date?.from ? "text-gray-900 dark:text-white font-medium" : "text-gray-400"}`}>
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
                    <PopoverContent side="bottom" sideOffset={10} className="w-auto p-0 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-gray-200 dark:border-slate-800 shadow-xl rounded-2xl overflow-hidden z-[100] absolute mt-2 mb-4" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={1}
                            pagedNavigation
                            onDayKeyDown={(_day, _modifiers, e) => {
                                if (e.key === 'Enter') {
                                    setOpenDate(false);
                                }
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            <div className="w-full h-px md:w-px md:h-auto bg-gray-100 dark:bg-slate-800 md:my-2"></div>

            {/* Guest Counter */}
            <div className="flex-1 relative group/input overflow-visible h-auto">
                <Popover open={openGuests} onOpenChange={setOpenGuests}>
                    <PopoverTrigger asChild>
                        <div className="h-full px-4 md:px-6 py-3 md:py-4 bg-transparent hover:bg-gray-50 dark:hover:bg-slate-800 md:rounded-full rounded-2xl cursor-pointer transition-colors flex items-center gap-3">
                            <Users className={`w-5 h-5 shrink-0 ${guests > 1 ? "text-red-500" : "text-gray-400 group-hover/input:text-red-500"} transition-colors`} />
                            <div className="text-left">
                                <label className="block text-xs font-bold text-gray-800 dark:text-white cursor-pointer">Guests</label>
                                <p className="text-sm text-gray-900 dark:text-white font-medium truncate">
                                    {guests} {guests === 1 ? 'Guest' : 'Guests'}
                                </p>
                            </div>
                        </div>
                    </PopoverTrigger>
                    <PopoverContent
                        side="bottom"
                        sideOffset={15}
                        className="w-80 p-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-gray-100 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2rem] z-[100] absolute mt-2"
                        align="start"
                    >
                        <div className="flex flex-col gap-6">
                            <div className="text-center">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-slate-500">Configure Capacity</span>
                                <h3 className="text-lg font-black text-gray-900 dark:text-white mt-1 uppercase italic tracking-tighter">Total Guests</h3>
                            </div>

                            <div className="flex flex-col items-center gap-4 py-2">
                                <div className="flex items-center justify-center gap-2 w-full">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-10 px-3 rounded-xl font-black text-xs border-gray-100 dark:border-slate-800 hover:bg-red-50 hover:text-red-600 transition-all"
                                        onClick={() => setGuests((g) => Math.max(1, g - 10))}
                                        disabled={guests <= 1}
                                    >
                                        -10
                                    </Button>
                                    
                                    <div className="flex items-center bg-gray-50 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-inner">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-10 w-10 rounded-xl hover:bg-white dark:hover:bg-slate-700 shadow-sm transition-all"
                                            onClick={() => setGuests(Math.max(1, guests - 1))}
                                            disabled={guests <= 1}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        
                                        <input
                                            type="number"
                                            value={guests}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value);
                                                if (!isNaN(val)) setGuests(Math.min(10000, Math.max(1, val)));
                                            }}
                                            className="w-16 h-10 text-center text-xl font-black bg-transparent border-none focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-red-600 dark:text-red-500"
                                        />

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-10 w-10 rounded-xl hover:bg-white dark:hover:bg-slate-700 shadow-sm transition-all"
                                            onClick={() => setGuests(Math.min(10000, guests + 1))}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-10 px-3 rounded-xl font-black text-xs border-gray-100 dark:border-slate-800 hover:bg-red-50 hover:text-red-600 transition-all"
                                        onClick={() => setGuests((g) => Math.min(10000, g + 10))}
                                    >
                                        +10
                                    </Button>
                                </div>

                                <div className="grid grid-cols-4 gap-2 w-full pt-2">
                                    {[10, 50, 100, 500].map((quickVal) => (
                                        <button
                                            key={quickVal}
                                            onClick={() => setGuests(quickVal)}
                                            className={`py-2 text-[10px] font-black uppercase tracking-widest border rounded-xl transition-all ${
                                                guests === quickVal 
                                                ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-500/20' 
                                                : 'border-gray-100 dark:border-slate-800 hover:border-red-500/30 hover:bg-red-50/50'
                                            }`}
                                        >
                                            {quickVal}+
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="pt-2 border-t border-gray-50 dark:border-slate-800/50">
                                <p className="text-[10px] text-gray-400 font-bold text-center italic tracking-tight">
                                    Support for premium events up to 10,000 guests.
                                </p>
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
