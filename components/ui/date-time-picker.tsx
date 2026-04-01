"use client";

import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DateTimePickerProps = {
  className?: string;
  value?: string; // "YYYY-MM-DDTHH:mm"
  onChange?: (value: string) => void;
  placeholder?: string;
};

const DateTimePicker = ({
  value,
  onChange,
  className,
  placeholder,
}: DateTimePickerProps) => {
  const [open, setOpen] = useState(false);
  const hoursContainerRef = useRef<HTMLDivElement>(null);
  const minutesContainerRef = useRef<HTMLDivElement>(null);

  const [datePart, timePart] = value ? value.split("T") : ["", ""];
  const selectedDate = datePart ? new Date(datePart) : undefined;
  const [timeHour, timeMinute] = timePart
    ? timePart.split(":").map(Number)
    : [0, 0];

  const now = new Date();
  const isToday =
    selectedDate &&
    selectedDate.getFullYear() === now.getFullYear() &&
    selectedDate.getMonth() === now.getMonth() &&
    selectedDate.getDate() === now.getDate();

  const minHour = isToday ? now.getHours() : 0;

  const hoursArray = Array.from({ length: 24 }, (_, i) => i);
  const minutesArray = Array.from({ length: 60 }, (_, i) => i);

  const buildValue = (date: Date, hour: number, minute: number) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(hour).padStart(2, "0");
    const min = String(minute).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    const newDate = new Date(date);
    const isNewToday =
      newDate.getFullYear() === now.getFullYear() &&
      newDate.getMonth() === now.getMonth() &&
      newDate.getDate() === now.getDate();

    let h = timeHour;
    let m = timeMinute;

    if (isNewToday) {
      if (h < now.getHours()) h = now.getHours();
      if (h === now.getHours() && m <= now.getMinutes())
        m = now.getMinutes() + 1;
    }

    onChange?.(buildValue(newDate, h, m));
  };

  const handleHourChange = (hour: number) => {
    if (!selectedDate) return;
    let m = timeMinute;
    if (isToday && hour === now.getHours() && m <= now.getMinutes()) {
      m = now.getMinutes() + 1;
    }
    onChange?.(buildValue(selectedDate, hour, m));
  };

  const handleMinuteChange = (minute: number) => {
    if (!selectedDate) return;
    onChange?.(buildValue(selectedDate, timeHour, minute));
  };

  useEffect(() => {
    if (!open) return;
    setTimeout(() => {
      hoursContainerRef.current
        ?.querySelector(`[data-hour="${timeHour}"]`)
        ?.scrollIntoView({ block: "center", behavior: "smooth" });
      minutesContainerRef.current
        ?.querySelector(`[data-minute="${timeMinute}"]`)
        ?.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 50);
  }, [open, timeHour, timeMinute]);

  const displayValue =
    selectedDate && timePart
      ? `${format(selectedDate, "dd/MM/yyyy")} ${String(timeHour).padStart(2, "0")}:${String(timeMinute).padStart(2, "0")}`
      : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="unstyled"
          className={cn(
            "justify-start px-0 font-normal text-sm",
            !displayValue && "text-muted-foreground",
            className,
          )}
        >
          {displayValue ?? <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-auto" align="start">
        <div className="flex">
          <Calendar
            captionLayout="dropdown"
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={{ before: now }}
          />
          <div className="border-l flex">
            {/* Hours */}
            <div className="h-60 w-16 overflow-y-auto" ref={hoursContainerRef}>
              <div className="p-2 flex flex-col gap-1">
                {hoursArray.map((hour) => {
                  const disabled = isToday && hour < minHour;
                  return (
                    <Button
                      key={hour}
                      type="button"
                      variant="ghost"
                      size="sm"
                      data-hour={hour}
                      disabled={disabled || !selectedDate}
                      className={cn(
                        "w-full justify-center",
                        timeHour === hour &&
                          "bg-primary text-primary-foreground hover:bg-primary/80",
                      )}
                      onClick={() => handleHourChange(hour)}
                    >
                      {String(hour).padStart(2, "0")}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center px-1 text-muted-foreground">
              :
            </div>

            {/* Minutes */}
            <div
              className="h-60 w-16 overflow-y-auto"
              ref={minutesContainerRef}
            >
              <div className="p-2 flex flex-col gap-1">
                {minutesArray.map((minute) => {
                  const disabled =
                    isToday &&
                    timeHour === now.getHours() &&
                    minute <= now.getMinutes();
                  return (
                    <Button
                      key={minute}
                      type="button"
                      variant="ghost"
                      size="sm"
                      data-minute={minute}
                      disabled={disabled || !selectedDate}
                      className={cn(
                        "w-full justify-center",
                        timeMinute === minute &&
                          "bg-primary text-primary-foreground hover:bg-primary/80",
                      )}
                      onClick={() => handleMinuteChange(minute)}
                    >
                      {String(minute).padStart(2, "0")}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateTimePicker;
