"use client";

import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DatePickerProps = {
  className?: string;
  value?: Date | undefined;
  onChange?: (date: Date | undefined) => void;
  id?: string;
  placeholder?: string;
};
const DatePicker = ({
  value,
  onChange,
  className,
  placeholder,
  ...props
}: DatePickerProps) => {
  return (
    <Popover>
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
          {value ? format(value, "dd/MM/yyyy") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-auto">
        <Calendar
          captionLayout="dropdown"
          mode="single"
          selected={value}
          onSelect={onChange}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
