"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type TimePickerProps = {
  className?: string;
  value?: string | undefined;
  onChange?: (time: string | undefined) => void;
  id?: string;
  placeholder?: string;
};

const TimePicker = ({
  value,
  onChange,
  className,
  placeholder,
  ...props
}: TimePickerProps) => {
  const [open, setOpen] = useState(false);
  const hoursContainerRef = useRef<HTMLDivElement>(null);
  const minutesContainerRef = useRef<HTMLDivElement>(null);

  // Parse current value or default to 00:00
  const [hours, minutes] = value ? value.split(":") : ["00", "00"];
  const currentHour = parseInt(hours);
  const currentMinute = parseInt(minutes);

  const handleTimeChange = (hour: number, minute: number) => {
    const timeString = `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
    onChange?.(timeString);
  };

  // Generate hours (0-23)
  const hoursArray = Array.from({ length: 24 }, (_, i) => i);
  // Generate minutes (0-59)
  const minutesArray = Array.from({ length: 60 }, (_, i) => i);

  // Scroll to selected time when popover opens
  useEffect(() => {
    if (open) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        // Scroll hours container
        if (hoursContainerRef.current) {
          const hourButton = hoursContainerRef.current.querySelector(
            `[data-hour="${currentHour}"]`
          );
          if (hourButton) {
            hourButton.scrollIntoView({ block: "center", behavior: "smooth" });
          }
        }

        // Scroll minutes container
        if (minutesContainerRef.current) {
          const minuteButton = minutesContainerRef.current.querySelector(
            `[data-minute="${currentMinute}"]`
          );
          if (minuteButton) {
            minuteButton.scrollIntoView({
              block: "center",
              behavior: "smooth",
            });
          }
        }
      }, 50);
    }
  }, [open, currentHour, currentMinute]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"unstyled"}
          className={cn(
            "justify-start px-0",
            !value && "text-muted-foreground",
            className
          )}
          {...props}
        >
          {value ? value : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-auto" portalled={false}>
        <div className="flex">
          {/* Hours */}
          <div className="h-60 w-20 overflow-y-auto" ref={hoursContainerRef}>
            <div className="p-2 flex flex-col gap-2">
              {hoursArray.map((hour) => (
                <Button
                  key={hour}
                  variant="ghost"
                  size="sm"
                  data-hour={hour}
                  className={cn(
                    "w-full justify-center",
                    currentHour === hour &&
                      "bg-primary text-primary-foreground hover:bg-primary/80"
                  )}
                  onClick={() => handleTimeChange(hour, currentMinute)}
                  type="button"
                >
                  {hour.toString().padStart(2, "0")}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center px-2 text-muted-foreground">:</div>

          {/* Minutes */}
          <div className="h-60 w-20 overflow-y-auto" ref={minutesContainerRef}>
            <div className="p-2 flex flex-col gap-2">
              {minutesArray.map((minute) => (
                <Button
                  key={minute}
                  variant="ghost"
                  size="sm"
                  data-minute={minute}
                  className={cn(
                    "w-full justify-center",
                    currentMinute === minute &&
                      "bg-primary text-primary-foreground hover:bg-primary/80"
                  )}
                  onClick={() => handleTimeChange(currentHour, minute)}
                  type="button"
                >
                  {minute.toString().padStart(2, "0")}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TimePicker;
