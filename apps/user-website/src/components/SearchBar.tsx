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
        <div className="bg-white dark:bg-slate-900 p-2 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-slate-700 flex flex-col md:flex-row gap-2 max-w-4xl mx-auto">
            {/* Location Selector */}
            <div className="flex-1 relative group/input">
                <Popover open={openLocation} onOpenChange={setOpenLocation}>
                    <PopoverTrigger asChild>
                        <div className="h-full px-6 py-4 bg-transparent hover:bg-gray-50 dark:hover:bg-slate-800 rounded-full cursor-pointer transition-colors flex items-center gap-3">
                            <MapPin className={`w-5 h-5 ${location ? "text-red-500" : "text-gray-400 group-hover/input:text-red-500"} transition-colors`} />
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
                    <PopoverContent className="p-0 w-[300px]" align="start">
                        <Command>
                            <CommandInput placeholder="Search location..." />
                            <CommandList>
                                <CommandEmpty>No location found.</CommandEmpty>
                                <CommandGroup heading="Suggestions">
                                    {POPULAR_LOCATIONS.map((loc) => (
                                        <CommandItem
                                            key={loc.value}
                                            value={loc.label} // Search by label
                                            onSelect={() => {
                                                setLocation(loc.value === location ? "" : loc.value);
                                                setOpenLocation(false);
                                            }}
                                            className="cursor-pointer"
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    location === loc.value ? "opacity-100" : "opacity-0"
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

            <div className="hidden md:block w-px bg-gray-200 dark:bg-slate-700 my-2"></div>

            {/* Date Range Picker */}
            <div className="flex-1 relative group/input">
                <Popover open={openDate} onOpenChange={setOpenDate}>
                    <PopoverTrigger asChild>
                        <div className="h-full px-6 py-4 bg-transparent hover:bg-gray-50 dark:hover:bg-slate-800 rounded-full cursor-pointer transition-colors flex items-center gap-3">
                            <CalendarIcon className={`w-5 h-5 ${date?.from ? "text-red-500" : "text-gray-400 group-hover/input:text-red-500"} transition-colors`} />
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
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={2}
                            pagedNavigation
                        />
                    </PopoverContent>
                </Popover>
            </div>

            <div className="hidden md:block w-px bg-gray-200 dark:bg-slate-700 my-2"></div>

            {/* Guest Counter */}
            <div className="flex-1 relative group/input">
                <Popover open={openGuests} onOpenChange={setOpenGuests}>
                    <PopoverTrigger asChild>
                        <div className="h-full px-6 py-4 bg-transparent hover:bg-gray-50 dark:hover:bg-slate-800 rounded-full cursor-pointer transition-colors flex items-center gap-3">
                            <Users className={`w-5 h-5 ${guests > 1 ? "text-red-500" : "text-gray-400 group-hover/input:text-red-500"} transition-colors`} />
                            <div className="text-left">
                                <label className="block text-xs font-bold text-gray-800 dark:text-white cursor-pointer">Guests</label>
                                <p className="text-sm text-gray-900 dark:text-white font-medium truncate">
                                    {guests} {guests === 1 ? 'Guest' : 'Guests'}
                                </p>
                            </div>
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-60 p-4" align="start">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Guests</span>
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 rounded-full"
                                    onClick={() => setGuests(Math.max(1, guests - 1))}
                                    disabled={guests <= 1}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-4 text-center text-sm font-bold">{guests}</span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 rounded-full"
                                    onClick={() => setGuests(Math.min(500, guests + 1))}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-3 text-center">
                            Max capacity varies by venue.
                        </p>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Search Button */}
            <div className="p-2">
                <button
                    onClick={handleSearch}
                    className="w-full md:w-auto h-full aspect-square bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg transform transition-all hover:scale-105 active:scale-95 group/btn"
                >
                    <Search className="h-6 w-6 group-hover/btn:scale-110 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default SearchBar;
