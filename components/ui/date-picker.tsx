"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, ButtonProps } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerWithRangeProps extends ButtonProps {
  date?: DateRange;
  onDateChange?: (date: DateRange | undefined) => void;
  name?: string;
}

export function DatePickerWithRange({
  className,
  date,
  onDateChange,
  name,
  ...restProps
}: DatePickerWithRangeProps) {
  const [localDate, setLocalDate] = React.useState<DateRange | undefined>({
    from: date?.from || new Date(),
    to: date?.to || addDays(new Date(), 20),
  });

  const handleSelect = (range: DateRange | undefined) => {
    setLocalDate(range);
    onDateChange?.(range);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      {name && (
        <input 
          type="hidden" 
          name={name} 
          value={localDate ? JSON.stringify(localDate) : ""} 
        />
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !localDate && "text-muted-foreground"
            )}
            {...restProps}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {localDate?.from ? (
              localDate.to ? (
                <>
                  {format(localDate.from, "LLL dd, y")} -{" "}
                  {format(localDate.to, "LLL dd, y")}
                </>
              ) : (
                format(localDate.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={localDate?.from}
            selected={localDate}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function DatePicker() {
  const [date, setDate] = React.useState<Date>()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
} 