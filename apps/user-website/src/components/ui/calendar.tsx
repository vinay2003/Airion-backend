import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: CalendarProps) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn("p-3", className)}
            classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center mb-4",
                caption_label: "text-sm font-black text-gray-900 dark:text-gray-100",
                nav: "space-x-1 flex items-center",
                nav_button: cn(
                    buttonVariants({ variant: "outline" }),
                    "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 dark:border-slate-700 dark:text-slate-300"
                ),
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex mb-2",
                head_cell:
                    "text-gray-500 dark:text-slate-400 rounded-md w-10 font-black text-[0.7rem] uppercase tracking-tighter",
                row: "flex w-full mt-1",
                cell: "h-10 w-10 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-10 w-10 p-0 font-bold text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-slate-800 aria-selected:opacity-100 transition-all rounded-full"
                ),
                day_range_end: "day-range-end",
                day_selected:
                    "bg-red-600 text-white hover:bg-red-700 hover:text-white focus:bg-red-600 focus:text-white dark:bg-red-600 shadow-lg",
                day_today: "bg-gray-100 dark:bg-slate-800 text-red-600 font-black",
                day_outside:
                    "day-outside text-gray-300 dark:text-slate-600 opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                day_disabled: "text-gray-200 dark:text-slate-700 opacity-50",
                day_range_middle:
                    "aria-selected:bg-red-50 dark:aria-selected:bg-red-950/20 aria-selected:text-red-600",
                day_hidden: "invisible",
                ...classNames,
            }}
            components={{
                IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
                IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
            }}
            {...props}
        />
    )
}
Calendar.displayName = "Calendar"

export { Calendar }
